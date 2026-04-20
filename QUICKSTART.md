# Quick Start Guide

## System Requirements
- Windows 10+ / macOS / Linux
- .NET 8 SDK ([Download](https://dotnet.microsoft.com/download))
- Node.js 18+ ([Download](https://nodejs.org/))
- Azure Account with:
  - Computer Vision resource
  - Cosmos DB account
  - OpenAI model deployment

## 5-Minute Setup

### 1. Clone/Extract Project
```bash
cd project1.0
```

### 2. Start Backend (Terminal 1)
```bash
cd Backend
dotnet restore
dotnet run
# Backend runs on https://localhost:5000
```

### 3. Start Frontend (Terminal 2)
```bash
cd Frontend
npm install
npm start
# Frontend opens at http://localhost:3000
```

### 4. Configure Azure Credentials
Edit `Backend/appsettings.json` with your Azure resource credentials:
```json
{
  "AzureVision": {
    "Endpoint": "YOUR_VISION_ENDPOINT",
    "ApiKey": "YOUR_API_KEY"
  }
}
```

## Features to Try

1. **Upload Image**: Click "Detect" → Upload an image → See detected objects and carbon footprint
2. **Use Camera**: Click "Detect" → "Use Camera" → Take a photo
3. **View Dashboard**: See total emissions, trends, and statistics
4. **Get Recommendations**: View AI-powered suggestions to reduce carbon footprint

## API Testing

Use Postman or curl to test endpoints:
```bash
# Test API is running
curl https://localhost:5000/api/analytics/dashboard

# Analyze an image
curl -X POST https://localhost:5000/api/detection/analyze-url \
  -H "Content-Type: application/json" \
  -d '{"imageUrl":"https://example.com/image.jpg"}'
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Backend won't start | Ensure .NET 8 SDK is installed: `dotnet --version` |
| Frontend won't start | Delete node_modules and run `npm install` again |
| CORS errors | Check backend is running on correct port (5000) |
| Azure errors | Verify credentials in appsettings.json |

## Next Steps

- Deploy to Azure App Service (Backend)
- Deploy to Azure Static Web Apps (Frontend)
- Connect to Cosmos DB for persistence
- Add advanced ML models
- Set up CI/CD pipeline

See `README.md` for full documentation.
