import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, Upload, X } from 'lucide-react';
import { fetchData, insertData, updateData, deleteData, uploadImage } from '../../lib/supabase';
import { GalleryImage } from '../../types';
import { Modal } from '../../components/UI/Modal';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';

const schema = yup.object().shape({
  caption: yup.string().required('Caption is required'),
  category: yup.string().required('Category is required'),
});

interface FormData {
  caption: string;
  category: string;
}

export const AdminGallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'lawn-care', label: 'Lawn Care' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'tree-care', label: 'Tree Care' },
    { value: 'garden', label: 'Garden Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'general', label: 'General' }
  ];
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const data = await fetchData('gallery');
      setImages(data);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      toast.error('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const imageData = {
        ...data,
        image: selectedImage || (editingImage?.image || ''),
        category: data.category
      };

      if (editingImage) {
        await updateData('gallery', editingImage.id, imageData);
        toast.success('Image updated successfully');
      } else {
        await insertData('gallery', imageData);
        toast.success('Image added successfully');
      }

      setIsModalOpen(false);
      setEditingImage(null);
      setSelectedImage('');
      reset();
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
      toast.error('Failed to save image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setValue('caption', image.caption);
    setValue('category', image.category || 'general');
    setSelectedImage(image.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      await deleteData('gallery', id);
      toast.success('Image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleAddNew = () => {
    setEditingImage(null);
    setSelectedImage('');
    reset();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingImage(null);
    setSelectedImage('');
    reset();
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      setSelectedImage(imageUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const filteredImages = images.filter(image => {
    if (selectedCategory === 'all') return true;
    return image.category === selectedCategory;
  });

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gallery Management</h1>
          <p className="text-gray-600 mt-1">Manage your image gallery</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-fit"
        >
          <Plus className="h-5 w-5" />
          <span>Add Image</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category.value
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600 border border-gray-300'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredImages.map((image, index) => (
          <motion.div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="aspect-square overflow-hidden relative">
              <img
                src={image.image}
                alt={image.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    onClick={() => setPreviewImage(image)}
                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    title="Preview"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(image)}
                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-2">
                {image.caption}
              </p>
              <div className="flex items-center justify-between">
                <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {categories.find(cat => cat.value === image.category)?.label || 'General'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">
            {selectedCategory === 'all' ? 'No images in gallery' : `No images in ${categories.find(cat => cat.value === selectedCategory)?.label} category`}
          </p>
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Image
          </button>
        </div>
      )}

      {/* Add/Edit Image Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingImage ? 'Edit Image' : 'Add New Image'}
        maxWidth="max-w-2xl"
      >
        <div onClick={handleModalClick}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image *
            </label>
            <div className="space-y-3">
              <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition-colors block">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload image</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              
              {selectedImage && (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage('')}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {!selectedImage && (
              <p className="text-sm text-red-600">Please upload an image</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register('category')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select a category</option>
              {categories.slice(1).map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Caption *
            </label>
            <input
              {...register('caption')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Beautiful garden transformation"
            />
            {errors.caption && (
              <p className="mt-1 text-sm text-red-600">{errors.caption.message}</p>
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
              disabled={isSubmitting || !selectedImage}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <span>{editingImage ? 'Update' : 'Add'} Image</span>
              )}
            </button>
          </div>
        </form>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={previewImage !== null}
        onClose={() => setPreviewImage(null)}
        maxWidth="max-w-4xl"
      >
        <div onClick={handleModalClick}>
          {previewImage && (
          <div className="text-center">
            <img
              src={previewImage.image}
              alt={previewImage.caption}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {previewImage.caption}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Added on {new Date(previewImage.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          )}
        </div>
      </Modal>
    </div>
  );
};