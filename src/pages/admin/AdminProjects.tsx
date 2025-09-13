import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import { fetchData, insertData, updateData, deleteData, uploadImage } from '../../lib/supabase';
import { Project } from '../../types';
import { Modal } from '../../components/UI/Modal';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  client_name: yup.string().nullable(),
});

interface FormData {
  title: string;
  description: string;
  client_name?: string;
}

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slideStates, setSlideStates] = useState<{ [key: string]: number }>({});
  const [beforeImage, setBeforeImage] = useState<string>('');
  const [afterImage, setAfterImage] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await fetchData('projects');
      setProjects(data);
      
      // Initialize slide states
      const initialSlideStates: { [key: string]: number } = {};
      data.forEach((project: Project) => {
        initialSlideStates[project.id] = 0;
      });
      setSlideStates(initialSlideStates);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const projectData = {
        ...data,
        before_image: beforeImage || (editingProject?.before_image || ''),
        after_image: afterImage || (editingProject?.after_image || '')
      };

      if (editingProject) {
        await updateData('projects', editingProject.id, projectData);
        toast.success('Project updated successfully');
      } else {
        await insertData('projects', projectData);
        toast.success('Project created successfully');
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setBeforeImage('');
      setAfterImage('');
      reset();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setValue('title', project.title);
    setValue('description', project.description);
    setValue('client_name', project.client_name || '');
    setBeforeImage(project.before_image || '');
    setAfterImage(project.after_image || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await deleteData('projects', id);
      toast.success('Project deleted successfully');
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project');
    }
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setBeforeImage('');
    setAfterImage('');
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setBeforeImage('');
    setAfterImage('');
    reset();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const toggleSlide = (projectId: string) => {
    setSlideStates(prev => ({
      ...prev,
      [projectId]: prev[projectId] === 0 ? 1 : 0
    }));
  };

  const handleBeforeImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setBeforeImage(imageUrl);
      toast.success('Before image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const handleAfterImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setAfterImage(imageUrl);
      toast.success('After image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const getProjectImages = (project: Project) => {
    const defaultBefore = 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=400';
    const defaultAfter = 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=400';
    
    return {
      before: project.before_image || defaultBefore,
      after: project.after_image || defaultAfter
    };
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projects Management</h1>
          <p className="text-gray-600 mt-1">Manage your project portfolio</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-fit"
        >
          <Plus className="h-5 w-5" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {projects.map((project, index) => {
          const images = getProjectImages(project);
          const currentSlide = slideStates[project.id] || 0;
          const currentImage = currentSlide === 0 ? images.before : images.after;
          const currentLabel = currentSlide === 0 ? 'BEFORE' : 'AFTER';
          
          return (
            <motion.div
              key={project.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Image Section */}
              <div className="relative h-64 overflow-hidden group">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${currentImage})` }}
                />
                
                {/* Before/After Label */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    currentSlide === 0 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {currentLabel}
                  </span>
                </div>

                {/* Navigation Buttons */}
                <button
                  onClick={() => toggleSlide(project.id)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => toggleSlide(project.id)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Slide Indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  <button
                    onClick={() => setSlideStates(prev => ({ ...prev, [project.id]: 0 }))}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === 0 ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                  <button
                    onClick={() => setSlideStates(prev => ({ ...prev, [project.id]: 1 }))}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      currentSlide === 1 ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  {project.client_name && (
                    <span>Client: {project.client_name}</span>
                  )}
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 rounded transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No projects found</p>
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Project
          </button>
        </div>
      )}

      {/* Project Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        maxWidth="max-w-2xl"
      >
        <div onClick={handleModalClick}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Modern Front Yard Makeover"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name
            </label>
            <input
              {...register('client_name')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., John Smith"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Before Image
              </label>
              <div className="space-y-3">
                <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-colors block">
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload before image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBeforeImageUpload}
                    className="hidden"
                  />
                </label>
                
                {beforeImage && (
                  <div className="relative">
                    <img
                      src={beforeImage}
                      alt="Before preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setBeforeImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                After Image
              </label>
              <div className="space-y-3">
                <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-colors block">
                  <div className="text-center">
                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Upload after image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAfterImageUpload}
                    className="hidden"
                  />
                </label>
                
                {afterImage && (
                  <div className="relative">
                    <img
                      src={afterImage}
                      alt="After preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setAfterImage('')}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the project, challenges, and results..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>{editingProject ? 'Update' : 'Create'} Project</span>
              )}
            </button>
          </div>
        </form>
        </div>
      </Modal>
    </div>
  );
};