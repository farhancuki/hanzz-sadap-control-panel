import React, { useRef, useEffect, useState } from 'react';
import ReactWebcam from 'react-webcam';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  width?: number;
  height?: number;
  className?: string;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  width = 320,
  height = 240,
  className,
}) => {
  const webcamRef = useRef<ReactWebcam>(null);
  const [hasCamera, setHasCamera] = useState<boolean>(true);
  
  useEffect(() => {
    // Check if camera is available
    const checkCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setHasCamera(true);
      } catch (err) {
        console.error('Error accessing camera:', err);
        setHasCamera(false);
      }
    };
    
    checkCamera();
    
    // Set up interval for periodic captures
    const captureInterval = setInterval(() => {
      if (hasCamera && webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (imageSrc) {
          onCapture(imageSrc);
        }
      }
    }, 5000); // Capture every 5 seconds
    
    return () => {
      clearInterval(captureInterval);
    };
  }, [hasCamera, onCapture]);
  
  if (!hasCamera) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded ${className || ''}`} style={{ width, height }}>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Camera not available</p>
      </div>
    );
  }
  
  return (
    <div className={className}>
      <ReactWebcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={width}
        height={height}
        videoConstraints={{
          width: width,
          height: height,
          facingMode: 'user'
        }}
        className="rounded"
      />
    </div>
  );
};

export default WebcamCapture;