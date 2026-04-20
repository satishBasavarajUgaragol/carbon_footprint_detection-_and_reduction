# Download Recommendations Report - User Guide

## 📥 New Feature: Export Recommendations

Your AI-Powered Recommendations page now includes **three download options** to export your carbon reduction report in multiple formats!

---

## 🎯 Download Options

### 1. **📄 JSON Format**
- **File**: `carbon-recommendations-YYYY-MM-DD.json`
- **Best for**: Software integration, API usage, data analysis
- **Contains**: Complete structured data with metadata

```json
{
  "report_title": "Carbon Footprint Recommendations Report",
  "generated_date": "2026-04-10T15:30:45.123Z",
  "summary": {
    "total_detections": 3,
    "detected_objects": [
      { "name": "car", "confidence": "92%" },
      { "name": "tree", "confidence": "87%" }
    ],
    "total_potential_savings": "58.9 kg CO₂e",
    "total_recommendations": 5
  },
  "recommendations": [
    {
      "priority": 1,
      "title": "Switch to Public Transportation",
      "description": "...",
      "potential_savings": "2.5 kg CO₂e",
      "impact_level": "High",
      "action_items": [...]
    }
  ]
}
```

### 2. **📊 CSV Format**
- **File**: `carbon-recommendations-YYYY-MM-DD.csv`
- **Best for**: Excel, spreadsheets, data analysis tools
- **Easy to use**: Open directly in Microsoft Excel, Google Sheets, etc.

**Columns**:
- Priority (1, 2, 3, etc.)
- Recommendation (Title without emoji)
- Potential Savings (kg CO₂e)
- Impact Level (High, Medium, Low)

**Example**:
```
Priority,Recommendation,Potential Savings (kg CO₂e),Impact Level
1,"Switch to Public Transportation",2.5,High
2,"Reduce Meat Consumption",2.1,High
3,"Support Clean Energy",4.5,High
```

### 3. **📋 Text Report Format**
- **File**: `carbon-recommendations-YYYY-MM-DD.txt`
- **Best for**: Reading, printing, sharing via email
- **Feature-rich**: Includes formatted summary, impact strategy, and action items

**Includes**:
- 📌 Executive Summary
- 🎯 All Recommendations (prioritized)
- ✅ Action Items for each
- 📈 Implementation Strategy (Quick Wins, Easy Wins, Long-term)
- 💡 Total Impact Statement

**Sample**:
```
═══════════════════════════════════════════════════════════════════
    CARBON FOOTPRINT RECOMMENDATIONS REPORT
═══════════════════════════════════════════════════════════════════

Generated: April 10, 2026, 3:30 PM

─────────────────────────────────────────────────────────────────
SUMMARY
─────────────────────────────────────────────────────────────────
Total Detections: 3
Total Recommendations: 5
Total Potential Savings: 58.9 kg CO₂e

Detected Objects:
  • car (92% confidence)
  • tree (87% confidence)

─────────────────────────────────────────────────────────────────
IMPLEMENTATION STRATEGY
─────────────────────────────────────────────────────────────────

Quick Wins (>2 kg CO₂e savings):
  • Switch to Public Transportation
  • Reduce Meat Consumption
  • Support Clean Energy
[...]
```

---

## 🚀 How to Download

1. **Go to the "Tips" tab** in your Carbon Footprint Detector
2. **Scroll to the top** of the Recommendations page
3. **Click one of the download buttons**:
   - 🔵 **JSON** - For developers/integrations
   - 🟢 **CSV** - For spreadsheets
   - 🟣 **Report** - For reading/printing

4. **File automatically downloads** to your Downloads folder
5. **File name includes today's date** for easy organization

---

## 📋 What's In Each Report?

### JSON Report Includes:
✅ Report metadata and generation timestamp
✅ Detection summary with confidence scores
✅ All recommendations with full details
✅ Implementation strategy categorization
✅ Action items for each recommendation
✅ Total carbon reduction potential

### CSV Report Includes:
✅ Priority ranking
✅ Recommendation titles
✅ Individual savings amounts
✅ Impact levels
✅ Easy sorting and filtering in Excel

### Text Report Includes:
✅ Professional formatting
✅ Readable summary sections
✅ Actionable step-by-step guide
✅ Implementation timeline suggestions
✅ Total impact summary
✅ Ready for printing

---

## 💡 Use Cases

### Use JSON When:
- 🔧 Integrating with other software systems
- 📡 Sending to an API or backend
- 📊 Analyzing data programmatically
- 🔄 Using in automation scripts

### Use CSV When:
- 📈 Creating charts and graphs
- 💼 Sharing with business teams
- 🗂️ Organizing in spreadsheets
- 📑 Doing comparisons over time

### Use Text Report When:
- 🖨️ Printing the report
- 📧 Emailing to friends/colleagues
- 📱 Viewing on mobile/tablet
- 👥 Sharing with non-technical users

---

## 📂 File Organization

**Downloaded files** are saved as:
```
Downloads/
├── carbon-recommendations-2026-04-10.json
├── carbon-recommendations-2026-04-10.csv
└── carbon-recommendations-2026-04-10.txt
```

📅 **Filename includes date** so you can track recommendations over time!

---

## 🎯 Report Contents at a Glance

Every report contains:

1. **Your Detections** - Objects identified in your images
2. **Recommendations** - Personalized carbon reduction tips
3. **Savings Potential** - How much CO₂e you can save
4. **Action Items** - Specific steps to implement
5. **Priority Ranking** - What to do first
6. **Impact Assessment** - High/Medium/Low priority levels
7. **Implementation Guide** - Strategy for success

---

## ✨ Example Workflow

1. ✅ Upload multiple images of your daily activities
2. ✅ Get personalized carbon reduction recommendations
3. ✅ **Download Report** in your preferred format
4. ✅ Share with family/colleagues/boss
5. ✅ Create action plan based on recommendations
6. ✅ Implement high-impact suggestions
7. ✅ Track progress over time

---

## 🔄 Download Multiple Times

- Reports are **timestamped** with current date/time
- Download **as many times** as you want
- Each download creates a new file
- Perfect for **tracking progress** over time
- Compare reports week-to-week or month-to-month

---

## 💾 Storage Tips

### Organize Your Reports:
```
My Carbon Reports/
├── Weekly Reports/
│   ├── carbon-recommendations-2026-04-03.txt
│   ├── carbon-recommendations-2026-04-10.txt
│   └── carbon-recommendations-2026-04-17.txt
├── CSV Analysis/
│   └── carbon-recommendations-2026-04-10.csv
└── JSON Backups/
    └── carbon-recommendations-2026-04-10.json
```

---

## 🎉 What's Tracked in Reports?

Each recommendation includes:
- 📍 **Priority Level** (1 = Most important)
- 🎯 **Impact** (High/Medium/Low)
- 💰 **Potential Savings** (kg CO₂e annually)
- 📝 **Description** (Why it matters)
- ✅ **Action Items** (How to implement)

---

## ❓ FAQ

**Q: Can I edit the downloaded report?**
A: Yes! CSV and TXT files are editable in any text editor. JSON can be edited with code editors.

**Q: How often should I download reports?**
A: Download whenever you want! Create new reports weekly/monthly to track progress.

**Q: Can I share the report with others?**
A: Absolutely! Text reports are perfect for sharing. JSON/CSV work great for data sharing.

**Q: What if I'm missing detections?**
A: Upload more images! The more images you analyze, the more comprehensive your recommendations.

**Q: Is my data stored?**
A: Reports are generated on-demand and downloaded locally. Your data stays on your device.

---

## 🚀 Download Now!

Head to the **"Tips"** tab and look for the download buttons at the top of the page:

- 🔵 **JSON** - For developers
- 🟢 **CSV** - For spreadsheets  
- 🟣 **Report** - For reading/printing

**Your carbon reduction report is ready to download!** 📥
