using System.Net.WebSockets;
using System.Text;
using System.Collections.Concurrent;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using backend.Services;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Add AWS DynamoDB services
builder.Services.AddSingleton<IAmazonDynamoDB>(sp =>
{
    // For local development, use a local DynamoDB instance
    // In production, use AWS credentials and region from configuration
    var config = new AmazonDynamoDBConfig
    {
        ServiceURL = "http://localhost:1234" // For local DynamoDB, change in production
    };
    return new AmazonDynamoDBClient(config);
});
builder.Services.AddSingleton<IDynamoDBService, DynamoDBService>();

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { 
        Title = "Admin Dashboard API", 
        Version = "v1",
        Description = "API for managing Instructions in DynamoDB",
        Contact = new OpenApiContact
        {
            Name = "Admin Dashboard Team"
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Admin Dashboard API v1");
        c.RoutePrefix = "swagger";
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.List);
        c.DefaultModelsExpandDepth(-1); // Hide models by default
    });
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

// WebSocket handling
app.UseWebSockets();
var clients = new ConcurrentBag<WebSocket>();

app.MapGet("/", () => "Admin Dashboard API running!");

app.Use(async (context, next) =>
{
    if (context.WebSockets.IsWebSocketRequest)
    {
        var webSocket = await context.WebSockets.AcceptWebSocketAsync();
        clients.Add(webSocket);
        var buffer = new byte[1024 * 4];
        while (webSocket.State == WebSocketState.Open)
        {
            var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
            if (result.MessageType == WebSocketMessageType.Text)
            {
                var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                // Broadcast to all clients
                foreach (var client in clients)
                {
                    if (client.State == WebSocketState.Open)
                    {
                        var bytes = Encoding.UTF8.GetBytes(message);
                        await client.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, CancellationToken.None);
                    }
                }
            }
            else if (result.MessageType == WebSocketMessageType.Close)
            {
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closed by client", CancellationToken.None);
            }
        }
    }
    else
    {
        await next();
    }
});

app.Run();
