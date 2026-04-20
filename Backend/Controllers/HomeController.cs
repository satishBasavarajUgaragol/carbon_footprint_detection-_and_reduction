using Microsoft.AspNetCore.Mvc;

namespace CarbonFootprintAPI.Controllers;

[ApiController]
[Route("")]
public class HomeController : ControllerBase
{
    [HttpGet]
    public ActionResult Get()
    {
        var info = new
        {
            message = "AI Carbon Footprint Detection API",
            version = "1.0.0",
            status = "Running",
            endpoints = new
            {
                analytics = "/api/analytics/dashboard",
                detection = "/api/detection/analyze-url",
                prediction = "/api/prediction/future-emissions",
                recommendations = "/api/recommendation/all"
            },
            documentation = "See API_DOCUMENTATION.md for detailed API information"
        };
        
        return Ok(info);
    }
}
