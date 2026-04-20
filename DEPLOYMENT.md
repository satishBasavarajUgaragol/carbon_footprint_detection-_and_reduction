# Deployment Guide

## Prerequisites
- Azure CLI installed: `choco install azure-cli` or [download](https://aka.ms/azure-cli)
- .NET 8 SDK and Node.js installed
- Azure subscription with appropriate permissions

## Deploy to Azure

### Step 1: Create Azure Resources

```bash
# Set variables
$resourceGroup = "carbon-footprint-rg"
$location = "eastus"
$appServicePlan = "carbon-footprint-plan"
$appService = "carbon-footprint-api"
$staticWebApp = "carbon-footprint-ui"

# Login to Azure
az login

# Create Resource Group
az group create --name $resourceGroup --location $location

# Create App Service Plan
az appservice plan create `
  --name $appServicePlan `
  --resource-group $resourceGroup `
  --sku B1 `
  --is-linux

# Create App Service for Backend
az webapp create `
  --resource-group $resourceGroup `
  --plan $appServicePlan `
  --name $appService `
  --runtime "DOTNET|8.0"

# Create Static Web App for Frontend
az staticwebapp create `
  --name $staticWebApp `
  --resource-group $resourceGroup `
  --location $location `
  --source "https://github.com/your-username/repo" `
  --branch main `
  --app-location "Frontend" `
  --output-location "build"
```

### Step 2: Configure Application Settings

```bash
# Set backend environment variables
az webapp config appsettings set `
  --resource-group $resourceGroup `
  --name $appService `
  --settings `
    AzureVision__Endpoint="https://<resource>.cognitiveservices.azure.com/" `
    AzureVision__ApiKey="<api-key>" `
    AzureOpenAI__Endpoint="https://<resource>.openai.azure.com/" `
    AzureOpenAI__ApiKey="<api-key>" `
    AzureOpenAI__DeploymentName="gpt-4o" `
    CosmosDb__ConnectionString="AccountEndpoint=...;AccountKey=...;"
```

### Step 3: Deploy Backend

```bash
# Build release
cd Backend
dotnet publish -c Release -o ./publish

# Deploy to App Service
az webapp up `
  --resource-group $resourceGroup `
  --name $appService `
  --runtime "DOTNET|8.0" `
  --src-dir ./publish
```

### Step 4: Deploy Frontend

```bash
cd ../Frontend

# Build production bundle
npm run build

# Deploy to Static Web App (automated via GitHub Actions or manual)
az staticwebapp utils build `
  --app-location Frontend `
  --output-location build
```

### Step 5: Configure CORS

```bash
# Update backend CORS for production domain
# Edit Backend/Program.cs to include production frontend URL:
policy.WithOrigins("https://<your-static-app>.azurestaticapps.net")
```

## Create Cosmos DB

```bash
$cosmosAccount = "carbon-footprint-db"

# Create Cosmos DB Account
az cosmosdb create `
  --name $cosmosAccount `
  --resource-group $resourceGroup `
  --locations regionName=$location `
  --capabilities EnableServerless

# Create Database
az cosmosdb sql database create `
  --account-name $cosmosAccount `
  --resource-group $resourceGroup `
  --name "CarbonFootprint"

# Create Container
az cosmosdb sql container create `
  --account-name $cosmosAccount `
  --database-name "CarbonFootprint" `
  --name "Detections" `
  --partition-key-path "/id" `
  --resource-group $resourceGroup
```

## Create Azure Computer Vision Resource

```bash
# Create Computer Vision resource
az cognitiveservices account create `
  --name carbon-footprint-vision `
  --resource-group $resourceGroup `
  --kind ComputerVision `
  --sku S1 `
  --location $location `
  --yes

# Get keys
az cognitiveservices account keys list `
  --name carbon-footprint-vision `
  --resource-group $resourceGroup
```

## Create Azure OpenAI Deployment

```bash
# Create OpenAI resource
az cognitiveservices account create `
  --name carbon-footprint-openai `
  --resource-group $resourceGroup `
  --kind OpenAI `
  --sku S0 `
  --location "eastus" `  # Limited regions for OpenAI
  --yes

# Deploy gpt-4o model
az cognitiveservices account deployment create `
  --name carbon-footprint-openai `
  --resource-group $resourceGroup `
  --deployment-id "gpt-4o" `
  --model-name "gpt-4o" `
  --model-version "2024-01-15-preview" `
  --sku-name Standard `
  --sku-capacity 1
```

## GitHub Actions CI/CD (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy Backend
      uses: azure/webapps-deploy@v2
      with:
        app-name: carbon-footprint-api
        useDotnetVersion: '8.0'
        package: Backend/publish
    
    - name: Deploy Frontend
      uses: Azure/static-web-apps-deploy@v1
      with:
        app-location: "Frontend"
        output_location: "build"
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
```

## Monitoring & Diagnostics

```bash
# View backend logs
az webapp log tail `
  --resource-group $resourceGroup `
  --name $appService

# View metrics
az monitor metrics list-definitions `
  --resource /subscriptions/{subscription}/resourceGroups/$resourceGroup/providers/Microsoft.Web/sites/$appService

# Set up alerts
az monitor metrics alert create `
  --name "HighErrorRate" `
  --resource-group $resourceGroup `
  --scopes /subscriptions/{subscription}/resourceGroups/$resourceGroup/providers/Microsoft.Web/sites/$appService `
  --condition "avg http5xx > 10" `
  --window-size 5m `
  --evaluation-frequency 5m `
  --severity 2 `
  --actions email-admin
```

## Cost Optimization

1. **App Service**: Use B1 tier for development, B2 for production
2. **Static Web App**: Free tier sufficient for most use cases
3. **Cosmos DB**: Use serverless for unpredictable workloads
4. **Computer Vision**: S1 tier recommended
5. **OpenAI**: Monitor usage and set quotas

## Production Checklist

- [x] All Azure credentials configured
- [x] CORS settings updated for production domain
- [x] Database connectivity verified
- [x] SSL/TLS certificates configured
- [x] Monitoring and alerts set up
- [x] Backup strategy implemented
- [x] Auto-scaling configured
- [x] Load testing completed
- [x] Security audit passed
- [x] Disaster recovery plan documented

## Cleanup

```bash
# Delete all resources
az group delete --name $resourceGroup --yes
```
