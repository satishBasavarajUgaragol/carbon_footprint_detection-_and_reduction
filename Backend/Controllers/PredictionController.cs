using CarbonFootprintAPI.Models;
using CarbonFootprintAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarbonFootprintAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PredictionController : ControllerBase
{
    private readonly IPredictionService _predictionService;
    private readonly ILogger<PredictionController> _logger;

    public PredictionController(IPredictionService predictionService, ILogger<PredictionController> logger)
    {
        _predictionService = predictionService;
        _logger = logger;
    }

    [HttpGet("future-emissions")]
    public async Task<ActionResult<List<Prediction>>> GetFuturePredictions([FromQuery] int days = 30)
    {
        try
        {
            var predictions = await _predictionService.GenerateFuturePredictionsAsync(days);
            return Ok(predictions);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error generating predictions: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("next-week")]
    public async Task<ActionResult<Prediction>> GetNextWeekPrediction()
    {
        try
        {
            var prediction = await _predictionService.GetNextWeekPredictionAsync();
            return Ok(prediction);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting next week prediction: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }
}
