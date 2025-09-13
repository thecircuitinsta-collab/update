import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchData } from '../lib/supabase';
import { Service } from '../types';
import { Modal } from '../components/UI/Modal';

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(false);

  // Default services to show immediately
  const defaultServices = [
    {
      id: '1',
      title: 'Professional Lawn Mowing',
      description: 'Regular lawn mowing service to keep your grass healthy and well-maintained. We use professional equipment and techniques to ensure your lawn looks perfect every time.',
      image: 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'maintenance',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Landscape Design & Installation',
      description: 'Custom landscape design services to transform your outdoor space. From concept to completion, we create beautiful and functional landscapes.',
      image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'design',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Tree Trimming & Pruning',
      description: 'Professional tree care services to maintain healthy and beautiful trees. Our certified arborists ensure proper pruning techniques.',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'maintenance',
      created_at: new Date().toISOString()
    },
    {
      id: '4',
      title: 'Garden Installation',
      description: 'Beautiful garden installation with native plants and professional design. We create sustainable gardens that thrive in your climate.',
      image: 'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'installation',
      created_at: new Date().toISOString()
    },
    {
      id: '5',
      title: 'Seasonal Cleanup',
      description: 'Comprehensive seasonal cleanup services including leaf removal, debris clearing, and preparation for the next season.',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'maintenance',
      created_at: new Date().toISOString()
    },
    {
      id: '6',
      title: 'Irrigation Services',
      description: 'Professional irrigation system installation and maintenance. Smart watering solutions for efficient water usage.',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=600',
      category: 'installation',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Set default data immediately
    setServices(defaultServices);
    // Fetch from database in background
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await fetchData('services');
      // Only update if we got data from database
      if (data && data.length > 0) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      // Keep default services on error
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  const getServiceImage = (service: Service) => {
    if (service.image) return service.image;
    
    // Default images based on service type
    const defaultImages: { [key: string]: string } = {
      'maintenance': 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=600',
      'design': 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=600',
      'installation': 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=600',
      'general': 'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=600'
    };
    
    return defaultImages[service.category] || defaultImages.general;
  };

  const getServiceFeatures = (service: Service) => {
    // Generate relevant features based on service title and category
    const featuresByCategory: { [key: string]: string[] } = {
      'maintenance': [
        'Professional equipment used',
        'Regular scheduling available',
        'Cleanup included',
        'Flexible timing options'
      ],
      'design': [
        'Custom design consultation',
        'Professional planning',
        'Plant selection guidance', 
        '3D visualization available'
      ],
      'installation': [
        'Quality materials',
        'Professional installation',
        'Warranty included',
        'Post-installation support'
      ],
      'general': [
        'Licensed professionals',
        'Insured service',
        'Satisfaction guaranteed',
        'Free consultation'
      ]
    };
    
    return featuresByCategory[service.category] || featuresByCategory.general;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional lawn care and landscaping services tailored to your needs. 
            From regular maintenance to complete landscape transformations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => setSelectedService(service)}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={getServiceImage(service)}
                  alt={service.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {service.category.charAt(0).toUpperCase() + service.category.slice(1)}
                  </span>
                </div>
                <Link
                  to="/contact"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center inline-block mt-4"
                >
                  Learn More →
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services available at the moment.</p>
          </div>
        )}
      </div>

      {/* Service Modal */}
      <Modal
        isOpen={selectedService !== null}
        onClose={() => setSelectedService(null)}
        maxWidth="max-w-2xl"
      >
        {selectedService && (
          <div>
            <div className="mb-6">
              <img
                src={getServiceImage(selectedService)}
                alt={selectedService.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {selectedService.title}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {selectedService.description}
            </p>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What's Included:</h3>
              <ul className="space-y-2">
                {getServiceFeatures(selectedService).map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Link
                to="/contact"
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-center inline-block"
              >
                Book This Service
              </Link>
              <a
                href="tel:+61422666104"
                className="flex-1 flex items-center justify-center space-x-2 border-2 border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white transition-colors font-medium"
              >
                <Phone className="h-4 w-4" />
                <span>Call Now</span>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};