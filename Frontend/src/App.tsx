import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { Dashboard } from './components/Dashboard';
import { Recommendations } from './components/Recommendations';
import { DetectionResult } from './types';
import { BarChart3, Home, Lightbulb, Upload } from 'lucide-react';

type Page = 'upload' | 'dashboard' | 'recommendations';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [detections, setDetections] = useState<DetectionResult[]>([]);

  const handleDetectionComplete = (result: DetectionResult) => {
    setDetections([...detections, result]);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Carbon Footprint Detector</h1>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'dashboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentPage('upload')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-5 h-5" />
              Detect
            </button>
            <button
              onClick={() => setCurrentPage('recommendations')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                currentPage === 'recommendations'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Lightbulb className="w-5 h-5" />
              Tips {detections.length > 0 && <span className="ml-1 bg-green-500 px-2 py-0.5 rounded-full text-xs">+{detections.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard detections={detections} />}
        {currentPage === 'upload' && <ImageUpload onDetectionComplete={handleDetectionComplete} />}
        {currentPage === 'recommendations' && <Recommendations detections={detections} />}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>© 2024 Carbon Footprint Detector - AI-Powered Environmental Impact Analysis</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
