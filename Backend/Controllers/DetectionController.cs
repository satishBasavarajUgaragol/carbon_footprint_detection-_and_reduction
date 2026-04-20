using CarbonFootprintAPI.Models;
using CarbonFootprintAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarbonFootprintAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DetectionController : ControllerBase
{
    private readonly IVisionService _visionService;
    private readonly ICarbonCalculatorService _carbonService;
    private readonly ILogger<DetectionController> _logger;

    public DetectionController(
        IVisionService visionService,
        ICarbonCalculatorService carbonService,
        ILogger<DetectionController> logger)
    {
        _visionService = visionService;
        _carbonService = carbonService;
        _logger = logger;
    }

    [HttpPost("analyze-url")]
    public async Task<ActionResult<DetectionResult>> AnalyzeImageUrl([FromBody] ImageUrlRequest request)
    {
        try
        {
            var result = await _visionService.AnalyzeImageAsync(request.ImageUrl);
            await _carbonService.SaveDetectionResultAsync(result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error analyzing image: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("analyze-upload")]
    public async Task<ActionResult<DetectionResult>> AnalyzeImageUpload(IFormFile file)
    {
        try
        {
            using var stream = file.OpenReadStream();
            var result = await _visionService.AnalyzeImageFromFileAsync(stream);
            await _carbonService.SaveDetectionResultAsync(result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error analyzing uploaded image: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("total-emissions")]
    public async Task<ActionResult<double>> GetTotalEmissions()
    {
        try
        {
            var total = await _carbonService.CalculateTotalEmissionsAsync();
            return Ok(new { total_emissions = total });
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error calculating total emissions: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("emissions-trend")]
    public async Task<ActionResult<List<CarbonTrend>>> GetEmissionsTrend([FromQuery] int days = 30)
    {
        try
        {
            var trends = await _carbonService.GetEmissionsTrendAsync(days);
            return Ok(trends);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting emissions trend: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }
}

public class ImageUrlRequest
{
    public string ImageUrl { get; set; } = string.Empty;
}
