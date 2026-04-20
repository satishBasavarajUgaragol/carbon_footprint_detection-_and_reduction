namespace CarbonFootprintAPI.Models;

public class DetectionResult
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public List<DetectedObject> Objects { get; set; } = new();
    public double TotalEmissions { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class DetectedObject
{
    public string Name { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public double CarbonFootprint { get; set; }
    public string Unit { get; set; } = "kg CO2e";
}

public class CarbonTrend
{
    public DateTime Date { get; set; }
    public double TotalEmissions { get; set; }
    public int Count { get; set; }
    public double Average { get; set; }
}

public class Prediction
{
    public DateTime Date { get; set; }
    public double PredictedEmissions { get; set; }
    public string Trend { get; set; } = string.Empty;
    public double Confidence { get; set; }
}

public class Recommendation
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double PotentialSavings { get; set; }
    public string Impact { get; set; } = string.Empty;
    public int Priority { get; set; }
}
