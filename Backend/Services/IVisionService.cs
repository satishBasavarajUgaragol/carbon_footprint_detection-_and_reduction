using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public interface IVisionService
{
    Task<DetectionResult> AnalyzeImageAsync(string imageUrl);
    Task<DetectionResult> AnalyzeImageFromFileAsync(Stream imageStream);
}
