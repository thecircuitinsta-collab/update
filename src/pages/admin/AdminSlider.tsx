import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Upload, X } from 'lucide-react';
import { fetchData, insertData, updateData, deleteData, uploadImage } from '../../lib/supabase';
import { SliderImage } from '../../types';
import { Modal } from '../../components/UI/Modal';
import { LoadingSpinner } from '../../components/UI/LoadingSpinner';

const schema = yup.object().shape({
  caption: yup.string().required('Caption is required'),
});

interface FormData {
  caption: string;
}

export const AdminSlider: React.FC = () => {
  const [images, setImages] = useState<SliderImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<SliderImage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');

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
      const data = await fetchData('slider_images');
      setImages(data);
    } catch (error) {
      console.error('Error fetching slider images:', error);
      toast.error('Failed to fetch slider images');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const imageData = {
        ...data,
        image: selectedImage || (editingImage?.image || '')
      };

      if (editingImage) {
        await updateData('slider_images', editingImage.id, imageData);
        toast.success('Slider image updated successfully');
      } else {
        await insertData('slider_images', imageData);
        toast.success('Slider image added successfully');
      }

      setIsModalOpen(false);
      setEditingImage(null);
      setSelectedImage('');
      reset();
      fetchImages();
    } catch (error) {
      console.error('Error saving slider image:', error);
      toast.error('Failed to save slider image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (image: SliderImage) => {
    setEditingImage(image);
    setValue('caption', image.caption);
    setSelectedImage(image.image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this slider image?')) return;

    try {
      await deleteData('slider_images', id);
      toast.success('Slider image deleted successfully');
      fetchImages();
    } catch (error) {
      console.error('Error deleting slider image:', error);
      toast.error('Failed to delete slider image');
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

  const openPreview = (index: number) => {
    setPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const nextPreview = () => {
    setPreviewIndex((prev) => (prev + 1) % images.length);
  };

  const prevPreview = () => {
    setPreviewIndex((prev) => (prev - 1 + images.length) % images.length);
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Hero Slider Management</h1>
          <p className="text-gray-600 mt-1">Manage homepage hero slider images</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 w-fit"
        >
          <Plus className="h-5 w-5" />
          <span>Add Slide</span>
        </button>
      </div>

      {/* Preview Section */}
      {images.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Slider Preview</h2>
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={images[0].image}
              alt={images[0].caption}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Zentra Holdings</h3>
                <p className="text-lg">{images[0].caption}</p>
              </div>
            </div>
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {images.slice(0, 5).map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? 'bg-white' : 'bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slider Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {images.map((image, index) => (
          <motion.div
            key={image.id}
            className="bg-white rounded-lg shadow-md overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="aspect-video overflow-hidden relative">
              <img
                src={image.image}
                alt={image.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                  <button
                    onClick={() => openPreview(index)}
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
              {index === 0 && (
                <div className="absolute top-2 left-2">
                  <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                    Primary
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-900 font-medium line-clamp-2 mb-2">
                {image.caption}
              </p>
              <p className="text-xs text-gray-500">
                Added {new Date(image.created_at).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No slider images found</p>
          <button
            onClick={handleAddNew}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Your First Slide
          </button>
        </div>
      )}

      {/* Add/Edit Slider Image Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingImage ? 'Edit Slider Image' : 'Add New Slider Image'}
        maxWidth="max-w-2xl"
      >
        <div onClick={handleModalClick}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slider Image *
            </label>
            <div className="space-y-3">
              <label className="cursor-pointer bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-100 transition-colors block">
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload slider image</p>
                  <p className="text-xs text-gray-500">Recommended: 1920x1080px, PNG/JPG up to 10MB</p>
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
                  <div className="relative h-48 rounded-md overflow-hidden">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="text-xl font-bold mb-1">Zentra Holdings</h3>
                        <p className="text-sm">Your Grounds, Our Priority</p>
                      </div>
                    </div>
                  </div>
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
              Caption *
            </label>
            <input
              {...register('caption')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="e.g., Professional Lawn Care Services"
            />
            {errors.caption && (
              <p className="mt-1 text-sm text-red-600">{errors.caption.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              This text will appear over the image on the homepage
            </p>
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
                <span>{editingImage ? 'Update' : 'Add'} Slide</span>
              )}
            </button>
          </div>
        </form>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        maxWidth="max-w-6xl"
      >
        <div onClick={handleModalClick}>
          {images.length > 0 && (
          <div className="relative">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img
                src={images[previewIndex].image}
                alt={images[previewIndex].caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-4xl font-bold mb-4">Zentra Holdings</h3>
                  <p className="text-xl mb-2">Your Grounds, Our Priority</p>
                  <p className="text-lg">{images[previewIndex].caption}</p>
                </div>
              </div>
            </div>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevPreview}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextPreview}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-colors"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setPreviewIndex(index)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === previewIndex ? 'bg-white' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Slide {previewIndex + 1} of {images.length}
              </p>
            </div>
          </div>
          )}
        </div>
      </Modal>
    </div>
  );
};