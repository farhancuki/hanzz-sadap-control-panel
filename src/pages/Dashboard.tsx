import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Thermometer, Clock, Power, Settings as SettingIcon, User } from 'lucide-react';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import Slider from '../components/Slider';
import ToggleSwitch from '../components/ToggleSwitch';
import Button from '../components/Button';
import DeveloperInfo from '../components/DeveloperInfo';
import { getCurrentUser } from '../utils/auth';
import { 
  getDeviceState, 
  togglePower, 
  setBrightness,
  setTemperature,
  setTimer,
  setMode 
} from '../utils/device';
import { DeviceState } from '../types';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [deviceState, setDeviceState] = useState<DeviceState>(getDeviceState());
  
  useEffect(() => {
    // Update device state
    setDeviceState(getDeviceState());
  }, []);
  
  // Handle power toggle
  const handlePowerToggle = () => {
    const newState = togglePower();
    setDeviceState(newState);
  };
  
  // Handle brightness change
  const handleBrightnessChange = (value: number) => {
    const newState = setBrightness(value);
    setDeviceState(newState);
  };
  
  // Handle temperature change
  const handleTemperatureChange = (value: number) => {
    const newState = setTemperature(value);
    setDeviceState(newState);
  };
  
  // Handle timer change
  const handleTimerChange = (value: number) => {
    const newState = setTimer(value);
    setDeviceState(newState);
  };
  
  // Handle mode change
  const handleModeChange = (mode: DeviceState['mode']) => {
    const newState = setMode(mode);
    setDeviceState(newState);
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  // Define the item animation
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavBar username={user.username} isAdmin={user.isAdmin} />
      
      <div className="container mx-auto px-4 py-6">
        <DeveloperInfo />
        
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Power Control */}
          <motion.div custom={0} variants={itemVariants}>
            <Card title="Power Control" className="h-full">
              <div className="flex flex-col items-center justify-center p-4">
                <div className="mb-4">
                  <Button
                    onClick={handlePowerToggle}
                    variant={deviceState.power ? "success" : "secondary"}
                    size="lg"
                    className="rounded-full w-16 h-16 flex items-center justify-center"
                  >
                    <Power size={24} />
                  </Button>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {deviceState.power ? "ON" : "OFF"}
                </p>
              </div>
            </Card>
          </motion.div>
          
          {/* Brightness Control */}
          <motion.div custom={1} variants={itemVariants}>
            <Card title="Brightness Control" className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-center mb-4">
                  <Sun size={24} className="text-yellow-500 mr-2" />
                </div>
                <Slider
                  min={0}
                  max={100}
                  value={deviceState.brightness}
                  onChange={handleBrightnessChange}
                  label="Brightness"
                />
              </div>
            </Card>
          </motion.div>
          
          {/* Temperature Control */}
          <motion.div custom={2} variants={itemVariants}>
            <Card title="Temperature Control" className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-center mb-4">
                  <Thermometer size={24} className="text-red-500 mr-2" />
                </div>
                <Slider
                  min={16}
                  max={30}
                  step={0.5}
                  value={deviceState.temperature}
                  onChange={handleTemperatureChange}
                  label="Temperature (°C)"
                />
              </div>
            </Card>
          </motion.div>
          
          {/* Mode Selection */}
          <motion.div custom={3} variants={itemVariants}>
            <Card title="Mode Selection" className="h-full">
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Auto Mode</span>
                  <ToggleSwitch
                    checked={deviceState.mode === 'auto'}
                    onChange={() => handleModeChange('auto')}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Manual Mode</span>
                  <ToggleSwitch
                    checked={deviceState.mode === 'manual'}
                    onChange={() => handleModeChange('manual')}
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300">Eco Mode</span>
                  <ToggleSwitch
                    checked={deviceState.mode === 'eco'}
                    onChange={() => handleModeChange('eco')}
                  />
                </div>
              </div>
            </Card>
          </motion.div>
          
          {/* Timer */}
          <motion.div custom={4} variants={itemVariants}>
            <Card title="Timer" className="h-full">
              <div className="p-4">
                <div className="flex items-center justify-center mb-4">
                  <Clock size={24} className="text-blue-500 mr-2" />
                </div>
                <Slider
                  min={0}
                  max={120}
                  step={5}
                  value={deviceState.timer}
                  onChange={handleTimerChange}
                  label="Timer (minutes)"
                />
              </div>
            </Card>
          </motion.div>
          
          {/* Settings Shortcut */}
          <motion.div custom={5} variants={itemVariants}>
            <Card title="Quick Settings" className="h-full">
              <div className="p-4 flex flex-col space-y-4">
                <Button
                  variant="info"
                  size="lg"
                  className="flex items-center justify-center"
                  onClick={() => window.location.href = '/settings'}
                >
                  <SettingIcon size={18} className="mr-2" />
                  Settings
                </Button>
                {user.isAdmin && (
                  <Button
                    variant="secondary"
                    size="lg"
                    className="flex items-center justify-center"
                    onClick={() => window.location.href = '/admin'}
                  >
                    <User size={18} className="mr-2" />
                    Admin Panel
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;