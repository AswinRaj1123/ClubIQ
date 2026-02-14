"use client";

import React, { useState, useRef, useEffect } from "react";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";

export default function RaiseFaultRequest() {
  const [faultDesc, setFaultDesc] = useState("");
  const [faultImage, setFaultImage] = useState<File | null>(null);
  const [faultImagePreview, setFaultImagePreview] = useState<string | null>(null);
  const [faultLocation, setFaultLocation] = useState("");
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhotoPreview, setCapturedPhotoPreview] = useState<string | null>(null);
  const [capturedPhotoFile, setCapturedPhotoFile] = useState<File | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requestData = {
      description: faultDesc,
      image: faultImage,
      location: faultLocation,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Fault Request:", requestData);
    
    setFaultDesc("");
    setFaultImage(null);
    setFaultImagePreview(null);
    setFaultLocation("");
    
    alert("Fault request submitted successfully!");
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
          {/* Fault Description */}
          <div>
            <Label htmlFor="faultDesc" required>
              Fault Description
            </Label>
            <TextArea
              id="faultDesc"
              name="faultDesc"
              value={faultDesc}
              onChange={setFaultDesc}
              rows={4}
              placeholder="Describe your electrical issue in detail..."
              required
            />
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
            </Label>
            <Input
              id="faultLocation"
              name="faultLocation"
              type="text"
              value={faultLocation}
              onChange={(e) => setFaultLocation(e.target.value)}
              placeholder="Type address or location name..."
              required
              hint="Start typing to search locations on map"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="primary" className="w-full">
            Submit Request
          </Button>
        </form>
      </div>
    </div>
  );
}
