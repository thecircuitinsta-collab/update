import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, Plus } from 'lucide-react';
import { fetchData } from '../lib/supabase';
import { GalleryImage } from '../types';
import { Modal } from '../components/UI/Modal';

export const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All' },
    { value: 'lawn-care', label: 'Lawn Care' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'tree-care', label: 'Tree Care' },
    { value: 'garden', label: 'Garden Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'general', label: 'General' }
  ];
  // Default gallery images to show immediately
  const defaultGallery = [
    { id: '1', image: 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Professional Lawn Maintenance', category: 'lawn-care', created_at: new Date().toISOString() },
    { id: '2', image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Beautiful Garden Design', category: 'landscaping', created_at: new Date().toISOString() },
    { id: '3', image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Landscape Installation', category: 'landscaping', created_at: new Date().toISOString() },
    { id: '4', image: 'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Tree and Shrub Care', category: 'tree-care', created_at: new Date().toISOString() },
    { id: '5', image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Seasonal Cleanup', category: 'maintenance', created_at: new Date().toISOString() },
    { id: '6', image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Irrigation Services', category: 'irrigation', created_at: new Date().toISOString() },
    { id: '7', image: 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Flower Garden Design', category: 'garden', created_at: new Date().toISOString() },
    { id: '8', image: 'https://images.pexels.com/photos/1212487/pexels-photo-1212487.jpeg?auto=compress&cs=tinysrgb&w=800', caption: 'Pathway Installation', category: 'landscaping', created_at: new Date().toISOString() },
  ];

  useEffect(() => {
    // Set default data immediately
    setImages(defaultGallery);
    // Fetch from database in background
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const data = await fetchData('gallery');
      // Only update if we got data from database
      if (data && data.length > 0) {
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      // Keep default images on error
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (image: GalleryImage) => {
    if (image.image) return image.image;
    
    // Default gallery images
    const defaultImages = [
      'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
    ];
    
    const index = images.indexOf(image) % defaultImages.length;
    return defaultImages[index];
  };

  const filteredImages = images.filter(image => {
    if (selectedCategory === 'all') return true;
    return image.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Work Gallery</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our portfolio of beautiful landscapes and satisfied customers. 
            Each project represents our commitment to excellence and attention to detail.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2 justify-center">
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
              className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setSelectedImage(image)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.image}
                  alt={image.caption || 'Gallery image'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <Plus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-8 w-8" />
              </div>
              {image.caption && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                  <p className="text-white text-sm font-medium">{image.caption}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {selectedCategory === 'all' ? 'No images in gallery yet.' : `No images in ${categories.find(cat => cat.value === selectedCategory)?.label} category.`}
            </p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Create Your Dream Landscape?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Let us transform your outdoor space into something beautiful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
            >
              Get Free Estimate
            </Link>
            <a
              href="tel:+61422666104"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Call Today
            </a>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Modal
        isOpen={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        maxWidth="max-w-4xl"
      >
        {selectedImage && (
          <div className="relative">
            <img
              src={selectedImage.image}
              alt={selectedImage.caption || 'Gallery image'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            {selectedImage.caption && (
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedImage.caption}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};