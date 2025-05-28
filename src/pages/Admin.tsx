import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit, Trash2, CheckCircle, XCircle, Save, User as UserIcon } from 'lucide-react';
import NavBar from '../components/NavBar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Modal from '../components/Modal';
import DeveloperInfo from '../components/DeveloperInfo';
import { User } from '../types';
import { getCurrentUser, getUsers, addUser, updateUser, deleteUser } from '../utils/auth';

const Admin: React.FC = () => {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [users, setUsers] = useState<User[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Load users
  useEffect(() => {
    if (!currentUser?.isAdmin) {
      window.location.href = '/';
      return;
    }
    
    setUsers(getUsers());
  }, [currentUser]);
  
  // Reset form
  const resetForm = () => {
    setNewUsername('');
    setNewPassword('');
    setIsAdmin(false);
    setError('');
    setSuccess('');
  };
  
  // Open edit modal
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setNewUsername(user.username);
    setNewPassword('');
    setIsAdmin(user.isAdmin);
    setIsEditModalOpen(true);
  };
  
  // Open delete modal
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };
  
  // Add user
  const handleAddUser = () => {
    // Validate input
    if (!newUsername || !newPassword) {
      setError('Username and password are required');
      return;
    }
    
    if (users.some(u => u.username === newUsername)) {
      setError('Username already exists');
      return;
    }
    
    try {
      // Add user
      addUser({
        username: newUsername,
        password: newPassword,
        isAdmin,
      });
      
      // Refresh users
      setUsers(getUsers());
      
      // Reset form and close modal
      resetForm();
      setIsAddModalOpen(false);
    } catch (err) {
      setError('An error occurred while adding user');
      console.error(err);
    }
  };
  
  // Update user
  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    // Validate input
    if (!newUsername) {
      setError('Username is required');
      return;
    }
    
    // Check if username exists and is not the current user
    if (
      newUsername !== selectedUser.username &&
      users.some(u => u.username === newUsername)
    ) {
      setError('Username already exists');
      return;
    }
    
    try {
      // Create updates object
      const updates: Partial<Omit<User, 'id'>> = {
        username: newUsername,
        isAdmin,
      };
      
      // Add password if provided
      if (newPassword) {
        updates.password = newPassword;
      }
      
      // Update user
      updateUser(selectedUser.id, updates);
      
      // Refresh users
      setUsers(getUsers());
      
      // Reset form and close modal
      resetForm();
      setIsEditModalOpen(false);
    } catch (err) {
      setError('An error occurred while updating user');
      console.error(err);
    }
  };
  
  // Delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    
    // Prevent deleting yourself
    if (selectedUser.id === currentUser?.id) {
      setError('You cannot delete your own account');
      return;
    }
    
    try {
      // Delete user
      deleteUser(selectedUser.id);
      
      // Refresh users
      setUsers(getUsers());
      
      // Close modal
      setIsDeleteModalOpen(false);
    } catch (err) {
      setError('An error occurred while deleting user');
      console.error(err);
    }
  };
  
  if (!currentUser || !currentUser.isAdmin) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <NavBar username={currentUser.username} isAdmin={currentUser.isAdmin} />
      
      <div className="container mx-auto px-4 py-6">
        <DeveloperInfo />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card title="User Management" className="mb-6">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  User List
                </h2>
                <Button 
                  variant="success"
                  onClick={() => {
                    resetForm();
                    setIsAddModalOpen(true);
                  }}
                >
                  <UserPlus size={18} className="mr-2" />
                  Add User
                </Button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Admin
                      </th>
                      <th className="py-3 px-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                          {user.username}
                          {user.id === currentUser.id && (
                            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(you)</span>
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900 dark:text-white">
                          {user.isAdmin ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <XCircle size={18} className="text-red-500" />
                          )}
                        </td>
                        <td className="py-4 px-4 text-sm text-right">
                          <Button
                            variant="info"
                            size="sm"
                            className="mr-2"
                            onClick={() => handleEditClick(user)}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            disabled={user.id === currentUser.id}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-4 px-4 text-center text-gray-500 dark:text-gray-400">
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      {/* Add User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New User"
        footer={
          <>
            <Button variant="secondary\" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleAddUser}>
              <UserPlus size={18} className="mr-2" />
              Add User
            </Button>
          </>
        }
      >
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4\" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <Input
            label="Username"
            type="text"
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          
          <Input
            label="Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isAdmin"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isAdmin"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Admin Privileges
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit User"
        footer={
          <>
            <Button variant="secondary\" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleUpdateUser}>
              <Save size={18} className="mr-2" />
              Update User
            </Button>
          </>
        }
      >
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4\" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <Input
            label="Username"
            type="text"
            fullWidth
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Enter username"
            required
          />
          
          <Input
            label="Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
          
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="isAdminEdit"
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="isAdminEdit"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Admin Privileges
            </label>
          </div>
        </div>
      </Modal>
      
      {/* Delete User Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
        footer={
          <>
            <Button variant="secondary\" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteUser}>
              <Trash2 size={18} className="mr-2" />
              Delete User
            </Button>
          </>
        }
      >
        <div className="p-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4\" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete the user{' '}
            <span className="font-semibold">{selectedUser?.username}</span>?
          </p>
          
          <p className="text-red-600 dark:text-red-400 text-sm">
            This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;