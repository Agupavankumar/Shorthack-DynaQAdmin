using Amazon.DynamoDBv2.DataModel;

namespace backend.Models
{
    [DynamoDBTable("Instructions")]
    public class Instruction
    {
        [DynamoDBHashKey]
        public string Id { get; set; } = string.Empty;

        [DynamoDBProperty]
        public string Type { get; set; } = string.Empty;

        [DynamoDBProperty]
        public string Action { get; set; } = string.Empty;

        [DynamoDBProperty]
        public bool Publish { get; set; }

        [DynamoDBProperty]
        public string Selector { get; set; } = string.Empty;

        [DynamoDBProperty]
        public string? Content { get; set; }

        [DynamoDBProperty]
        public string Timestamp { get; set; } = string.Empty;
    }
}