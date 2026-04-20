import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Camera, X } from 'lucide-react';
import api from '../services/api';
import { DetectionResult, DetectedObject } from '../types';

interface ImageUploadProps {
  onDetectionComplete: (result: DetectionResult) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onDetectionComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [objectInput, setObjectInput] = useState<string>('');
  const [showObjectModal, setShowObjectModal] = useState(false);

  const carbonDatabase: { [key: string]: number } = {
    car: 0.5,
    truck: 1.2,
    bus: 0.3,
    bicycle: -0.01,
    motorcycle: 0.4,
    tree: -20,
    forest: -50,
    factory: 5.0,
    power_plant: 3.2,
    solar_panels: -2.5,
    wind_turbine: -1.8,
    person: 0.001,
    house: 0.8,
    building: 2.0,
    food: 0.5,
    meat: 1.5,
    vegetables: 0.1,
    shopping_bags: 0.3,
    plastic_waste: 0.2,
    recycling_bin: -0.1
  };

  const getConfidenceScore = () => 0.75 + Math.random() * 0.2;

  const analyzeMockImage = (file: File, customObjects: string[] = []): DetectionResult => {
    // Use custom objects if provided, otherwise use a random selection
    let objectNames = customObjects;
    
    if (objectNames.length === 0) {
      // Random fallback only if no custom objects
      const defaultObjects = ['car', 'tree', 'house', 'bicycle', 'solar_panels'];
      objectNames = [defaultObjects[Math.floor(Math.random() * defaultObjects.length)]];
    }

    const objects = objectNames.map(name => {
      const normalizedName = name.toLowerCase().trim();
      const carbonFootprint = carbonDatabase[normalizedName] || 0.5;
      return {
        name: normalizedName,
        confidence: getConfidenceScore(),
        carbon_footprint: carbonFootprint,
        unit: 'kg CO2e'
      };
    });

    const totalEmissions = objects.reduce((sum, obj) => sum + Math.max(0, obj.carbon_footprint), 0);

    return {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      objects,
      total_emissions: totalEmissions,
      image_url: URL.createObjectURL(file),
      category: 'user-uploaded'
    };
  };

  const isNetworkError = (err: any): boolean => {
    if (!err) return true;
    // Check for various network error indicators
    return (
      !err.response || // No response from server
      err.code === 'ECONNABORTED' || // Timeout
      err.code === 'ENOTFOUND' || // DNS resolution failed
      err.code === 'ECONNREFUSED' || // Connection refused
      err.isNetworkError === true || // Custom flag from interceptor
      (err.message && (
        err.message.includes('Network') || 
        err.message.includes('Failed to fetch') ||
        err.message.includes('timeout') ||
        err.message.includes('ERR_NETWORK')
      ))
    );
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    setLoading(true);
    setError(null);

    try {
      // Show modal for user to specify what's in the image
      setPendingImage(acceptedFiles[0]);
      setImagePreview(URL.createObjectURL(acceptedFiles[0]));
      setShowObjectModal(true);
      setObjectInput('');
      setLoading(false);
    } catch (err: any) {
      console.error('Upload error:', err);
      setError('Failed to process image. Please try again.');
      setLoading(false);
    }
  }, []);

  const generateMockDetectionResult = (file: File): DetectionResult => {
    const detectedObjects = generateRandomObjects();
    const totalEmissions = detectedObjects.reduce((sum, obj) => sum + obj.carbon_footprint, 0);
    
    return {
      id: `detection-${Date.now()}`,
      timestamp: new Date().toISOString(),
      image_url: URL.createObjectURL(file),
      category: 'user-upload',
      objects: detectedObjects,
      total_emissions: totalEmissions
    };
  };

  const generateRandomObjects = (): DetectedObject[] => {
    const possibleObjects = [
      { name: 'car', carbon_footprint: 0.5, confidence: 0.85 + Math.random() * 0.1 },
      { name: 'tree', carbon_footprint: -20, confidence: 0.75 + Math.random() * 0.15 },
      { name: 'house', carbon_footprint: 0.8, confidence: 0.80 + Math.random() * 0.1 },
      { name: 'bicycle', carbon_footprint: 0.05, confidence: 0.90 + Math.random() * 0.05 },
      { name: 'food', carbon_footprint: 0.5, confidence: 0.70 + Math.random() * 0.2 },
      { name: 'person', carbon_footprint: 0.1, confidence: 0.88 + Math.random() * 0.08 },
      { name: 'factory', carbon_footprint: 5.0, confidence: 0.65 + Math.random() * 0.2 },
      { name: 'solar_panels', carbon_footprint: -2.5, confidence: 0.82 + Math.random() * 0.1 }
    ];

    // Select 1-4 random objects
    const numObjects = Math.floor(Math.random() * 4) + 1;
    const selectedObjects = possibleObjects
      .sort(() => Math.random() - 0.5)
      .slice(0, numObjects);

    return selectedObjects.map(obj => ({
      name: obj.name,
      confidence: obj.confidence,
      carbon_footprint: obj.carbon_footprint,
      unit: 'kg CO2e'
    }));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      setError('Could not access camera');
    }
  };

  const capturePhoto = async () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
          onDrop([file]);
          setCameraActive(false);
          
          if (videoRef.current?.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
        }
      });
    }
  };

  const handleObjectSubmit = () => {
    if (!pendingImage || !objectInput.trim()) {
      setError('Please describe what\'s in your image');
      return;
    }

    // Common words to ignore
    const commonWords = new Set([
      'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
      'from', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'do', 'does',
      'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can',
      'image', 'photo', 'picture', 'it', 'this', 'that', 'my', 'your', 'their', 'our'
    ]);

    // Parse input: can be comma-separated or space-separated
    let objects = objectInput
      .split(/[,\s]+/)
      .map(obj => obj.trim().toLowerCase())
      .filter(obj => obj.length > 0 && !commonWords.has(obj)); // Filter out common words

    // Remove duplicates
    objects = [...new Set(objects)];

    if (objects.length === 0) {
      setError('Please enter valid object names (not common words like "the", "a", "of")');
      return;
    }

    const mockResult = analyzeMockImage(pendingImage, objects);
    onDetectionComplete(mockResult);
    
    // Reset modal
    setShowObjectModal(false);
    setPendingImage(null);
    setImagePreview(null);
    setObjectInput('');
    setError(null);
  };

  const handleCloseModal = () => {
    setShowObjectModal(false);
    setPendingImage(null);
    setImagePreview(null);
    setObjectInput('');
    setError(null);
  };

  return (
    <div>
      {/* Object Identification Modal */}
      {showObjectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">What's in your image?</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-blue-800 font-medium mb-2">
                  What objects do you see in your image?
                </p>
                <p className="text-xs text-blue-700 mb-2">
                  Type the objects you can see (comma or space separated). This helps us calculate your carbon footprint accurately.
                </p>
                <p className="text-xs text-blue-600">
                  Examples: car, tree | house, solar panels | bicycle, person
                </p>
              </div>

              {/* Input Field */}
              <input
                type="text"
                value={objectInput}
                onChange={(e) => setObjectInput(e.target.value)}
                placeholder="e.g., car, tree, house"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                onKeyPress={(e) => e.key === 'Enter' && handleObjectSubmit()}
              />

              {/* Error Message */}
              {error && (
                <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleObjectSubmit}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Analyze Image
                </button>
              </div>

              {/* Suggested Objects */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-600 mb-3">Quick suggestions (click to add):</p>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <p className="text-xs text-gray-500 w-full">Transportation:</p>
                    {['car', 'bicycle', 'truck', 'bus', 'motorcycle'].map(obj => (
                      <button
                        key={obj}
                        onClick={() => setObjectInput(prev => prev ? `${prev}, ${obj}` : obj)}
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className="text-xs text-gray-500 w-full">Nature:</p>
                    {['tree', 'forest', 'solar_panels', 'wind_turbine'].map(obj => (
                      <button
                        key={obj}
                        onClick={() => setObjectInput(prev => prev ? `${prev}, ${obj}` : obj)}
                        className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className="text-xs text-gray-500 w-full">Buildings:</p>
                    {['house', 'building', 'factory', 'power_plant'].map(obj => (
                      <button
                        key={obj}
                        onClick={() => setObjectInput(prev => prev ? `${prev}, ${obj}` : obj)}
                        className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition"
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <p className="text-xs text-gray-500 w-full">Other:</p>
                    {['person', 'food', 'meat', 'vegetables', 'shopping_bags'].map(obj => (
                      <button
                        key={obj}
                        onClick={() => setObjectInput(prev => prev ? `${prev}, ${obj}` : obj)}
                        className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition"
                      >
                        {obj}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
    <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Object Detection</h2>

      {!cameraActive ? (
        <div className="space-y-4">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-semibold text-gray-700">
              {isDragActive ? 'Drop your image here' : 'Drag images here or click to select'}
            </p>
            <p className="text-sm text-gray-500 mt-2">Supported formats: JPG, PNG, WebP</p>
          </div>

          <button
            onClick={startCamera}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
          >
            <Camera className="w-5 h-5" />
            Use Camera
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg mb-4"
          />
          <canvas ref={canvasRef} style={{ display: 'none' }} width={640} height={480} />
          <button
            onClick={capturePhoto}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Capture Photo
          </button>
          <button
            onClick={() => {
              setCameraActive(false);
              if (videoRef.current?.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
              }
            }}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      )}

      {loading && (
        <div className="mt-4 text-center">
          <p className="text-blue-600 font-semibold">Analyzing image...</p>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
    </div>
  );
};
