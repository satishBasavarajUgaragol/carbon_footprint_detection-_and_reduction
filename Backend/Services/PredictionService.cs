using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public class PredictionService : IPredictionService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<PredictionService> _logger;
    private static List<DetectionResult> _detectionHistory = new();

    public PredictionService(IConfiguration configuration, ILogger<PredictionService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<List<Prediction>> GenerateFuturePredictionsAsync(int daysAhead)
    {
        await Task.Delay(0); // Placeholder for async operation
        
        var predictions = new List<Prediction>();
        
        // Calculate historical average
        var historicalAverage = _detectionHistory.Count > 0 
            ? _detectionHistory.Average(d => d.TotalEmissions)
            : 0.5;

        // Generate predictions with trend
        var random = new Random();
        for (int i = 1; i <= daysAhead; i++)
        {
            var variance = random.NextDouble() * 0.2 - 0.1; // ±10% variance
            var predictedEmissions = historicalAverage * (1 + variance);
            
            predictions.Add(new Prediction
            {
                Date = DateTime.UtcNow.AddDays(i),
                PredictedEmissions = Math.Max(0, predictedEmissions),
                Trend = predictedEmissions > historicalAverage ? "Increasing" : "Decreasing",
                Confidence = 0.75 + random.NextDouble() * 0.2
            });
        }

        _logger.LogInformation($"Generated {predictions.Count} future predictions");
        return predictions;
    }

    public async Task<Prediction> GetNextWeekPredictionAsync()
    {
        var predictions = await GenerateFuturePredictionsAsync(7);
        var avgPrediction = predictions.Average(p => p.PredictedEmissions);
        
        return new Prediction
        {
            Date = DateTime.UtcNow.AddDays(7),
            PredictedEmissions = avgPrediction,
            Trend = "Stable",
            Confidence = 0.80
        };
    }
}
