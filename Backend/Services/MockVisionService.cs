using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public class MockVisionService : IVisionService
{
    private readonly ILogger<MockVisionService> _logger;
    private readonly Random _random = new();

    public MockVisionService(ILogger<MockVisionService> logger)
    {
        _logger = logger;
    }

    public async Task<DetectionResult> AnalyzeImageAsync(string imageUrl)
    {
        await Task.Delay(1000); // Simulate processing time
        
        var result = new DetectionResult 
        { 
            ImageUrl = imageUrl,
            Timestamp = DateTime.UtcNow
        };
        
        // Simulate detecting random objects
        var possibleObjects = new[]
        {
            new { Name = "car", Confidence = 0.85 + _random.NextDouble() * 0.1 },
            new { Name = "tree", Confidence = 0.75 + _random.NextDouble() * 0.15 },
            new { Name = "house", Confidence = 0.80 + _random.NextDouble() * 0.1 },
            new { Name = "bicycle", Confidence = 0.90 + _random.NextDouble() * 0.05 },
            new { Name = "food", Confidence = 0.70 + _random.NextDouble() * 0.2 },
            new { Name = "person", Confidence = 0.88 + _random.NextDouble() * 0.08 }
        };

        // Select 1-3 random objects
        var numObjects = _random.Next(1, 4);
        var selectedObjects = possibleObjects.OrderBy(x => _random.Next()).Take(numObjects);

        foreach (var obj in selectedObjects)
        {
            var carbonFootprint = CalculateCarbonFootprint(obj.Name);
            result.Objects.Add(new DetectedObject
            {
                Name = obj.Name,
                Confidence = obj.Confidence,
                CarbonFootprint = carbonFootprint,
                Unit = "kg CO2e"
            });
            result.TotalEmissions += carbonFootprint;
        }

        _logger.LogInformation($"Mock analyzed image with {result.Objects.Count} objects detected");
        return result;
    }

    public async Task<DetectionResult> AnalyzeImageFromFileAsync(Stream imageStream)
    {
        try
        {
            await Task.Delay(1000); // Simulate processing time
            
            var result = new DetectionResult 
            { 
                Timestamp = DateTime.UtcNow,
                Category = "user-upload",
                ImageUrl = "uploaded-image"
            };
            
            // Simulate detecting random objects from uploaded image
            var possibleObjects = new[]
            {
                new { Name = "car", Confidence = 0.85 + _random.NextDouble() * 0.1 },
                new { Name = "tree", Confidence = 0.75 + _random.NextDouble() * 0.15 },
                new { Name = "house", Confidence = 0.80 + _random.NextDouble() * 0.1 },
                new { Name = "bicycle", Confidence = 0.90 + _random.NextDouble() * 0.05 },
                new { Name = "food", Confidence = 0.70 + _random.NextDouble() * 0.2 },
                new { Name = "person", Confidence = 0.88 + _random.NextDouble() * 0.08 },
                new { Name = "factory", Confidence = 0.65 + _random.NextDouble() * 0.2 },
                new { Name = "solar_panels", Confidence = 0.82 + _random.NextDouble() * 0.1 }
            };

            // Select 1-3 random objects
            var numObjects = _random.Next(1, 4);
            var selectedObjects = possibleObjects.OrderBy(x => _random.Next()).Take(numObjects);

            foreach (var obj in selectedObjects)
            {
                var carbonFootprint = CalculateCarbonFootprint(obj.Name);
                result.Objects.Add(new DetectedObject
                {
                    Name = obj.Name,
                    Confidence = obj.Confidence,
                    CarbonFootprint = carbonFootprint,
                    Unit = "kg CO2e"
                });
                result.TotalEmissions += carbonFootprint;
            }

            _logger.LogInformation($"Mock analyzed uploaded image with {result.Objects.Count} objects detected");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error in MockVisionService.AnalyzeImageFromFileAsync: {ex.Message}");
            throw;
        }
    }

    private double CalculateCarbonFootprint(string objectName)
    {
        var carbonDatabase = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase)
        {
            // Transportation
            ["car"] = 0.5,
            ["vehicle"] = 0.5,
            ["bus"] = 0.3,
            ["truck"] = 0.8,
            ["bicycle"] = 0.05,
            ["airplane"] = 2.5,
            ["motorcycle"] = 0.4,
            
            // Buildings & Infrastructure
            ["house"] = 0.8,
            ["building"] = 2.0,
            ["factory"] = 5.0,
            ["power_plant"] = 3.2,
            
            // Nature (positive impact)
            ["tree"] = -20.0,
            ["forest"] = -50.0,
            ["solar_panels"] = -2.5,
            ["wind_turbine"] = -1.8,
            
            // Food
            ["food"] = 0.5,
            ["apple"] = 0.02,
            ["meat"] = 1.5,
            ["vegetables"] = 0.1,
            
            // People & Activities
            ["person"] = 0.001,
            ["shopping_bags"] = 0.3,
            ["plastic_waste"] = 0.2,
            ["recycling_bin"] = -0.1
        };

        return carbonDatabase.TryGetValue(objectName, out var footprint) ? footprint : 0.5;
    }
}
