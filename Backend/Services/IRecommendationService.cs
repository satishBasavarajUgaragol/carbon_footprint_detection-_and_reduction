using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public interface IRecommendationService
{
    Task<List<Recommendation>> GenerateRecommendationsAsync();
    Task<List<Recommendation>> GetPersonalizedRecommendationsAsync(DetectionResult recentDetection);
}
