using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public class RecommendationService : IRecommendationService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<RecommendationService> _logger;

    public RecommendationService(IConfiguration configuration, ILogger<RecommendationService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<List<Recommendation>> GenerateRecommendationsAsync()
    {
        await Task.Delay(0); // Placeholder for async operation
        
        var recommendations = new List<Recommendation>
        {
            new Recommendation
            {
                Title = "Switch to Public Transportation",
                Description = "Reduce your carbon footprint by using public transportation instead of driving.",
                PotentialSavings = 2.5,
                Impact = "High",
                Priority = 1
            },
            new Recommendation
            {
                Title = "Adopt Plant-Based Meals",
                Description = "Replace some meat consumption with plant-based alternatives to reduce dietary emissions.",
                PotentialSavings = 1.8,
                Impact = "Medium",
                Priority = 2
            },
            new Recommendation
            {
                Title = "Energy Efficiency at Home",
                Description = "Use LED bulbs and optimize heating/cooling to reduce household energy consumption.",
                PotentialSavings = 1.2,
                Impact = "Medium",
                Priority = 3
            },
            new Recommendation
            {
                Title = "Buy Sustainable Products",
                Description = "Choose eco-friendly and sustainably produced items to lower embedded carbon emissions.",
                PotentialSavings = 0.8,
                Impact = "Medium",
                Priority = 4
            },
            new Recommendation
            {
                Title = "Reduce Shopping Frequency",
                Description = "Buy less new clothing and electronics, or choose secondhand options.",
                PotentialSavings = 1.5,
                Impact = "Medium",
                Priority = 5
            }
        };

        _logger.LogInformation($"Generated {recommendations.Count} recommendations");
        return recommendations;
    }

    public async Task<List<Recommendation>> GetPersonalizedRecommendationsAsync(DetectionResult recentDetection)
    {
        var personalized = new List<Recommendation>();

        foreach (var obj in recentDetection.Objects)
        {
            var objName = obj.Name.ToLower();
            
            if (objName.Contains("car") || objName.Contains("truck") || objName.Contains("bus"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🚗 Switch to Sustainable Transportation",
                    Description = $"We detected a {obj.Name} in your image. Consider public transit, carpooling, cycling, or electric vehicles to reduce transportation emissions.",
                    PotentialSavings = 2.5,
                    Impact = "High",
                    Priority = 1
                });
            }
            else if (objName.Contains("meat") || objName.Contains("beef") || objName.Contains("pork"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🥩 Reduce Meat Consumption",
                    Description = $"Detected {obj.Name} in your image. Meat production has high carbon footprint. Try plant-based alternatives or meatless days.",
                    PotentialSavings = 2.1,
                    Impact = "High",
                    Priority = 2
                });
            }
            else if (objName.Contains("food") || objName.Contains("fruit") || objName.Contains("vegetable"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🥗 Choose Local & Sustainable Food",
                    Description = $"We detected {obj.Name}. Support local farms and choose seasonal produce to reduce food transportation emissions.",
                    PotentialSavings = 1.5,
                    Impact = "Medium",
                    Priority = 3
                });
            }
            else if (objName.Contains("tree") || objName.Contains("forest") || objName.Contains("plant"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🌳 Support Reforestation",
                    Description = $"Detected {obj.Name}. Trees are natural carbon sinks. Support conservation and plant more trees in your community.",
                    PotentialSavings = 0.5,
                    Impact = "Low",
                    Priority = 4
                });
            }
            else if (objName.Contains("factory") || objName.Contains("power_plant") || objName.Contains("industry"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🏭 Support Clean Energy",
                    Description = $"Detected {obj.Name}. Industrial emissions are significant. Choose renewable energy and support green manufacturing.",
                    PotentialSavings = 4.5,
                    Impact = "High",
                    Priority = 5
                });
            }
            else if (objName.Contains("bicycle") || objName.Contains("bike"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🚴 Keep Cycling - Great Choice!",
                    Description = $"We detected a {obj.Name}! Bicycles have zero emissions. Continue cycling and encourage others to join.",
                    PotentialSavings = 0.1,
                    Impact = "Low",
                    Priority = 6
                });
            }
            else if (objName.Contains("shopping") || objName.Contains("bag") || objName.Contains("clothing"))
            {
                personalized.Add(new Recommendation
                {
                    Title = "🛍️ Choose Sustainable Shopping",
                    Description = $"Detected {obj.Name}. Fast fashion and excessive shopping increase carbon footprint. Buy less, choose quality, and support sustainable brands.",
                    PotentialSavings = 1.8,
                    Impact = "Medium",
                    Priority = 7
                });
            }
            else
            {
                personalized.Add(new Recommendation
                {
                    Title = $"🔍 Reduce Impact of {obj.Name}",
                    Description = $"We detected {obj.Name} in your image. Consider sustainable alternatives and reduce usage to minimize environmental impact.",
                    PotentialSavings = 1.0,
                    Impact = "Medium",
                    Priority = 8
                });
            }
        }

        // Remove duplicates based on title
        var uniqueRecommendations = personalized
            .GroupBy(r => r.Title)
            .Select(g => g.First())
            .ToList();

        _logger.LogInformation($"Generated {uniqueRecommendations.Count} personalized recommendations for {recentDetection.Objects.Count} detected objects");
        return uniqueRecommendations;
    }
}
