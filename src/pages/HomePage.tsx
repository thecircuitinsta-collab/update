import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Star, CheckCircle, Leaf, Award, Shield } from 'lucide-react';
import { fetchData, submitTestimonial } from '../lib/supabase';
import { SliderImage, Testimonial } from '../types';
import { ParticlesBackground } from '../components/UI/ParticlesBackground';

const reviewSchema = yup.object().shape({
  client_name: yup.string().required('Name is required'),
  review_text: yup.string().required('Review is required').min(10, 'Review must be at least 10 characters'),
  rating: yup.number().required('Rating is required').min(1).max(5),
});

interface ReviewFormData {
  client_name: string;
  review_text: string;
  rating: number;
}

export const HomePage: React.FC = () => {
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ReviewFormData>({
    resolver: yupResolver(reviewSchema)
  });

  const watchedRating = watch('rating');

  // Default data to show immediately
  const defaultSlides = [
    {
      id: 'default-1',
      image:'' ,
      caption: 'Professional Lawn Care Services',
      created_at: new Date().toISOString()
    },
    {
      id: 'default-2', 
      image: '',
      caption: 'Beautiful Landscape Design',
      created_at: new Date().toISOString()
    },
  ];

  const defaultTestimonials = [
    {
      id: '1',
      client_name: 'Sarah Johnson',
      review_text: 'Excellent service! My lawn has never looked better. The team is professional and reliable.',
      rating: 5,
      status: 'approved' as const,
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      client_name: 'Mike Davis',
      review_text: 'Professional team and great results. Highly recommended for all landscaping needs!',
      rating: 5,
      status: 'approved' as const,
      created_at: new Date().toISOString()
    },
    {
      id: '3',
      client_name: 'Lisa Chen',
      review_text: 'Amazing transformation of our backyard. Thank you for the beautiful work!',
      rating: 5,
      status: 'approved' as const,
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Set default data immediately
    setSliderImages(defaultSlides);
    setTestimonials(defaultTestimonials);
    
    // Try to fetch from database in background
    fetchDataInBackground();
  }, []);

  const fetchDataInBackground = async () => {
    try {
      setLoading(true);
      const [sliderData, testimonialsData] = await Promise.all([
        fetchData('slider_images'),
        fetchData('testimonials')
      ]);

      // Only update if we got data from database
      if (sliderData && sliderData.length > 0) {
        setSliderImages(sliderData);
      }
      
      if (testimonialsData && testimonialsData.length > 0) {
        const approvedTestimonials = testimonialsData.filter((t: Testimonial) => t.status === 'approved');
        if (approvedTestimonials.length > 0) {
          setTestimonials(approvedTestimonials);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load some content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sliderImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [sliderImages]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const onSubmitReview = async (data: ReviewFormData) => {
    setIsSubmittingReview(true);
    try {
      await submitTestimonial(data);
      toast.success('Thank you for your review! It will be published after approval.');
      reset();
      setShowReviewForm(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="relative">
      <ParticlesBackground />
      
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0">
          {sliderImages.map((slide, index) => (
            <motion.div
              key={slide.id}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentSlide ? 1 : 0 }}
              transition={{ duration: 1 }}
            />
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Zentra Holdings
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-2"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your Grounds, Our Priority
            </motion.p>
            <motion.p
              className="text-lg md:text-xl mb-8 text-gray-200"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Lawn Mowing & Landscaping — A Greener Yard Awaits!
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link
                to="/contact"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
              >
                Book a Service
              </Link>
              <a
                href="tel:+61422666104"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Call Us Now
              </a>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        {sliderImages.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-green-400 transition-colors z-20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-green-400 transition-colors z-20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
            
            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Zentra Holdings?</h2>
            <p className="text-xl text-gray-600">We're committed to providing exceptional lawn care and landscaping services</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Vetted Professionals</h3>
              <p className="text-gray-600">
                Our landscapers are thoroughly vetted, licensed, and experienced professionals 
                who deliver quality work every time.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Leaf className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Eco-Friendly</h3>
              <p className="text-gray-600">
                We use environmentally responsible practices and products to keep your 
                landscape beautiful while protecting the environment.
              </p>
            </motion.div>
            
            <motion.div
              className="text-center p-6"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Fully Insured</h3>
              <p className="text-gray-600">
                We're fully licensed and insured, giving you peace of mind that your 
                property is protected during our services.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-xl text-gray-600">Don't just take our word for it</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                className="bg-white p-6 rounded-lg shadow-lg"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.review_text}"</p>
                <div className="font-semibold text-gray-900">
                  — {testimonial.client_name}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Write a Review Section */}
          <div className="mt-12 text-center">
            {!showReviewForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Share Your Experience</h3>
                <p className="text-gray-600 mb-6">We'd love to hear about your experience with our services!</p>
                <button
                  onClick={() => setShowReviewForm(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  Write a Review
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Write Your Review</h3>
                <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      {...register('client_name')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your name"
                    />
                    {errors.client_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.client_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating *
                    </label>
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <label key={rating} className="cursor-pointer relative">
                          <input
                            {...register('rating')}
                            type="radio"
                            value={rating}
                            className="absolute opacity-0"
                          />
                          <Star className={`h-8 w-8 transition-colors ${
                            rating <= (watchedRating || 0) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300 hover:text-yellow-400'
                          }`} />
                        </label>
                      ))}
                    </div>
                    {errors.rating && (
                      <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review *
                    </label>
                    <textarea
                      {...register('review_text')}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tell us about your experience with our services..."
                    />
                    {errors.review_text && (
                      <p className="mt-1 text-sm text-red-600">{errors.review_text.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowReviewForm(false);
                        reset();
                      }}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmittingReview ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Submitting...
                        </div>
                      ) : (
                        'Submit Review'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Outdoor Space?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Get a free consultation and see how we can make your property beautiful.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
              >
                Get Free Quote
              </Link>
              <a
                href="tel:+61422666104"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          {error}
        </div>
      )}
    </div>
  );
};