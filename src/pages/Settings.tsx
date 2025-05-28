import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Key, Save, AlertCircle } from 'lucide-react';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DeveloperInfo from '../components/DeveloperInfo';
import { getCurrentUser, updateUser, setCurrentUser } from '../utils/auth';

const Settings: React.FC = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  
  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate inputs
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    if (!user) {
      setError('User not found');
      return;
    }
    
    setIsLoading(true);
    
    // Check current password
    if (currentPassword !== user.password) {
      setError('Current password is incorrect');
      setIsLoading(false);
      return;
    }
    
    try {
      // Update password
      const updatedUser = updateUser(user.id, { password: newPassword });
      
      if (updatedUser) {
        // Update current user in session
        setCurrentUser(updatedUser);
        setUser(updatedUser);
        
        // Clear form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // Show success message
        setIsSuccessModalOpen(true);
      } else {
        setError('Failed to update password');
      }
    } catch (err) {
      setError('An error occurred while updating password');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavBar username={user.username} isAdmin={user.isAdmin} />
      
      <div className="container mx-auto px-4 py-6">
        <DeveloperInfo />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card title="Account Settings" className="max-w-2xl mx-auto">
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                Change Password
              </h2>
              
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <div className="flex items-center">
                    <AlertCircle size={18} className="mr-2" />
                    <span>{error}</span>
                  </div>
                </div>
              )}
              
              {success && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                  <span className="block sm:inline">{success}</span>
                </div>
              )}
              
              <form onSubmit={handleChangePassword}>
                <Input
                  label="Current Password"
                  type="password"
                  fullWidth
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
                
                <Input
                  label="New Password"
                  type="password"
                  fullWidth
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                />
                
                <Input
                  label="Confirm New Password"
                  type="password"
                  fullWidth
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="mt-4"
                >
                  <Key size={18} className="mr-2" />
                  {isLoading ? 'Updating...' : 'Change Password'}
                </Button>
              </form>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Password Updated"
        size="sm"
        footer={
          <Button variant="primary\" onClick={() => setIsSuccessModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="flex items-center justify-center flex-col p-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Save size={24} className="text-green-600" />
          </div>
          <p className="text-center text-gray-700 dark:text-gray-300">
            Your password has been successfully updated!
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;