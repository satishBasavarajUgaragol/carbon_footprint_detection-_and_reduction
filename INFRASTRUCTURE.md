# Infrastructure as Code (Bicep)

This directory contains Bicep templates for infrastructure deployment.

## Files

- `main.bicep` - Main infrastructure definition
- `parameters.bicepparam` - Parameter values

## Deploy

```bash
# Validate template
az bicep build-params ./infra/parameters.bicepparam

# Deploy
az deployment group create `
  --resource-group carbon-footprint-rg `
  --template-file ./infra/main.bicep `
  --parameters ./infra/parameters.bicepparam

# Or using managed identity
az deployment group create `
  --resource-group carbon-footprint-rg `
  --template-file ./infra/main.bicep `
  --parameters deploymentLocation=eastus `
  --parameters uniqueSuffix=cf2024
```

## Resources Created

1. App Service Plan (B1 Linux)
2. App Service (for .NET API)
3. Static Web App (for React frontend)
4. Cosmos DB (serverless)
5. Computer Vision resource
6. OpenAI resource
7. Key Vault (secrets management)
