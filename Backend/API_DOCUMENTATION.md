# Backend API Documentation

## Overview
ASP.NET Core 8 REST API for carbon footprint detection, calculation, prediction, and recommendations.

## Endpoints

### Detection Controller (`/api/detection`)

#### Analyze Image from URL
```
POST /api/detection/analyze-url
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg"
}

Response 200:
{
  "id": "guid",
  "timestamp": "2024-01-15T10:30:00Z",
  "objects": [
    {
      "name": "car",
      "confidence": 0.95,
      "carbonFootprint": 0.5,
      "unit": "kg CO2e"
    }
  ],
  "totalEmissions": 0.5,
  "imageUrl": "https://example.com/image.jpg",
  "category": "transportation"
}
```

#### Analyze Uploaded Image
```
POST /api/detection/analyze-upload
Content-Type: multipart/form-data

file: <binary image data>

Response 200: Same as above
```

#### Get Total Emissions
```
GET /api/detection/total-emissions

Response 200:
{
  "total_emissions": 125.5
}
```

#### Get Emissions Trend
```
GET /api/detection/emissions-trend?days=30

Response 200:
[
  {
    "date": "2024-01-15",
    "totalEmissions": 12.5,
    "count": 5,
    "average": 2.5
  },
  ...
]
```

### Prediction Controller (`/api/prediction`)

#### Get Future Predictions
```
GET /api/prediction/future-emissions?days=30

Response 200:
[
  {
    "date": "2024-01-16",
    "predictedEmissions": 12.8,
    "trend": "Increasing",
    "confidence": 0.82
  },
  ...
]
```

#### Get Next Week Prediction
```
GET /api/prediction/next-week

Response 200:
{
  "date": "2024-01-22",
  "predictedEmissions": 85.5,
  "trend": "Stable",
  "confidence": 0.80
}
```

### Recommendation Controller (`/api/recommendation`)

#### Get All Recommendations
```
GET /api/recommendation/all

Response 200:
[
  {
    "title": "Switch to Public Transportation",
    "description": "Reduce your carbon footprint by using public transportation...",
    "potential_savings": 2.5,
    "impact": "High",
    "priority": 1
  },
  ...
]
```

#### Get Personalized Recommendations
```
POST /api/recommendation/personalized
Content-Type: application/json

{
  "id": "guid",
  "objects": [
    {"name": "car", ...}
  ],
  ...
}

Response 200:
[
  // Filtered recommendations based on detected objects
]
```

### Analytics Controller (`/api/analytics`)

#### Get Dashboard Metrics
```
GET /api/analytics/dashboard

Response 200:
{
  "total_detections": 42,
  "total_emissions": 125.5,
  "average_emissions": 2.99,
  "top_detected_object": "car",
  "top_object_emissions": 21.5
}
```

#### Get Detailed Analytics
```
GET /api/analytics/detailed?days=30

Response 200:
{
  "period_days": 30,
  "daily_emissions": [
    {
      "date": "2024-01-15",
      "emissions": 12.5,
      "count": 5
    },
    ...
  ],
  "object_breakdown": [
    {
      "object_name": "car",
      "total_emissions": 21.5,
      "occurrences": 15
    },
    ...
  ]
}
```

## Error Handling

All endpoints return error responses with appropriate HTTP status codes:

```
400 Bad Request: Invalid input parameters
401 Unauthorized: Missing authentication
403 Forbidden: Insufficient permissions
404 Not Found: Resource not found
500 Internal Server Error: Server-side error

Response format:
{
  "error": "Error message describing the issue"
}
```

## Authentication

Currently using CORS for development. For production:
- Implement API key authentication
- Add JWT bearer tokens
- Enable Azure AD authentication

## Rate Limiting

Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Examples

### cURL
```bash
# Analyze image from URL
curl -X POST "https://localhost:5000/api/detection/analyze-url" \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/image.jpg"}'

# Get dashboard
curl "https://localhost:5000/api/analytics/dashboard"
```

### PowerShell
```powershell
$header = @{"Content-Type"="application/json"}

# Analyze image
$body = @{imageUrl="https://example.com/image.jpg"} | ConvertTo-Json
Invoke-WebRequest -Uri "https://localhost:5000/api/detection/analyze-url" `
  -Method POST `
  -Headers $header `
  -Body $body

# Get dashboard
Invoke-WebRequest "https://localhost:5000/api/analytics/dashboard"
```

## Data Models

### DetectionResult
- `id` (string): Unique identifier
- `timestamp` (DateTime): When detected
- `objects` (DetectedObject[]): Detected objects
- `totalEmissions` (double): Total kg CO2e
- `imageUrl` (string): Source image URL
- `category` (string): Object category

### DetectedObject
- `name` (string): Object name
- `confidence` (double): 0-1 confidence score
- `carbonFootprint` (double): kg CO2e
- `unit` (string): Measurement unit

### CarbonTrend
- `date` (DateTime): Date of trend
- `totalEmissions` (double): Daily total
- `count` (int): Number of detections
- `average` (double): Average per detection

### Prediction
- `date` (DateTime): Prediction date
- `predictedEmissions` (double): Predicted kg CO2e
- `trend` (string): "Increasing", "Decreasing", "Stable"
- `confidence` (double): 0-1 confidence

### Recommendation
- `title` (string): Title
- `description` (string): Full description
- `potentialSavings` (double): kg CO2e savings
- `impact` (string): "High", "Medium", "Low"
- `priority` (int): Priority level
