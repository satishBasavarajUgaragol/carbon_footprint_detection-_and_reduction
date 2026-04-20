using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public class CarbonCalculatorService : ICarbonCalculatorService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<CarbonCalculatorService> _logger;
    private static List<DetectionResult> _detectionHistory = new();

    public CarbonCalculatorService(IConfiguration configuration, ILogger<CarbonCalculatorService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<double> CalculateTotalEmissionsAsync()
    {
        await Task.Delay(0); // Placeholder for async operation
        double total = _detectionHistory.Sum(d => d.TotalEmissions);
        _logger.LogInformation($"Total emissions calculated: {total} kg CO2e");
        return total;
    }

    public async Task<List<CarbonTrend>> GetEmissionsTrendAsync(int days)
    {
        await Task.Delay(0); // Placeholder for async operation
        
        var trends = new List<CarbonTrend>();
        var startDate = DateTime.UtcNow.AddDays(-days);
        
        var groupedByDate = _detectionHistory
            .Where(d => d.Timestamp >= startDate)
            .GroupBy(d => d.Timestamp.Date)
            .OrderBy(g => g.Key);

        foreach (var group in groupedByDate)
        {
            var total = group.Sum(d => d.TotalEmissions);
            trends.Add(new CarbonTrend
            {
                Date = group.Key,
                TotalEmissions = total,
                Count = group.Count(),
                Average = total / group.Count()
            });
        }

        _logger.LogInformation($"Retrieved {trends.Count} trend data points for {days} days");
        return trends;
    }

    public async Task SaveDetectionResultAsync(DetectionResult result)
    {
        await Task.Delay(0); // Placeholder for async operation
        _detectionHistory.Add(result);
        _logger.LogInformation($"Saved detection result with {result.Objects.Count} objects");
        // TODO: Persist to Azure Cosmos DB
    }
}
