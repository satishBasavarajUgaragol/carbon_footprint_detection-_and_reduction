using Azure.AI.Vision.ImageAnalysis;
using Azure;
using CarbonFootprintAPI.Models;
using DetectedObject = CarbonFootprintAPI.Models.DetectedObject;

namespace CarbonFootprintAPI.Services;

public class AzureVisionService : IVisionService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<AzureVisionService> _logger;

    public AzureVisionService(IConfiguration configuration, ILogger<AzureVisionService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<DetectionResult> AnalyzeImageAsync(string imageUrl)
    {
        try
        {
            var result = new DetectionResult { ImageUrl = imageUrl };
            
            // Check if we have valid Azure credentials
            string endpoint = _configuration["AzureVision:Endpoint"];
            string apiKey = _configuration["AzureVision:ApiKey"];

            if (string.IsNullOrEmpty(endpoint) || endpoint.Contains("<your-resource>") || 
                string.IsNullOrEmpty(apiKey) || apiKey.Contains("<your-api-key>"))
            {
                _logger.LogInformation("Azure Vision not configured - using mock analysis");
                return await MockAnalyzeImageAsync(imageUrl);
            }

            var client = new ImageAnalysisClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
            
            // Analyze image for objects
            var analysisResult = await client.AnalyzeAsync(
                new Uri(imageUrl),
                VisualFeatures.Objects | VisualFeatures.Tags,
                new ImageAnalysisOptions { Language = "en" });

            // Extract detected objects
            if (analysisResult.Value.Objects != null)
            {
                foreach (var detectedObject in analysisResult.Value.Objects.Values)
                {
                    double carbonFootprint = CalculateCarbonFootprint(detectedObject.Tags.First().Name);
                    
                    result.Objects.Add(new CarbonFootprintAPI.Models.DetectedObject
                    {
                        Name = detectedObject.Tags.First().Name,
                        Confidence = detectedObject.Tags.First().Confidence,
                        CarbonFootprint = carbonFootprint
                    });

                    result.TotalEmissions += carbonFootprint;
                }
            }

            _logger.LogInformation($"Analyzed image with {result.Objects.Count} objects detected");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error analyzing image: {ex.Message}");
            // Fallback to mock analysis if Azure fails
            return await MockAnalyzeImageAsync(imageUrl);
        }
    }

    private async Task<DetectionResult> MockAnalyzeImageAsync(string imageUrl)
    {
        await Task.Delay(1000); // Simulate processing time
        
        var result = new DetectionResult { ImageUrl = imageUrl };
        
        // Simulate detecting random objects
        var possibleObjects = new[]
        {
            new { Name = "car", Confidence = 0.85 + new Random().NextDouble() * 0.1 },
            new { Name = "tree", Confidence = 0.75 + new Random().NextDouble() * 0.15 },
            new { Name = "house", Confidence = 0.80 + new Random().NextDouble() * 0.1 },
            new { Name = "bicycle", Confidence = 0.90 + new Random().NextDouble() * 0.05 },
            new { Name = "food", Confidence = 0.70 + new Random().NextDouble() * 0.2 },
            new { Name = "person", Confidence = 0.88 + new Random().NextDouble() * 0.08 }
        };

        // Select 1-3 random objects
        var random = new Random();
        var numObjects = random.Next(1, 4);
        var selectedObjects = possibleObjects.OrderBy(x => random.Next()).Take(numObjects);

        foreach (var obj in selectedObjects)
        {
            var carbonFootprint = CalculateCarbonFootprint(obj.Name);
            result.Objects.Add(new Models.DetectedObject
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
            var result = new DetectionResult();
            
            string endpoint = _configuration["AzureVision:Endpoint"];
            string apiKey = _configuration["AzureVision:ApiKey"];

            if (string.IsNullOrEmpty(endpoint) || endpoint.Contains("<your-resource>") || 
                string.IsNullOrEmpty(apiKey) || apiKey.Contains("<your-api-key>"))
            {
                _logger.LogInformation("Azure Vision not configured - using mock analysis for uploaded file");
                return await MockAnalyzeImageFromFileAsync(imageStream);
            }

            var client = new ImageAnalysisClient(new Uri(endpoint), new AzureKeyCredential(apiKey));
            
            // Convert stream to byte array
            using (var ms = new MemoryStream())
            {
                await imageStream.CopyToAsync(ms);
                var imageData = ms.ToArray();

                var analysisResult = await client.AnalyzeAsync(
                    BinaryData.FromBytes(imageData),
                    VisualFeatures.Objects | VisualFeatures.Tags,
                    new ImageAnalysisOptions { Language = "en" });

                if (analysisResult.Value.Objects != null)
                {
                    foreach (var detectedObject in analysisResult.Value.Objects.Values)
                    {
                        double carbonFootprint = CalculateCarbonFootprint(detectedObject.Tags.First().Name);
                        
                        result.Objects.Add(new Models.DetectedObject
                        {
                            Name = detectedObject.Tags.First().Name,
                            Confidence = detectedObject.Tags.First().Confidence,
                            CarbonFootprint = carbonFootprint
                        });

                        result.TotalEmissions += carbonFootprint;
                    }
                }
            }

            _logger.LogInformation($"Analyzed uploaded image with {result.Objects.Count} objects detected");
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError($"Error analyzing uploaded image: {ex.Message}");
            // Fallback to mock analysis if Azure fails
            return await MockAnalyzeImageFromFileAsync(imageStream);
        }
    }

    private async Task<DetectionResult> MockAnalyzeImageFromFileAsync(Stream imageStream)
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
            new { Name = "car", Confidence = 0.85 + new Random().NextDouble() * 0.1 },
            new { Name = "tree", Confidence = 0.75 + new Random().NextDouble() * 0.15 },
            new { Name = "house", Confidence = 0.80 + new Random().NextDouble() * 0.1 },
            new { Name = "bicycle", Confidence = 0.90 + new Random().NextDouble() * 0.05 },
            new { Name = "food", Confidence = 0.70 + new Random().NextDouble() * 0.2 },
            new { Name = "person", Confidence = 0.88 + new Random().NextDouble() * 0.08 },
            new { Name = "factory", Confidence = 0.65 + new Random().NextDouble() * 0.2 },
            new { Name = "solar_panels", Confidence = 0.82 + new Random().NextDouble() * 0.1 }
        };

        // Select 1-3 random objects
        var random = new Random();
        var numObjects = random.Next(1, 4);
        var selectedObjects = possibleObjects.OrderBy(x => random.Next()).Take(numObjects);

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

    private double CalculateCarbonFootprint(string objectName)
    {
        // Carbon footprint database for common objects (in kg CO2e)
        var carbonDatabase = new Dictionary<string, double>(StringComparer.OrdinalIgnoreCase)
        {
            // Transportation
            ["car"] = 0.5,
            ["vehicle"] = 0.5,
            ["bus"] = 0.3,
            ["truck"] = 0.8,
            ["bicycle"] = 0.05,
            ["airplane"] = 2.5,
            
            // Food items
            ["apple"] = 0.02,
            ["banana"] = 0.04,
            ["meat"] = 1.5,
            ["chicken"] = 0.8,
            ["fish"] = 0.6,
            ["rice"] = 0.15,
            ["bread"] = 0.1,
            ["milk"] = 0.3,
            
            // Clothing
            ["shirt"] = 2.0,
            ["jeans"] = 6.0,
            ["dress"] = 3.0,
            ["shoe"] = 2.5,
            
            // Electronics
            ["computer"] = 350.0,
            ["phone"] = 70.0,
            ["laptop"] = 280.0,
            ["monitor"] = 150.0,
            
            // Household items
            ["light bulb"] = 0.5,
            ["bottle"] = 0.07,
            ["paper"] = 0.01,
            ["plastic bag"] = 0.15,
            
            // Other common items
            ["tree"] = -20.0, // Negative = absorbs CO2
            ["plant"] = -5.0,
            ["solar panel"] = 40.0
        };

        // Default carbon footprint for unknown items
        return carbonDatabase.TryGetValue(objectName, out var emissions) ? emissions : 0.1;
    }
}
