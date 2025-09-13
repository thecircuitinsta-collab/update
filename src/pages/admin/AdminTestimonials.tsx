import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Check, X, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchData, updateData, deleteData } from '../../lib/supabase';
import { Testimonial } from '../../types';
import { Modal } from '../../components/UI/Modal';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await fetchData('testimonials');
      setTestimonials(data);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      toast.error('Failed to fetch testimonials');
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonialStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateData('testimonials', id, { status });
      toast.success(`Testimonial ${status} successfully`);
      fetchTestimonials();
    } catch (error) {
      console.error('Error updating testimonial:', error);
      toast.error('Failed to update testimonial');
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      await deleteData('testimonials', id);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filter === 'all') return true;
    return testimonial.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: testimonials.length,
    pending: testimonials.filter(t => t.status === 'pending').length,
    approved: testimonials.filter(t => t.status === 'approved').length,
    rejected: testimonials.filter(t => t.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Testimonials Management</h1>
        <p className="text-gray-600 mt-1">Review and manage customer testimonials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: 'all', label: 'All' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.id}
            className="bg-white rounded-lg shadow-md p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {testimonial.client_name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(testimonial.status)}`}>
                    {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    ({testimonial.rating}/5)
                  </span>
                </div>
                
                <p className="text-gray-700 line-clamp-3">
                  "{testimonial.review_text}"
                </p>
                
                <p className="text-sm text-gray-500 mt-2">
                  Submitted on {new Date(testimonial.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setSelectedTestimonial(testimonial)}
                className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                title="View Details"
              >
                <Eye className="h-4 w-4" />
              </button>
              
              {testimonial.status === 'pending' && (
                <>
                  <button
                    onClick={() => updateTestimonialStatus(testimonial.id, 'approved')}
                    className="text-green-600 hover:text-green-700 p-2 hover:bg-green-50 rounded transition-colors"
                    title="Approve"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateTestimonialStatus(testimonial.id, 'rejected')}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                    title="Reject"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              )}
              
              {testimonial.status !== 'pending' && (
                <button
                  onClick={() => updateTestimonialStatus(testimonial.id, 'pending')}
                  className="text-yellow-600 hover:text-yellow-700 p-2 hover:bg-yellow-50 rounded transition-colors text-xs"
                  title="Mark as Pending"
                >
                  Reset
                </button>
              )}
              
              <button
                onClick={() => deleteTestimonial(testimonial.id)}
                className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {filter === 'all' ? 'No testimonials found' : `No ${filter} testimonials`}
          </p>
        </div>
      )}

      {/* Testimonial Details Modal */}
      <Modal
        isOpen={selectedTestimonial !== null}
        onClose={() => setSelectedTestimonial(null)}
        title="Testimonial Details"
        maxWidth="max-w-2xl"
      >
        <div onClick={handleModalClick}>
          {selectedTestimonial && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedTestimonial.client_name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedTestimonial.status)}`}>
                {selectedTestimonial.status.charAt(0).toUpperCase() + selectedTestimonial.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < selectedTestimonial.rating
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-gray-600 ml-2">
                ({selectedTestimonial.rating}/5)
              </span>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 italic">
                "{selectedTestimonial.review_text}"
              </p>
            </div>
            
            <div className="text-sm text-gray-500">
              <p>Submitted on: {new Date(selectedTestimonial.created_at).toLocaleDateString()}</p>
              <p>Time: {new Date(selectedTestimonial.created_at).toLocaleTimeString()}</p>
            </div>

            {selectedTestimonial.status === 'pending' && (
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    updateTestimonialStatus(selectedTestimonial.id, 'approved');
                    setSelectedTestimonial(null);
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Approve</span>
                </button>
                <button
                  onClick={() => {
                    updateTestimonialStatus(selectedTestimonial.id, 'rejected');
                    setSelectedTestimonial(null);
                  }}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Reject</span>
                </button>
              </div>
            )}
          </div>
          )}
        </div>
      </Modal>
    </div>
  );
};