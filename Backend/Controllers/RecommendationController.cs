using CarbonFootprintAPI.Models;
using CarbonFootprintAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarbonFootprintAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecommendationController : ControllerBase
{
    private readonly IRecommendationService _recommendationService;
    private readonly ILogger<RecommendationController> _logger;

    public RecommendationController(
        IRecommendationService recommendationService,
        ILogger<RecommendationController> logger)
    {
        _recommendationService = recommendationService;
        _logger = logger;
    }

    [HttpGet("all")]
    public async Task<ActionResult<List<Recommendation>>> GetAllRecommendations()
    {
        try
        {
            var recommendations = await _recommendationService.GenerateRecommendationsAsync();
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting recommendations: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("personalized")]
    public async Task<ActionResult<List<Recommendation>>> GetPersonalizedRecommendations(
        [FromBody] DetectionResult detection)
    {
        try
        {
            var recommendations = await _recommendationService.GetPersonalizedRecommendationsAsync(detection);
            return Ok(recommendations);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting personalized recommendations: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }
}
