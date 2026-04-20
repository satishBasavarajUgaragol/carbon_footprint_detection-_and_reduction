using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public interface IPredictionService
{
    Task<List<Prediction>> GenerateFuturePredictionsAsync(int daysAhead);
    Task<Prediction> GetNextWeekPredictionAsync();
}
