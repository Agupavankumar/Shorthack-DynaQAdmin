using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using backend.Models;

namespace backend.Services
{
    public interface IDynamoDBService
    {
        Task<List<Instruction>> GetAllInstructionsAsync();
        Task<Instruction?> GetInstructionByIdAsync(string id);
        Task<bool> CreateInstructionAsync(Instruction instruction);
        Task<bool> UpdateInstructionAsync(Instruction instruction);
        Task<bool> DeleteInstructionAsync(string id);
    }

    public class DynamoDBService : IDynamoDBService
    {
        private readonly IAmazonDynamoDB _dynamoDBClient;
        private readonly IDynamoDBContext _dynamoDBContext;

        public DynamoDBService(IAmazonDynamoDB dynamoDBClient)
        {
            _dynamoDBClient = dynamoDBClient;
            _dynamoDBContext = new DynamoDBContext(dynamoDBClient);
            EnsureTableExistsAsync().GetAwaiter().GetResult();
        }

        private async Task EnsureTableExistsAsync()
        {
            try
            {
                var tableResponse = await _dynamoDBClient.ListTablesAsync();
                if (!tableResponse.TableNames.Contains("Instructions"))
                {
                    var request = new CreateTableRequest
                    {
                        TableName = "Instructions",
                        AttributeDefinitions = new List<AttributeDefinition>
                        {
                            new AttributeDefinition
                            {
                                AttributeName = "Id",
                                AttributeType = "S"
                            }
                        },
                        KeySchema = new List<KeySchemaElement>
                        {
                            new KeySchemaElement
                            {
                                AttributeName = "Id",
                                KeyType = "HASH"
                            }
                        },
                        ProvisionedThroughput = new ProvisionedThroughput
                        {
                            ReadCapacityUnits = 5,
                            WriteCapacityUnits = 5
                        }
                    };

                    await _dynamoDBClient.CreateTableAsync(request);

                    // Wait until table is created
                    bool tableCreated = false;
                    while (!tableCreated)
                    {
                        var tableStatus = await _dynamoDBClient.DescribeTableAsync("Instructions");
                        tableCreated = tableStatus.Table.TableStatus == "ACTIVE";
                        if (!tableCreated)
                        {
                            await Task.Delay(1000);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating table: {ex.Message}");
                throw;
            }
        }

        public async Task<List<Instruction>> GetAllInstructionsAsync()
        {
            var scan = _dynamoDBContext.ScanAsync<Instruction>(null);
            return await scan.GetRemainingAsync();
        }

        public async Task<Instruction?> GetInstructionByIdAsync(string id)
        {
            return await _dynamoDBContext.LoadAsync<Instruction>(id);
        }

        public async Task<bool> CreateInstructionAsync(Instruction instruction)
        {
            try
            {
                await _dynamoDBContext.SaveAsync(instruction);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> UpdateInstructionAsync(Instruction instruction)
        {
            try
            {
                await _dynamoDBContext.SaveAsync(instruction);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> DeleteInstructionAsync(string id)
        {
            try
            {
                await _dynamoDBContext.DeleteAsync<Instruction>(id);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}