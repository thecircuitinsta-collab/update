import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Save, Eye, EyeOff, Key, User, Shield } from 'lucide-react';
import { supabase, updateData } from '../../lib/supabase';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';

const schema = yup.object().shape({
  currentPassword: yup.string().required('Current password is required'),
  newUsername: yup.string().required('Username is required').min(3, 'Username must be at least 3 characters'),
  newPassword: yup.string().required('New password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('newPassword')], 'Passwords must match'),
});

interface FormData {
  currentPassword: string;
  newUsername: string;
  newPassword: string;
  confirmPassword: string;
}

export const AdminSettings: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      currentPassword: '',
      newUsername: 'admin123',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Verify current password
      const currentUser = localStorage.getItem('admin_user');
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      // Simple password verification for demo
      if (data.currentPassword !== 'admin123') {
        throw new Error('Current password is incorrect');
      }

      // Update credentials in database
      if (supabase) {
        const { error } = await supabase
          .from('admin_credentials')
          .update({
            username: data.newUsername,
            password: data.newPassword, // In production, this would be hashed
            updated_at: new Date().toISOString()
          })
          .eq('username', 'admin123');

        if (error) throw error;
      }

      // Update local storage
      localStorage.setItem('admin_user', JSON.stringify({
        username: data.newUsername,
        loginTime: new Date().toISOString()
      }));

      toast.success('Admin credentials updated successfully!');
      reset();
    } catch (error: any) {
      console.error('Error updating credentials:', error);
      toast.error(error.message || 'Failed to update credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  const securityTips = [
    'Use a strong password with at least 8 characters',
    'Include uppercase, lowercase, numbers, and special characters',
    'Avoid using personal information in passwords',
    'Change your password regularly',
    'Never share your admin credentials',
    'Log out when finished with admin tasks'
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Manage your admin account credentials and security</p>
      </div>

      {/* Current Credentials Info */}
      <motion.div
        className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center space-x-3 mb-3">
          <Shield className="h-6 w-6 text-blue-600" />
          <h2 className="text-lg font-semibold text-blue-900">Current Credentials</h2>
        </div>
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>Username:</strong> admin123</p>
          <p><strong>Password:</strong> ••••••••</p>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
        </div>
      </motion.div>

      {/* Update Credentials Form */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-center space-x-3 mb-6">
          <Key className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Update Credentials</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password *
            </label>
            <div className="relative">
              <input
                {...register('currentPassword')}
                type={showCurrentPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.currentPassword.message}</p>
            )}
          </div>

          {/* New Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Username *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                {...register('newUsername')}
                type="text"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter new username"
              />
            </div>
            {errors.newUsername && (
              <p className="mt-1 text-sm text-red-600">{errors.newUsername.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password *
            </label>
            <div className="relative">
              <input
                {...register('newPassword')}
                type={showNewPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  <span>Update Credentials</span>
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Security Tips */}
      <motion.div
        className="bg-yellow-50 border border-yellow-200 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-yellow-900 mb-4">Security Best Practices</h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          {securityTips.map((tip, index) => (
            <li key={index} className="flex items-start space-x-2">
              <span className="text-yellow-600 mt-1">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Demo Notice */}
      <motion.div
        className="bg-gray-50 border border-gray-200 rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Demo Notice</h3>
        <p className="text-sm text-gray-600">
          This is a demonstration version. In a production environment, passwords would be properly 
          hashed and stored securely in the database. The current demo credentials are:
        </p>
        <div className="mt-3 p-3 bg-white rounded border text-sm">
          <p><strong>Username:</strong> admin123</p>
          <p><strong>Password:</strong> admin123</p>
        </div>
      </motion.div>
    </div>
  );
};