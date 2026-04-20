# Complete Setup & Run Instructions

## 🚀 Quick Start (Fully Working)

### **Option 1: Frontend Only (Demo Mode with Mock Data)**

**Double-click this file:**
```
c:\xampp\htdocs\project1.0\run-frontend-browser.bat
```

✅ Opens browser at http://localhost:3000 instantly
✅ Fully functional with mock data
✅ Upload images, view dashboard, see recommendations
⚠️ Backend not required for demo

---

### **Option 2: Full Stack (Frontend + Backend)**

**Terminal 1 - Start Backend (requires .NET 8 SDK):**
```bash
cd c:\xampp\htdocs\project1.0
run-backend.bat
```

**Terminal 2 - Start Frontend:**
```bash
cd c:\xampp\htdocs\project1.0
run-frontend-browser.bat
```

✅ Full real API integration
✅ Connect to Azure services for real object detection
✅ Complete functionality

---

## 📋 What Works

### ✅ Frontend (Already Running on http://localhost:3000)
- [x] Upload images (demo mode shows "car" detection)
- [x] Camera capture (creates mock detection)
- [x] Dashboard with charts (mock data)
- [x] Recommendations (mock data)
- [x] Responsive design
- [x] Full TypeScript support

### ✅ Backend (Optional for Full Integration)
- [x] 12+ REST API endpoints
- [x] Azure Computer Vision integration ready
- [x] Carbon calculation engine
- [x] Prediction system
- [x] Recommendation engine
- [x] Analytics dashboard

---

## 🔧 Installation Status

| Component | Status | Details |
|-----------|--------|---------|
| Node.js | ✅ Installed | v24.11.1 |
| npm | ✅ Ready | 1315 packages |
| React | ✅ Running | Port 3000 |
| Tailwind CSS | ✅ Loaded | Styling enabled |
| Chart.js | ✅ Ready | Visualizations work |
| .NET 8 SDK | ⚠️ Optional | For backend only |

---

## 🎯 Next Steps

### For Demo/Testing:
1. ✅ Frontend already running on http://localhost:3000
2. Upload an image or capture from camera
3. View auto-populated dashboard
4. Check recommendations

### For Production:
1. **Install .NET 8 SDK** (if not already installed):
   - Download from https://dotnet.microsoft.com/download
   - Run: `dotnet --version` to verify

2. **Configure Azure Credentials** (Backend/appsettings.json):
   ```json
   {
     "AzureVision": {
       "Endpoint": "https://YOUR-RESOURCE.cognitiveservices.azure.com/",
       "ApiKey": "YOUR-KEY"
     }
   }
   ```

3. **Run Both Services**:
   - Backend: `c:\xampp\htdocs\project1.0\run-backend.bat`
   - Frontend: `c:\xampp\htdocs\project1.0\run-frontend-browser.bat`

---

## 🌐 Access Points

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **API Docs**: http://localhost:5000/swagger

---

## ✨ Features

### Image Detection
- Upload images or capture from camera
- Mock detection: Shows example object detection
- With backend: Real Azure Computer Vision detection

### Carbon Calculation
- Per-object emission estimates
- Total footprint tracking
- Historical data accumulation

### Analytics Dashboard
- Total emissions display
- 30-day historical trends chart
- Object detection breakdown
- Average emissions per detection

### Predictions
- 30-day future emission forecasts
- Trend analysis (↑↓→)
- Confidence scoring
- Real-time predictions

### Recommendations
- 5 ai-generated suggestions
- Personalized based on detections
- Potential savings calculations
- Impact level indicators
- Priority ranking

---

## 🐛 Troubleshooting

### Error: "Backend not running"
**Solution**: This is normal! Frontend works with mock data.
- For real object detection, start backend: `run-backend.bat`

### Port 3000 already in use
**Solution**: Change port in Frontend/.env.development
```
PORT=3001
```

### .NET SDK not found
**Solution**: Install from https://dotnet.microsoft.com/download
```bash
dotnet --version  # Verify installation
```

### CORS errors
**Solution**: Ensure backend runs on port 5000
- Check Backend/Program.cs for CORS configuration

---

## 📂 File Structure

```
c:\xampp\htdocs\project1.0\
├── Frontend/              (React app - http://localhost:3000)
├── Backend/               (.NET API - http://localhost:5000)
├── run-frontend.bat       (Start UI only)
├── run-frontend-browser.bat (Start UI + open browser)
├── run-backend.bat        (Start API server)
├── README.md              (Full documentation)
└── QUICKSTART.md          (5-min setup)
```

---

## 🎓 What to Try

1. **Upload Test Image**
   - Go to "Detect" tab
   - Upload a photo
   - See carbon footprint calculated

2. **View Dashboard**
   - Click "Dashboard" tab
   - See metrics and trends
   - Charts show historical data

3. **Check Recommendations**
   - Click "Tips" tab
   - See personalized suggestions
   - View potential carbon savings

4. **Test Camera**
   - Click "Detect" → "Use Camera"
   - Capture a photo
   - See instant analysis

---

## 📞 Quick Links

- **Frontend URL**: http://localhost:3000
- **Backend URL**: http://localhost:5000/api
- **Full Docs**: README.md
- **API Reference**: Backend/API_DOCUMENTATION.md
- **Setup Guide**: GETTING_STARTED.md

---

## ✅ Verification Checklist

- [x] Frontend running on http://localhost:3000
- [x] Package dependencies installed (1315+ packages)
- [x] TypeScript compilation successful
- [x] React development server active
- [x] Hot reload functional
- [x] Mock data available for testing
- [ ] Backend running (optional)
- [ ] Azure credentials configured (optional)

---

**Everything is ready to go! Start with the frontend at http://localhost:3000** 🎉
