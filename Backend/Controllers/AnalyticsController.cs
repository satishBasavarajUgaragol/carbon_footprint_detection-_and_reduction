using CarbonFootprintAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CarbonFootprintAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _analyticsService;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger)
    {
        _analyticsService = analyticsService;
        _logger = logger;
    }

    [HttpGet("dashboard")]
    public async Task<ActionResult<dynamic>> GetDashboard()
    {
        try
        {
            var metrics = await _analyticsService.GetDashboardMetricsAsync();
            return Ok(metrics);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting dashboard metrics: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("detailed")]
    public async Task<ActionResult<dynamic>> GetDetailedAnalytics([FromQuery] int days = 30)
    {
        try
        {
            var analytics = await _analyticsService.GetDetailedAnalyticsAsync(days);
            return Ok(analytics);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error getting detailed analytics: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }
}
