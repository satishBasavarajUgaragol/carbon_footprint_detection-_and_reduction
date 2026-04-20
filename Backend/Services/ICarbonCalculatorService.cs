using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public interface ICarbonCalculatorService
{
    Task<double> CalculateTotalEmissionsAsync();
    Task<List<CarbonTrend>> GetEmissionsTrendAsync(int days);
    Task SaveDetectionResultAsync(DetectionResult result);
}
