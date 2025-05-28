import { DeviceState } from '../types';

// Default device state
const defaultDeviceState: DeviceState = {
  power: false,
  brightness: 50,
  temperature: 22,
  mode: 'auto',
  timer: 0
};

// Get device state from localStorage or use default
export const getDeviceState = (): DeviceState => {
  const stateFromStorage = localStorage.getItem('deviceState');
  if (stateFromStorage) {
    return JSON.parse(stateFromStorage);
  }
  
  // Initialize with default state
  localStorage.setItem('deviceState', JSON.stringify(defaultDeviceState));
  return defaultDeviceState;
};

// Save device state to localStorage
export const saveDeviceState = (state: DeviceState): void => {
  localStorage.setItem('deviceState', JSON.stringify(state));
};

// Update device state
export const updateDeviceState = (updates: Partial<DeviceState>): DeviceState => {
  const currentState = getDeviceState();
  const newState = { ...currentState, ...updates };
  saveDeviceState(newState);
  return newState;
};

// Toggle power
export const togglePower = (): DeviceState => {
  const currentState = getDeviceState();
  return updateDeviceState({ power: !currentState.power });
};

// Set brightness
export const setBrightness = (value: number): DeviceState => {
  return updateDeviceState({ brightness: Math.max(0, Math.min(100, value)) });
};

// Set temperature
export const setTemperature = (value: number): DeviceState => {
  return updateDeviceState({ temperature: Math.max(16, Math.min(30, value)) });
};

// Set mode
export const setMode = (mode: DeviceState['mode']): DeviceState => {
  return updateDeviceState({ mode });
};

// Set timer
export const setTimer = (minutes: number): DeviceState => {
  return updateDeviceState({ timer: Math.max(0, minutes) });
};

// Reset device to default state
export const resetDevice = (): DeviceState => {
  saveDeviceState(defaultDeviceState);
  return defaultDeviceState;
};