import { User } from '../types';

// Initial admin user
const initialUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    isAdmin: true
  }
];

// Get users from localStorage or use initial users
export const getUsers = (): User[] => {
  const usersFromStorage = localStorage.getItem('users');
  if (usersFromStorage) {
    return JSON.parse(usersFromStorage);
  }
  
  // Initialize with default admin user if no users exist
  localStorage.setItem('users', JSON.stringify(initialUsers));
  return initialUsers;
};

// Save users to localStorage
export const saveUsers = (users: User[]): void => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Check if user credentials are valid
export const authenticateUser = (username: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.username === username && u.password === password);
  return user || null;
};

// Add a new user (admin only)
export const addUser = (newUser: Omit<User, 'id'>): User => {
  const users = getUsers();
  const id = Date.now().toString();
  const user = { ...newUser, id };
  users.push(user);
  saveUsers(users);
  return user;
};

// Update user
export const updateUser = (userId: string, updates: Partial<Omit<User, 'id'>>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  return users[index];
};

// Delete user
export const deleteUser = (userId: string): boolean => {
  let users = getUsers();
  const initialLength = users.length;
  users = users.filter(u => u.id !== userId);
  
  if (users.length === initialLength) return false;
  
  saveUsers(users);
  return true;
};

// Get current user from session storage
export const getCurrentUser = (): User | null => {
  const userJson = sessionStorage.getItem('currentUser');
  return userJson ? JSON.parse(userJson) : null;
};

// Set current user in session storage
export const setCurrentUser = (user: User): void => {
  sessionStorage.setItem('currentUser', JSON.stringify(user));
};

// Clear current user from session storage
export const clearCurrentUser = (): void => {
  sessionStorage.removeItem('currentUser');
};