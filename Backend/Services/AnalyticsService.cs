using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public class AnalyticsService : IAnalyticsService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AnalyticsService> _logger;
    private static List<DetectionResult> _detectionHistory = new();

    public AnalyticsService(IConfiguration configuration, ILogger<AnalyticsService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<dynamic> GetDashboardMetricsAsync()
    {
        await Task.Delay(0); // Placeholder for async operation
        
        var totalDetections = _detectionHistory.Count;
        var totalEmissions = _detectionHistory.Sum(d => d.TotalEmissions);
        var avgEmissionsPerDetection = totalDetections > 0 ? totalEmissions / totalDetections : 0;
        var topObject = _detectionHistory
            .SelectMany(d => d.Objects)
            .GroupBy(o => o.Name)
            .OrderByDescending(g => g.Sum(o => o.CarbonFootprint))
            .FirstOrDefault();

        _logger.LogInformation("Dashboard metrics calculated");
        return new
        {
            total_detections = totalDetections,
            total_emissions = Math.Round(totalEmissions, 2),
            average_emissions = Math.Round(avgEmissionsPerDetection, 2),
            top_detected_object = topObject?.Key ?? "N/A",
            top_object_emissions = topObject != null ? Math.Round(topObject.Sum(o => o.CarbonFootprint), 2) : 0
        };
    }

    public async Task<dynamic> GetDetailedAnalyticsAsync(int days)
    {
        await Task.Delay(0); // Placeholder for async operation
        
        var startDate = DateTime.UtcNow.AddDays(-days);
        var recentDetections = _detectionHistory.Where(d => d.Timestamp >= startDate).ToList();

        var dailyEmissions = recentDetections
            .GroupBy(d => d.Timestamp.Date)
            .OrderBy(g => g.Key)
            .Select(g => new
            {
                date = g.Key,
                emissions = Math.Round(g.Sum(d => d.TotalEmissions), 2),
                count = g.Count()
            })
            .ToList();

        var objectBreakdown = recentDetections
            .SelectMany(d => d.Objects)
            .GroupBy(o => o.Name)
            .Select(g => new
            {
                object_name = g.Key,
                total_emissions = Math.Round(g.Sum(o => o.CarbonFootprint), 2),
                occurrences = g.Count()
            })
            .OrderByDescending(x => x.total_emissions)
            .ToList();

        _logger.LogInformation($"Detailed analytics calculated for {days} days");
        return new
        {
            period_days = days,
            daily_emissions = dailyEmissions,
            object_breakdown = objectBreakdown
        };
    }
}
