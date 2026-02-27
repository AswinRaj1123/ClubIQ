"use client";

import React, { useState, useRef, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { faultAPI } from "@/lib/api";
import { useSharedLocation } from "@/context/SharedLocationContext";

interface SubmitResponse {
  success: boolean;
  message: string;
  requestId?: string;
}

export default function RaiseFaultRequest() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    priority: "medium",
  });
  const [faultImage, setFaultImage] = useState<File | null>(null);
  const [faultImagePreview, setFaultImagePreview] = useState<string | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState<string | null>(null);
  const [capturedPhotoFile, setCapturedPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitResponse | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { sharedLocation, clearSharedLocation } = useSharedLocation();

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Auto-fill location when shared location is updated
  useEffect(() => {
    if (sharedLocation) {
      setFormData(prev => ({
        ...prev,
        location: sharedLocation.location,
      }));
      console.log("Location auto-filled from shared location:", sharedLocation.location);
    }
  }, [sharedLocation]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFaultImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFaultImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setShowPhotoOptions(false);
    }
  };

  const startCamera = async () => {
    console.log("Starting camera...");
    setShowPhotoOptions(false);
    setIsCameraActive(true);
    
    try {
      console.log("Requesting camera permission...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
      });
      
      console.log("Camera stream obtained:", stream);
      
      if (videoRef.current) {
        console.log("Setting video source...");
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, starting playback...");
          videoRef.current?.play().then(() => {
            console.log("Video playing successfully!");
          }).catch(err => {
            console.error("Error playing video:", err);
          });
        };
      } else {
        console.error("Video ref is null!");
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      setIsCameraActive(false);
      alert("Unable to access camera. Please check permissions or try uploading a file instead.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        
        const photoDataUrl = canvasRef.current.toDataURL("image/jpeg", 0.95);
        
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, { type: "image/jpeg" });
            setCapturedPhotoFile(file);
            setCapturedPhotoPreview(photoDataUrl);
            stopCamera();
          }
        }, "image/jpeg", 0.95);
      }
    }
  };

  const keepPhoto = () => {
    if (capturedPhotoFile && capturedPhotoPreview) {
      setFaultImage(capturedPhotoFile);
      setFaultImagePreview(capturedPhotoPreview);
      setCapturedPhotoFile(null);
      setCapturedPhotoPreview(null);
      setShowPhotoOptions(false);
    }
  };

  const retakePhoto = () => {
    setCapturedPhotoFile(null);
    setCapturedPhotoPreview(null);
    startCamera();
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
    setShowPhotoOptions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      if (!formData.title.trim()) {
        throw new Error("Please enter a fault title");
      }
      if (!formData.description.trim()) {
        throw new Error("Please describe the issue");
      }
      if (!formData.location.trim()) {
        throw new Error("Please enter the location");
      }

      // Convert image to Data URL if present
      let photoUrl: string | undefined = undefined;
      if (faultImage && faultImagePreview) {
        photoUrl = faultImagePreview;
      }

      // Call API to create fault request with coordinates from sharedLocation
      const response = await faultAPI.createFaultRequest({
        title: formData.title,
        description: formData.description,
        location: formData.location,
        latitude: sharedLocation?.latitude,
        longitude: sharedLocation?.longitude,
        priority: formData.priority as "low" | "medium" | "high" | "critical",
        photo_url: photoUrl,
      });

      console.log("Fault request created:", response);

      setSubmitStatus({
        success: true,
        message: "Fault request submitted successfully!",
        requestId: response.id,
      });

      // Reset form
      setFormData({
        title: "",
        description: "",
        location: "",
        priority: "medium",
      });
      setFaultImage(null);
      setFaultImagePreview(null);
      setShowPhotoOptions(false);
      clearSharedLocation();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      let errorMessage = "Failed to submit fault request";
      
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      } else if (error && typeof error === "object") {
        errorMessage = JSON.stringify(error);
      }
      
      console.error("Submit error:", errorMessage);
      console.error("Full error details:", error);
      
      setSubmitStatus({
        success: false,
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
      {/* Card Header */}
      <div className="px-6 py-5">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          🚨 Raise Fault Request
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Report electrical issues and get instant support
        </p>
      </div>

      {/* Card Body */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Messages */}
          {submitStatus && (
            <div className={`p-4 rounded-lg border ${
              submitStatus.success
                ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700'
                : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700'
            }`}>
              <p className={submitStatus.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                {submitStatus.message}
              </p>
              {submitStatus.requestId && (
                <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                  Request ID: {submitStatus.requestId}
                </p>
              )}
            </div>
          )}

          {/* Fault Title */}
          <div>
            <Label htmlFor="faultTitle" required>
              Fault Title
            </Label>
            <Input
              id="faultTitle"
              name="faultTitle"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title of the issue (e.g., Power Trip, Sparking Wire)"
              required
            />
          </div>

          {/* Fault Description */}
          <div>
            <Label htmlFor="faultDesc" required>
              Fault Description
            </Label>
            <TextArea
              id="faultDesc"
              name="faultDesc"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
              rows={4}
              placeholder="Describe your electrical issue in detail..."
              required
            />
          </div>

          {/* Priority */}
          <div>
            <Label htmlFor="priority" required>
              Priority Level
            </Label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 text-gray-700 dark:text-gray-300"
              required
            >
              <option value="low">Low - Not urgent</option>
              <option value="medium">Medium - Standard</option>
              <option value="high">High - Important</option>
              <option value="critical">Critical - Emergency</option>
            </select>
          </div>

          {/* Upload Image */}
          <div>
            <Label>Photo</Label>
            
            {!faultImagePreview && !isCameraActive && !capturedPhotoPreview && (
              <div className="space-y-3">
                {!showPhotoOptions ? (
                  <Button
                    type="button"
                    onClick={() => setShowPhotoOptions(true)}
                    variant="outline"
                    className="w-full"
                  >
                    📸 Upload or Take Photo
                  </Button>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      How would you like to add a photo?
                    </p>
                    
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        📁 Upload File
                      </Button>
                      
                      <Button
                        type="button"
                        onClick={startCamera}
                        variant="primary"
                        size="sm"
                        className="flex-1"
                      >
                        📷 Take Photo
                      </Button>
                    </div>
                    
                    <Button
                      type="button"
                      onClick={() => setShowPhotoOptions(false)}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Camera View */}
            {isCameraActive && (
              <div className="space-y-3">
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-800 dark:text-white mb-3">
                    📹 Camera Active - Position your device to capture the issue
                  </p>
                  <div className="relative bg-black rounded-lg overflow-hidden w-full" style={{ minHeight: '300px' }}>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                      style={{ minHeight: '300px' }}
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={capturePhoto}
                    variant="primary"
                    className="flex-1"
                  >
                    📸 Capture Photo
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={stopCamera}
                    variant="outline"
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Captured Photo Preview - Confirm or Retake */}
            {capturedPhotoPreview && (
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    📸 Preview - Is this photo okay?
                  </p>
                  
                  <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                      src={capturedPhotoPreview}
                      alt="Captured preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={keepPhoto}
                      variant="primary"
                      className="flex-1"
                    >
                      ✓ Keep Photo
                    </Button>
                    
                    <Button
                      type="button"
                      onClick={retakePhoto}
                      variant="outline"
                      className="flex-1"
                    >
                      🔄 Retake
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Image Preview */}
            {faultImagePreview && (
              <div className="space-y-3">
                <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={faultImagePreview}
                    alt="Fault preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex gap-2">
                  <p className="flex-1 text-sm text-success-600 dark:text-success-400">
                    ✓ Photo selected
                  </p>
                  
                  <Button
                    type="button"
                    onClick={() => {
                      setFaultImage(null);
                      setFaultImagePreview(null);
                      setShowPhotoOptions(false);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />

            {/* Hidden canvas for camera capture */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="faultLocation" required>
              Location
              {sharedLocation && (
                <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded">
                  📍 GPS Shared
                </span>
              )}
            </Label>
            <Input
              id="faultLocation"
              name="faultLocation"
              type="text"
              value={formData.location}
              onChange={(e) => {
                if (!sharedLocation) {
                  setFormData(prev => ({ ...prev, location: e.target.value }));
                }
              }}
              placeholder={sharedLocation ? "Location is locked from GPS" : "Type address or location name..."}
              required
              disabled={!!sharedLocation}
              hint={sharedLocation ? "Location is automatically set from your GPS coordinates" : "Start typing to search locations on map"}
            />
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            variant="primary" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </form>
      </div>
    </div>
  );
}
