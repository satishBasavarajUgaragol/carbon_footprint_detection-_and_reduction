# AI Carbon Footprint Detection System

A full-stack AI-powered application that detects objects in images and calculates their carbon footprint, visualizes emissions trends, and provides AI-based predictions and recommendations.

## 🎯 Key Features

- **Real-time Object Detection**: Uses Azure Computer Vision API to detect objects in images via camera or file upload
- **Carbon Footprint Calculation**: Estimates emissions for each detected object based on a comprehensive carbon database
- **Dashboard & Analytics**: Displays total emissions, trends, and comparative analysis
- **Future Predictions**: AI-powered predictions of emissions for the next 30 days using historical data trends
- **Smart Recommendations**: AI-generated personalized recommendations to reduce carbon footprint
- **Historical Tracking**: Maintains complete history of all detections and emissions
- **Interactive Charts**: Visualize past, present, and future emission trends

## 🏗️ Architecture

### Backend (ASP.NET Core)
- REST API with 5 main controllers
- Microservices architecture with dependency injection
- Azure integration (Vision API, OpenAI, Cosmos DB)
- Service layer for business logic

### Frontend (React + TypeScript)
- Modern UI with Tailwind CSS
- Real-time camera and image upload
- Interactive dashboards with Chart.js visualization
- Responsive design for desktop and mobile

### Database
- Azure Cosmos DB for scalable document storage
- Real-time analytics and historical tracking

## 📋 Prerequisites

- .NET 8 SDK
- Node.js 18+ with npm
- Azure subscription with:
  - Azure Computer Vision resource
  - Azure Cosmos DB account
  - Azure OpenAI deployment
- Visual Studio Code

## 🚀 Installation & Setup

### Backend Setup

1. Navigate to Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
dotnet restore
```

3. Add required NuGet packages:
```bash
dotnet add package Azure.AI.Vision.ImageAnalysis
dotnet add package Azure.Cosmos
dotnet add package Azure.AI.OpenAI
```

4. Configure Azure credentials in `appsettings.json`:
```json
{
  "AzureVision": {
    "Endpoint": "https://<your-resource>.cognitiveservices.azure.com/",
    "ApiKey": "<your-vision-api-key>"
  },
  "AzureOpenAI": {
    "Endpoint": "https://<your-resource>.openai.azure.com/",
    "ApiKey": "<your-openai-api-key>",
    "DeploymentName": "gpt-4o"
  },
  "CosmosDb": {
    "ConnectionString": "AccountEndpoint=https://<your-account>.documents.azure.com:443/;AccountKey=<your-key>;",
    "DatabaseName": "CarbonFootprint",
    "ContainerId": "Detections"
  }
}
```

5. Run the backend:
```bash
dotnet run
```

The backend will start on `https://localhost:5000` or `http://localhost:5001`

### Frontend Setup

1. Navigate to Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables (`.env.development` already created):
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 🔧 API Endpoints

### Detection Endpoints
- `POST /api/detection/analyze-url` - Analyze image from URL
- `POST /api/detection/analyze-upload` - Analyze uploaded image file
- `GET /api/detection/total-emissions` - Get total emissions across all detections
- `GET /api/detection/emissions-trend?days=30` - Get daily emissions trend

### Prediction Endpoints
- `GET /api/prediction/future-emissions?days=30` - Get 30-day emissions predictions
- `GET /api/prediction/next-week` - Get next week prediction summary

### Recommendation Endpoints
- `GET /api/recommendation/all` - Get general recommendations
- `POST /api/recommendation/personalized` - Get personalized recommendations based on detection

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Get dashboard metrics and summary
- `GET /api/analytics/detailed?days=30` - Get detailed analytics

## 📊 Database Schema

### Detections Collection
```json
{
  "id": "string",
  "timestamp": "ISO 8601",
  "objects": [
    {
      "name": "string",
      "confidence": "double",
      "carbon_footprint": "double",
      "unit": "string"
    }
  ],
  "total_emissions": "double",
  "image_url": "string",
  "category": "string"
}
```

## 🤖 AI Features Used

- **Azure Computer Vision API**: Object detection and classification
- **Azure OpenAI GPT-4o**: Generating personalized recommendations and insights
- **Machine Learning Trends**: Historical data analysis for predictions
- **Carbon Database**: Predefined emissions for common objects

## 🌍 Carbon Footprint Database

Includes emissions estimates (kg CO2e) for:
- Transportation (cars, buses, airplanes)
- Food items (meat, vegetables, dairy)
- Clothing and textiles
- Electronics
- Household items
- Renewable resources (trees, solar panels)

## 🔐 Security Considerations

- API keys stored in environment configuration (never in code)
- CORS enabled for frontend communication
- HTTPS recommended for production
- Azure Identity for authentication

## 📈 Future Enhancements

1. **Cosmos DB Integration**: Full persistence layer
2. **Azure App Service Deployment**: Production hosting
3. **Advanced Predictions**: ML model training on historical data
4. **PDF Reports**: Generate emission reports
5. **Team Collaboration**: Multi-user support and leaderboards
6. **Mobile App**: Native mobile application
7. **Integration with IoT**: Real-time emissions monitoring
8. **Carbon Trading**: Integration with carbon offset programs

## 🛠️ Development

### Project Structure
```
project1.0/
├── Backend/
│   ├── Models/
│   ├── Services/
│   ├── Controllers/
│   ├── Program.cs
│   ├── CarbonFootprintAPI.csproj
│   └── appsettings.json
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 📝 Environment Variables

### Backend (appsettings.json)
- `AzureVision:Endpoint` - Azure Computer Vision endpoint
- `AzureVision:ApiKey` - Azure Computer Vision API key
- `AzureOpenAI:Endpoint` - Azure OpenAI endpoint
- `AzureOpenAI:ApiKey` - Azure OpenAI API key
- `CosmosDb:ConnectionString` - Cosmos DB connection string

### Frontend (.env.development)
- `REACT_APP_API_URL` - Backend API URL

## 🎓 Learning Resources

- [Azure Computer Vision Documentation](https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/)
- [ASP.NET Core Documentation](https://learn.microsoft.com/en-us/aspnet/core/)
- [React TypeScript Guide](https://react-typescript-cheatsheet.netlify.app/)
- [Chart.js Documentation](https://www.chartjs.org/docs/latest/)

## 📄 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ using Azure AI Services, .NET, and React**
