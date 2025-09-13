import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, User, Calendar } from 'lucide-react';
import { fetchData } from '../lib/supabase';
import { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [slideStates, setSlideStates] = useState<{ [key: string]: number }>({});

  // Default projects to show immediately
  const defaultProjects = [
    {
      id: '1',
      title: 'Modern Front Yard Makeover',
      description: 'Complete transformation of a residential front yard with new landscaping, modern design elements, and sustainable plant choices.',
      before_image: 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=800',
      after_image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
      client_name: 'John Smith',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Backyard Garden Installation',
      description: 'Beautiful garden installation with native plants and irrigation system. Created a peaceful outdoor retreat for the family.',
      before_image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
      after_image: 'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800',
      client_name: 'Mary Johnson',
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Commercial Landscape Design',
      description: 'Professional landscape design for commercial property including walkways, seating areas, and low-maintenance plantings.',
      before_image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
      after_image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      client_name: 'ABC Corporation',
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Set default data immediately
    setProjects(defaultProjects);
    // Initialize slide states
    const initialSlideStates: { [key: string]: number } = {};
    defaultProjects.forEach((project) => {
      initialSlideStates[project.id] = 0;
    });
    setSlideStates(initialSlideStates);
    // Fetch from database in background
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await fetchData('projects');
      // Only update if we got data from database
      if (projectsData && projectsData.length > 0) {
        setProjects(projectsData);
        // Update slide states for new projects
        const initialSlideStates: { [key: string]: number } = {};
        projectsData.forEach((project: Project) => {
          initialSlideStates[project.id] = 0;
        });
        setSlideStates(initialSlideStates);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Keep default projects on error
    } finally {
      setLoading(false);
    }
  };

  const toggleSlide = (projectId: string) => {
    setSlideStates(prev => ({
      ...prev,
      [projectId]: prev[projectId] === 0 ? 1 : 0
    }));
  };

  const getProjectImages = (project: Project) => {
    const defaultBefore = 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=800';
    const defaultAfter = 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800';
    
    return {
      before: project.before_image || defaultBefore,
      after: project.after_image || defaultAfter
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the transformations we've created for our satisfied clients. 
            From overgrown yards to beautiful landscapes, we bring your vision to life.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => {
            const images = getProjectImages(project);
            const currentSlide = slideStates[project.id] || 0;
            const currentImage = currentSlide === 0 ? images.before : images.after;
            const currentLabel = currentSlide === 0 ? 'BEFORE' : 'AFTER';
            
            return (
              <motion.div
                key={project.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                {/* Image Section with Before/After Slider */}
                <div className="relative h-80 overflow-hidden group">
                  <motion.div
                    key={currentSlide}
                    className="w-full h-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${currentImage})` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
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
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => toggleSlide(project.id)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>

                  {/* Slide Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    <button
                      onClick={() => setSlideStates(prev => ({ ...prev, [project.id]: 0 }))}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSlide === 0 ? 'bg-white' : 'bg-gray-400'
                      }`}
                    />
                    <button
                      onClick={() => setSlideStates(prev => ({ ...prev, [project.id]: 1 }))}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        currentSlide === 1 ? 'bg-white' : 'bg-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    {project.client_name && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{project.client_name}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Link
                    to="/contact"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium inline-block text-center"
                  >
                    Contact us for a site assessment
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects available at the moment.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Let us create a beautiful landscape transformation for your property.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
            >
              Get Free Quote
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
    </div>
  );
};