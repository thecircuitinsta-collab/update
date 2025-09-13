import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  Images,
  Sliders
} from 'lucide-react';
import { fetchData } from '../../lib/supabase';

interface Stats {
  totalServices: number;
  totalProjects: number;
  totalBookings: number;
  pendingBookings: number;
  pendingTestimonials: number;
  approvedTestimonials: number;
  totalGalleryImages: number;
  totalSliderImages: number;
}

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    totalProjects: 0,
    totalBookings: 0,
    pendingBookings: 0,
    pendingTestimonials: 0,
    approvedTestimonials: 0,
    totalGalleryImages: 0,
    totalSliderImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [
        services,
        projects,
        bookings,
        testimonials,
        gallery,
        slider,
      ] = await Promise.all([
        fetchData('services'),
        fetchData('projects'),
        fetchData('bookings'),
        fetchData('testimonials'),
        fetchData('gallery'),
        fetchData('slider_images'),
      ]);

      const pendingBookings = bookings.filter((b: any) => b.status === 'pending').length;
      const pendingTestimonials = testimonials.filter((t: any) => t.status === 'pending').length;
      const approvedTestimonials = testimonials.filter((t: any) => t.status === 'approved').length;

      setStats({
        totalServices: services.length,
        totalProjects: projects.length,
        totalBookings: bookings.length,
        pendingBookings,
        pendingTestimonials,
        approvedTestimonials,
        totalGalleryImages: gallery.length,
        totalSliderImages: slider.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'New Bookings',
      value: stats.pendingBookings,
      icon: Calendar,
      color: 'bg-orange-500',
      change: stats.pendingBookings > 0 ? `+${stats.pendingBookings}` : '0',
    },
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: Briefcase,
      color: 'bg-blue-500',
      change: '+12%',
    },
    {
      title: 'Active Projects',
      value: stats.totalProjects,
      icon: FileText,
      color: 'bg-green-500',
      change: '+8%',
    },
    {
      title: 'Approved Reviews',
      value: stats.approvedTestimonials,
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: '+15%',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      title: `${stats.pendingBookings} new booking requests`,
      time: '1 hour ago',
      icon: Calendar,
    },
    {
      id: 2,
      type: 'service',
      title: 'Service management system ready',
      time: '2 hours ago',
      icon: Briefcase,
    },
    {
      id: 3,
      type: 'project',
      title: 'Project showcase system active',
      time: '4 hours ago',
      icon: FileText,
    },
    {
      id: 4,
      type: 'testimonial',
      title: `${stats.pendingTestimonials} testimonials pending review`,
      time: '6 hours ago',
      icon: MessageSquare,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your business.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="bg-white rounded-lg shadow-md p-4 sm:p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3 flex-shrink-0`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-5 w-5 text-gray-400 mt-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                      <Clock className="h-3 w-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-lg shadow-md p-4 sm:p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/admin/bookings"
              className="bg-orange-50 text-orange-700 p-4 rounded-lg hover:bg-orange-100 transition-colors text-left block"
            >
              <Calendar className="h-6 w-6 mb-2" />
              <p className="font-medium">View Bookings</p>
              <p className="text-xs text-orange-600">
                {stats.pendingBookings} pending
              </p>
            </Link>
            <Link
              to="/admin/services"
              className="bg-green-50 text-green-700 p-4 rounded-lg hover:bg-green-100 transition-colors text-left block"
            >
              <Briefcase className="h-6 w-6 mb-2" />
              <p className="font-medium">Add Service</p>
              <p className="text-xs text-green-600">Create new service</p>
            </Link>
            <Link
              to="/admin/gallery"
              className="bg-purple-50 text-purple-700 p-4 rounded-lg hover:bg-purple-100 transition-colors text-left block"
            >
              <Images className="h-6 w-6 mb-2" />
              <p className="font-medium">Upload Images</p>
              <p className="text-xs text-purple-600">Add to gallery</p>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-4 sm:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Content Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalBookings}</div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalServices}</div>
            <div className="text-sm text-gray-600">Services</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalProjects}</div>
            <div className="text-sm text-gray-600">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalGalleryImages}</div>
            <div className="text-sm text-gray-600">Gallery Images</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.totalSliderImages}</div>
            <div className="text-sm text-gray-600">Slider Images</div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats.approvedTestimonials}</div>
            <div className="text-sm text-gray-600">Approved Reviews</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};