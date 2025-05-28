export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface DeviceState {
  power: boolean;
  brightness: number;
  temperature: number;
  mode: 'auto' | 'manual' | 'eco';
  timer: number;
}