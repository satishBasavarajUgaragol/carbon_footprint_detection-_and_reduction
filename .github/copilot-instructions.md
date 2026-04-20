# GitHub Copilot Instructions for Carbon Footprint Project

This file contains project-specific guidance for GitHub Copilot and development practices.

## Project Overview

Full-stack AI Carbon Footprint Detection System combining:
- **Backend**: ASP.NET Core 8 REST API
- **Frontend**: React 18 with TypeScript
- **AI Services**: Azure Computer Vision, OpenAI, Cosmos DB

## Directory Structure

```
project1.0/
├── Backend/
│   ├── CarbonFootprintAPI.csproj
│   ├── Program.cs
│   ├── Models/
│   ├── Services/
│   ├── Controllers/
│   └── appsettings.json
├── Frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── .github/
└── README.md
```

## Development Standards

### Backend (.NET/C#)
- Use explicit typing with nullable reference types
- Follow SOLID principles
- Use dependency injection for services
- Implement async/await patterns
- Add logging for debugging
- Use XML comments for public methods

### Frontend (React/TypeScript)
- Use functional components with hooks
- Strict TypeScript mode enabled
- Component-based architecture
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls

## Key Services

### Backend Services
1. **IVisionService**: Azure Computer Vision integration
2. **ICarbonCalculatorService**: Emission calculation and storage
3. **IPredictionService**: AI-powered future predictions
4. **IRecommendationService**: Personalized recommendations
5. **IAnalyticsService**: Dashboard and analytics metrics

### Frontend Components
1. **ImageUpload**: Camera and file upload
2. **Dashboard**: Analytics and visualization
3. **Recommendations**: Tips and suggestions

## API Standards

- RESTful endpoints
- Resource-based routing (`/api/{resource}/{action}`)
- Request/response in JSON format
- Proper error handling with HTTP status codes

## Environment Configuration

Create local configuration files:
- `Backend/appsettings.Development.json`
- `Frontend/.env.development`

## Testing

- Test API endpoints with tools like Postman or curl
- Test UI components in development mode
- Verify Azure connections before deployment

## Deployment Checklist

- [ ] All Azure credentials configured
- [ ] CORS settings verified
- [ ] Database connection tested
- [ ] API endpoints documented
- [ ] Frontend environment variables set
- [ ] Build succeeds without warnings
- [ ] Security best practices implemented

## Common Tasks

### Add New Detection Feature
1. Update `DetectionResult` model in Backend
2. Add handler in `IVisionService`
3. Create corresponding API endpoint
4. Add UI component in Frontend
5. Update API service in Frontend

### Add New Recommendation Logic
1. Update `IRecommendationService` interface
2. Implement in `RecommendationService`
3. Add controller endpoint
4. Create React component for display

### Deploy to Azure
1. Publish backend to Azure App Service
2. Deploy frontend to Azure Static Web Apps
3. Connect to Cosmos DB
4. Update CORS settings
5. Test all endpoints

## Coding Guidelines

- Use meaningful variable and method names
- Write self-documenting code
- Include error handling and logging
- Follow language idioms (C# and TypeScript/React)
- Avoid hardcoding sensitive data

## Performance Optimization

- Implement caching for predictions
- Optimize image processing
- Minimize bundle size for frontend
- Use lazy loading for heavy components

## Security Best Practices

- Use Azure Key Vault for secrets
- Implement rate limiting on API
- Validate and sanitize all inputs
- Use HTTPS only
- Keep dependencies updated
