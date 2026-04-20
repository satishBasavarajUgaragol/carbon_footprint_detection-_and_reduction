import React, { useEffect, useState } from 'react';
import { Lightbulb, Download } from 'lucide-react';
import api from '../services/api';
import { Recommendation, DetectionResult } from '../types';

interface RecommendationsProps {
  detections: DetectionResult[];
}

export const Recommendations: React.FC<RecommendationsProps> = ({ detections }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (detections.length > 0) {
      fetchRecommendations();
    }
  }, [detections]);

  const generatePersonalizedRecommendations = (): Recommendation[] => {
    const detectedObjects = detections
      .flatMap(d => d.objects)
      .map(obj => obj.name.toLowerCase());

    const recommendations: Recommendation[] = [];

    // Map detected objects to specific recommendations
    const objectRecommationMap: { [key: string]: Recommendation } = {
      car: {
        title: "🚗 Switch to Public Transportation",
        description: "We detected a car in your image. Using public transit, carpooling, or cycling can significantly reduce transportation emissions.",
        potential_savings: 2.5,
        impact: "High",
        priority: 1
      },
      truck: {
        title: "🚛 Optimize Freight & Delivery Routes",
        description: "Heavy vehicles like trucks contribute significantly to emissions. Consider consolidating deliveries or using local suppliers.",
        potential_savings: 3.2,
        impact: "High",
        priority: 2
      },
      bicycle: {
        title: "🚴 Keep Cycling - You're Eco-Friendly!",
        description: "Bicycles have virtually zero emissions. Encourage others to cycle and maintain your bike for optimal efficiency.",
        potential_savings: 0.1,
        impact: "Low",
        priority: 3
      },
      food: {
        title: "🥗 Adopt Plant-Based Meals",
        description: "Replace some meat consumption with plant-based alternatives. Plant-based diets have 60-75% lower carbon footprint.",
        potential_savings: 1.8,
        impact: "Medium",
        priority: 4
      },
      meat: {
        title: "🥩 Reduce Meat Consumption",
        description: "Beef production has one of the highest carbon footprints. Meatless Mondays can reduce dietary emissions significantly.",
        potential_savings: 2.1,
        impact: "High",
        priority: 5
      },
      shopping_bags: {
        title: "🛍️ Reduce Shopping Frequency",
        description: "Buy less new items and choose secondhand options. Fast fashion has a huge carbon cost - consider sustainable alternatives.",
        potential_savings: 1.5,
        impact: "Medium",
        priority: 6
      },
      factory: {
        title: "🏭 Support Clean Energy",
        description: "Industrial facilities emit significant greenhouse gases. Choose products from companies using renewable energy sources.",
        potential_savings: 4.5,
        impact: "High",
        priority: 7
      },
      power_plant: {
        title: "⚡ Switch to Renewable Energy",
        description: "Power plants are major emitters. Consider switching your home to renewable energy or supporting green energy initiatives.",
        potential_savings: 3.8,
        impact: "High",
        priority: 8
      },
      tree: {
        title: "🌳 Plant More Trees",
        description: "Trees absorb CO2. Continue supporting reforestation projects and plant trees in your community.",
        potential_savings: 0.5,
        impact: "Low",
        priority: 9
      },
      forest: {
        title: "🌲 Protect Forests",
        description: "Forests are crucial carbon sinks. Support conservation efforts and avoid products linked to deforestation.",
        potential_savings: 2.0,
        impact: "Medium",
        priority: 10
      }
    };

    // Add recommendations based on detected objects - maintain detection order
    detectedObjects.forEach(obj => {
      if (objectRecommationMap[obj] && !recommendations.some(r => r.title === objectRecommationMap[obj].title)) {
        recommendations.push(objectRecommationMap[obj]);
      }
    });

    // If no objects detected, show general recommendations
    if (recommendations.length === 0) {
      return [
        {
          title: "📊 Start Tracking Your Carbon Footprint",
          description: "Upload images to detect objects and get personalized recommendations based on your activities.",
          potential_savings: 0,
          impact: "Medium",
          priority: 1
        },
        {
          title: "💡 Energy Efficiency at Home",
          description: "Use LED bulbs and optimize heating/cooling to reduce household energy consumption.",
          potential_savings: 1.2,
          impact: "Medium",
          priority: 2
        },
        {
          title: "♻️ Practice the 3 R's",
          description: "Reduce consumption, Reuse items, and Recycle responsibly to minimize waste carbon.",
          potential_savings: 0.9,
          impact: "Medium",
          priority: 3
        },
        {
          title: "🌍 Support Carbon Offset Programs",
          description: "Invest in verified carbon offset projects to neutralize unavoidable emissions.",
          potential_savings: 5.0,
          impact: "Medium",
          priority: 4
        },
        {
          title: "📚 Educate Your Community",
          description: "Share knowledge about carbon footprints and inspire others to make sustainable choices.",
          potential_savings: 0.5,
          impact: "Low",
          priority: 5
        }
      ];
    }

    // Add general energy efficiency tip only if not already present
    if (!recommendations.some(r => r.title.includes('Energy'))) {
      recommendations.push({
        title: "💡 Energy Efficiency at Home",
        description: "LED bulbs and smart thermostats can reduce household energy consumption by 20-30%.",
        potential_savings: 1.2,
        impact: "Medium",
        priority: 11
      });
    }

    // Return recommendations in detection order, not sorted by priority
    return recommendations;
  };

  const isNetworkError = (err: any): boolean => {
    if (!err) return true;
    return (
      !err.response ||
      err.code === 'ECONNABORTED' ||
      err.code === 'ENOTFOUND' ||
      err.code === 'ECONNREFUSED' ||
      err.isNetworkError === true ||
      (err.message && (
        err.message.includes('Network') || 
        err.message.includes('Failed to fetch') ||
        err.message.includes('timeout') ||
        err.message.includes('ERR_NETWORK')
      ))
    );
  };

  const fetchRecommendations = async () => {
    try {
      if (detections.length > 0) {
        // Generate personalized recommendations from latest detection
        const personalized = generatePersonalizedRecommendations();
        setRecommendations(personalized);
      } else {
        // No detections yet, show empty state
        setRecommendations([{
          title: "Upload an Image for Personalized Recommendations",
          description: "Upload images to detect objects and get specific recommendations based on what's in your image.",
          potential_savings: 0,
          impact: "Medium",
          priority: 1
        }]);
      }
    } catch (error: any) {
      // Show minimal fallback recommendations
      setRecommendations([{
        title: "Upload an Image for Personalized Recommendations",
        description: "Upload images to detect objects and get specific recommendations based on what's in your image.",
        potential_savings: 0,
        impact: "Medium",
        priority: 1
      }]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading recommendations...</div>;

  const generateReport = () => {
    // Only include recommendations relevant to detected objects
    const imageSpecificRecommendations = recommendations;
    const imageSpecificSavings = imageSpecificRecommendations.reduce((sum, rec) => sum + rec.potential_savings, 0);

    const reportData = {
      report_title: "Image Analysis & Carbon Reduction Report",
      report_type: "Single Image Analysis",
      generated_date: new Date().toISOString(),
      image_analysis: {
        total_objects_detected: detectedItems.length,
        detected_objects: detectedItems.map(d => ({ 
          name: d.name, 
          confidence: `${(d.confidence * 100).toFixed(0)}%` 
        })),
        analysis_type: "Specific to this image"
      },
      carbon_impact: {
        total_emissions_detected: `${detections.length > 0 ? detections[detections.length - 1]?.total_emissions?.toFixed(1) || '0' : '0'} kg CO₂e`,
        total_potential_savings: `${imageSpecificSavings.toFixed(1)} kg CO₂e`,
        applicable_recommendations: imageSpecificRecommendations.length
      },
      recommendations_for_detected_objects: imageSpecificRecommendations.map((rec, index) => ({
        action_number: index + 1,
        title: rec.title.replace(/[🚗🚛🚴🥗🥩🛍️🏭⚡🌳🌲📊💡♻️🌍📚]/g, '').trim(),
        description: rec.description,
        potential_savings: `${rec.potential_savings} kg CO₂e`,
        impact_level: rec.impact,
        why_this_matters: `Based on your detected ${detectedItems.length > 1 ? 'objects' : 'object'}: ${detectedItems.map(d => d.name).join(', ')}`,
        implementation_steps: [
          `Step 1: Understand the issue - ${rec.description}`,
          `Step 2: Start implementing today`,
          `Step 3: Track your ${rec.potential_savings} kg CO₂e savings`,
          `Step 4: Share your changes with others`
        ]
      })),
      specific_message: `This report is specific to the ${detectedItems.length} object(s) detected in your image: ${detectedItems.map(d => d.name).join(', ')}. By implementing these recommendations, you can reduce your carbon footprint by ${imageSpecificSavings.toFixed(1)} kg CO₂e.`
    };

    return reportData;
  };

  const downloadReport = (format: 'json' | 'csv' | 'txt') => {
    const report = generateReport();
    let content = '';
    let filename = `image-analysis-${new Date().toISOString().split('T')[0]}`;
    let mimeType = 'text/plain';

    if (format === 'json') {
      content = JSON.stringify(report, null, 2);
      filename += '.json';
      mimeType = 'application/json';
    } else if (format === 'csv') {
      // Generate CSV format - specific to detected objects
      const headers = ['Action #', 'Recommendation', 'Potential Savings (kg CO₂e)', 'Impact Level', 'Why This Matters'];
      const rows = recommendations.map((rec, idx) => [
        idx + 1,
        rec.title.replace(/[🚗🚛🚴🥗🥩🛍️🏭⚡🌳🌲📊💡♻️🌍📚]/g, '').trim(),
        rec.potential_savings,
        rec.impact,
        `Based on detected: ${detectedItems.map(d => d.name).join(', ')}`
      ]);
      
      content = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      filename += '.csv';
      mimeType = 'text/csv';
    } else {
      // Generate plaintext format - specific to image
      const imageObjects = detectedItems.map(d => `${d.name} (${(d.confidence * 100).toFixed(0)}%)`).join(' • ');
      const detectedEmissions = detections.length > 0 ? detections[detections.length - 1]?.total_emissions?.toFixed(1) || '0' : '0';
      
      content = `
═══════════════════════════════════════════════════════════════════
      IMAGE ANALYSIS & CARBON REDUCTION REPORT
═══════════════════════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}
Report Type: Single Image Analysis

─────────────────────────────────────────────────────────────────
IMAGE ANALYSIS DETAILS
─────────────────────────────────────────────────────────────────

Objects Detected in This Image:
  ${imageObjects}

Total Carbon Emissions Detected: ${detectedEmissions} kg CO₂e
Total Potential Savings: ${totalSavings.toFixed(1)} kg CO₂e

─────────────────────────────────────────────────────────────────
SPECIFIC RECOMMENDATIONS FOR YOUR DETECTED OBJECTS
─────────────────────────────────────────────────────────────────

${recommendations.map((rec, idx) => `
ACTION ${idx + 1}: ${rec.title}
${'-'.repeat(65)}

Description:
  ${rec.description}

Carbon Savings: ${rec.potential_savings} kg CO₂e
Impact Level: ${rec.impact}

Why This Matters for Your Image:
  You detected: ${detectedItems.map(d => d.name).join(', ')}
  This recommendation directly addresses these objects.

Implementation Steps:
  1. Understand the issue - ${rec.description}
  2. Start implementing today
  3. Track your ${rec.potential_savings} kg CO₂e savings
  4. Share your changes with others

`).join('\n')}

─────────────────────────────────────────────────────────────────
SUMMARY & NEXT STEPS
─────────────────────────────────────────────────────────────────

Your Image Analysis:
  • Detected: ${detectedItems.map(d => d.name).join(', ')}
  • Total Recommendations: ${recommendations.length}
  • Total Potential Savings: ${totalSavings.toFixed(1)} kg CO₂e

Next Steps:
  ✓ Choose the highest-impact recommendation (${recommendations[0]?.potential_savings} kg CO₂e)
  ✓ Implement changes this week
  ✓ Upload another image to track progress
  ✓ Download updated reports to compare

This report is specific to the ${detectedItems.length} object(s) detected 
in your image and should not be compared with reports from different images.

═══════════════════════════════════════════════════════════════════
Report generated by Carbon Footprint Detector
${new Date().toISOString()}
═══════════════════════════════════════════════════════════════════
      `;
      filename += '.txt';
      mimeType = 'text/plain';
      filename += '.txt';
      mimeType = 'text/plain';
    }

    // Create blob and download
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div>Loading recommendations...</div>;

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const totalSavings = recommendations.reduce((sum, rec) => sum + rec.potential_savings, 0);
  const detectedItems = detections.flatMap(d => d.objects).map(obj => ({ name: obj.name, confidence: obj.confidence }));

  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-yellow-500" />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800">AI-Powered Recommendations</h2>
            <p className="text-gray-600 mt-1">Based on {detections.length} image analysis {detections.length > 0 ? '✓' : ''}</p>
          </div>
        </div>

      {/* Uploaded Images Display */}
      {detections.length > 0 && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Uploaded Images</h3>
          <div className="flex flex-wrap gap-4">
            {detections.map((detection, idx) => (
              <div key={detection.id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200 flex-1 min-w-[300px]">
                <div className="flex gap-4">
                  <div className="mb-3">
                    <img
                      src={detection.image_url}
                      alt={`Detection ${idx + 1}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                  <div className="text-sm flex-1">
                    <div className="font-semibold text-gray-800 mb-2">
                      Detection #{idx + 1} - {new Date(detection.timestamp).toLocaleDateString()}
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-600">
                        <span className="font-medium">Objects:</span> {detection.objects.map(obj => obj.name).join(', ')}
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Total Emissions:</span> {detection.total_emissions.toFixed(2)} kg CO₂e
                      </div>
                      <div className="text-gray-600">
                        <span className="font-medium">Confidence:</span> {((detection.objects.reduce((sum, obj) => sum + obj.confidence, 0) / detection.objects.length) * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
        
        {/* Download Button Group */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => downloadReport('json')}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition shadow-md"
              title="Download as JSON"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">JSON</span>
            </button>
            <button
              onClick={() => downloadReport('csv')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition shadow-md"
              title="Download as CSV"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">CSV</span>
            </button>
            <button
              onClick={() => downloadReport('txt')}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition shadow-md"
              title="Download as Text"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Report</span>
            </button>
          </div>
          <p className="text-xs text-gray-600 text-center mt-2">Download Report</p>
        </div>
      </div>

      {/* Detected Objects Summary */}
      {detectedItems.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-gray-800 mb-3">📸 Objects Detected:</h3>
          <p className="text-gray-700 text-lg">
            <span className="font-semibold text-blue-600">
              {detectedItems.map((item, idx) => (
                <span key={idx}>
                  {idx > 0 && ' • '}
                  {item.name}
                  <span className="text-sm text-gray-600"> ({(item.confidence * 100).toFixed(0)}%)</span>
                </span>
              ))}
            </span>
          </p>
        </div>
      )}

      {/* Total Savings Summary */}
      {detections.length > 0 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-100 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-gray-800 mb-2">🎯 Total Potential Carbon Reduction:</h3>
          <p className="text-4xl font-bold text-green-600">{totalSavings.toFixed(1)} kg CO₂e</p>
          <p className="text-sm text-gray-700 mt-2">If you implement all these recommendations</p>
        </div>
      )}

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div key={index} className="border-l-4 border-blue-500 bg-blue-50 p-6 rounded-r-lg hover:shadow-md transition">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-800">{rec.title}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getImpactColor(rec.impact)}`}>
                {rec.impact} Impact
              </span>
            </div>
            <p className="text-gray-700 mb-4">{rec.description}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Potential Savings</p>
                <p className="text-xl font-bold text-green-600">{rec.potential_savings} kg CO₂e</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Priority</p>
                <p className="text-xl font-bold text-blue-600">#{rec.priority}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
