import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Award, 
  Shield, 
  Users, 
  Clock, 
  CheckCircle, 
  Leaf,
  Star,
  Phone
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const milestones = [
    {
      year: '2018',
      title: 'Company Founded',
      description: 'Started with a vision to provide exceptional lawn care services to our community.'
    },
    {
      year: '2019',
      title: '100+ Happy Clients',
      description: 'Reached our first major milestone with over 100 satisfied customers.'
    },
    {
      year: '2020',
      title: 'Team Expansion',
      description: 'Grew our team of certified landscaping professionals to better serve our clients.'
    },
    {
      year: '2021',
      title: 'Service Diversification',
      description: 'Expanded our services to include full landscape design and installation.'
    },
    {
      year: '2022',
      title: 'Award Recognition',
      description: 'Received "Best Landscaping Service" award from the local business association.'
    },
    {
      year: '2024',
      title: '1000+ Projects',
      description: 'Completed over 1000 successful landscaping projects across the region.'
    }
  ];

  const values = [
    {
      icon: CheckCircle,
      title: 'Quality First',
      description: 'We never compromise on quality. Every project receives our full attention and expertise.'
    },
    {
      icon: Shield,
      title: 'Fully Insured',
      description: 'Licensed and insured for your peace of mind. Your property is protected with us.'
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'We use environmentally responsible practices and sustainable landscaping methods.'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Our certified professionals bring years of experience to every project.'
    },
    {
      icon: Clock,
      title: 'Reliable Service',
      description: 'We show up on time, every time. Dependability is our commitment to you.'
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for excellence in landscaping and customer service.'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Projects Completed' },
    { number: '500+', label: 'Happy Clients' },
    { number: '6+', label: 'Years Experience' },
    { number: '15+', label: 'Team Members' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-600 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <motion.h1
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Zentra Holdings
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Your trusted partner in creating and maintaining beautiful outdoor spaces. 
              We transform yards into stunning landscapes that enhance your property's value and your quality of life.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="text-4xl md:text-5xl font-bold text-green-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2018, Zentra Holdings began with a simple mission: to provide exceptional 
                lawn care and landscaping services that exceed our clients' expectations. What started 
                as a small local business has grown into a trusted name in the landscaping industry.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe that every outdoor space has the potential to be extraordinary. Our team 
                of certified professionals combines creativity, expertise, and attention to detail 
                to transform ordinary yards into beautiful, functional landscapes.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to serve hundreds of satisfied customers across the region, 
                maintaining our commitment to quality, reliability, and environmental responsibility 
                in everything we do.
              </p>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Our landscaping work"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-green-600 text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 fill-current" />
                  <div>
                    <div className="text-2xl font-bold">4.9</div>
                    <div className="text-sm">Customer Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Journey
            </h2>
            <p className="text-xl text-gray-600">
              Key milestones in our growth and commitment to excellence
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-green-200"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="relative z-10 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  <div className="w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  className="bg-white p-6 rounded-lg shadow-lg text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Work with Us?
            </h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who trust us with their landscaping needs. 
              Let's create something beautiful together.
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
                className="flex items-center justify-center space-x-2 border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span>Call Now</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};