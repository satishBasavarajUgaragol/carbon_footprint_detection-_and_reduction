using CarbonFootprintAPI.Models;

namespace CarbonFootprintAPI.Services;

public interface IAnalyticsService
{
    Task<dynamic> GetDashboardMetricsAsync();
    Task<dynamic> GetDetailedAnalyticsAsync(int days);
}
