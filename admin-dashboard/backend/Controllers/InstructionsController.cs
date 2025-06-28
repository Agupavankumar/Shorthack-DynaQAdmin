using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InstructionsController : ControllerBase
    {
        private readonly IDynamoDBService _dynamoDBService;
        private readonly ILogger<InstructionsController> _logger;

        public InstructionsController( ILogger<InstructionsController> logger, IDynamoDBService dynamoDBService)
        {
            _dynamoDBService = dynamoDBService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Instruction>>> GetAllInstructions()
        {
            try
            {
				var instructions = await _dynamoDBService.GetAllInstructionsAsync();
				//             var instructions =  new List<Instruction>
				//{
				//	new Instruction
				//	{
				//		Id = "dynaq-1751097093207",
				//		Type = "inject-instruction",
				//		Action = "removeElement",
				//		Publish = true,
				//		Selector = "div#root > div > main > div > div",
				//		Content = "",
				//		Timestamp = DateTime.UtcNow.AddDays(-5).ToString("o")
				//	},
				//	new Instruction
				//	{
				//		Id = "dynaq-1751097186964",
				//		Type = "inject-instruction",
				//		Action = "replaceHTML",
				//		Publish = true,
				//		Selector = "div#root > div > main > div > form > div:nth-of-type(7) > label",
				//		Content = "what location?",
				//		Timestamp = DateTime.UtcNow.AddDays(-3).ToString("o")
				//	},
				//};
				return Ok(instructions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving all instructions");
                return StatusCode(500, "Internal server error occurred while retrieving instructions");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Instruction>> GetInstruction(string id)
        {
            try
            {
                var instruction = await _dynamoDBService.GetInstructionByIdAsync(id);
                if (instruction == null)
                {
                    return NotFound($"Instruction with ID {id} not found");
                }
                return Ok(instruction);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving instruction {Id}", id);
                return StatusCode(500, $"Internal server error occurred while retrieving instruction {id}");
            }
        }

        [HttpPost]
        public async Task<ActionResult<Instruction>> CreateInstruction(Instruction instruction)
        {
            try
            {
                if (string.IsNullOrEmpty(instruction.Id))
                {
                    instruction.Id = Guid.NewGuid().ToString();
                }

                if (string.IsNullOrEmpty(instruction.Timestamp))
                {
                    instruction.Timestamp = DateTime.UtcNow.ToString("o");
                }

                var success = await _dynamoDBService.CreateInstructionAsync(instruction);
                if (success)
                {
                    return CreatedAtAction(nameof(GetInstruction), new { id = instruction.Id }, instruction);
                }
                return BadRequest("Could not create instruction");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating instruction");
                return StatusCode(500, "Internal server error occurred while creating instruction");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateInstruction(string id, Instruction instruction)
        {
            try
            {
                if (id != instruction.Id)
                {
                    return BadRequest("ID mismatch");
                }

                var existingInstruction = await _dynamoDBService.GetInstructionByIdAsync(id);
                if (existingInstruction == null)
                {
                    return NotFound($"Instruction with ID {id} not found");
                }

                // Update timestamp for modification
                instruction.Timestamp = DateTime.UtcNow.ToString("o");

                var success = await _dynamoDBService.UpdateInstructionAsync(instruction);
                if (success)
                {
                    return NoContent();
                }
                return BadRequest("Could not update instruction");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating instruction {Id}", id);
                return StatusCode(500, $"Internal server error occurred while updating instruction {id}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInstruction(string id)
        {
            try
            {
                var instruction = await _dynamoDBService.GetInstructionByIdAsync(id);
                if (instruction == null)
                {
                    return NotFound($"Instruction with ID {id} not found");
                }

                var success = await _dynamoDBService.DeleteInstructionAsync(id);
                if (success)
                {
                    return NoContent();
                }
                return BadRequest($"Could not delete instruction {id}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting instruction {Id}", id);
                return StatusCode(500, $"Internal server error occurred while deleting instruction {id}");
            }
        }
    }
}