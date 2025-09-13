import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowRight, Search } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
}

export const BlogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Spring Lawn Care: Essential Tips for a Healthy Green Lawn',
      excerpt: 'Discover the key steps to prepare your lawn for spring and ensure lush, healthy grass all season long.',
      content: 'Spring is the perfect time to give your lawn the attention it needs...',
      author: 'Mike Johnson',
      date: '2024-03-15',
      category: 'Lawn Care',
      image: 'https://images.pexels.com/photos/1453499/pexels-photo-1453499.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['spring', 'lawn care', 'maintenance', 'fertilizer']
    },
    {
      id: '2',
      title: 'Choosing the Right Plants for Your Climate Zone',
      excerpt: 'Learn how to select plants that will thrive in your specific climate and soil conditions.',
      content: 'Understanding your climate zone is crucial for successful landscaping...',
      author: 'Sarah Davis',
      date: '2024-03-10',
      category: 'Landscaping',
      image: 'https://images.pexels.com/photos/1080696/pexels-photo-1080696.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['plants', 'climate', 'landscaping', 'design']
    },
    {
      id: '3',
      title: 'Water-Efficient Irrigation Systems for Modern Gardens',
      excerpt: 'Explore smart irrigation solutions that save water while keeping your garden perfectly hydrated.',
      content: 'Modern irrigation technology offers numerous benefits...',
      author: 'Tom Wilson',
      date: '2024-03-05',
      category: 'Irrigation',
      image: 'https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['irrigation', 'water saving', 'smart systems', 'efficiency']
    },
    {
      id: '4',
      title: 'Creating Beautiful Outdoor Living Spaces',
      excerpt: 'Transform your backyard into an outdoor oasis with these design tips and ideas.',
      content: 'Outdoor living spaces have become increasingly popular...',
      author: 'Lisa Chen',
      date: '2024-02-28',
      category: 'Design',
      image: 'https://images.pexels.com/photos/1049298/pexels-photo-1049298.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['outdoor living', 'design', 'patio', 'entertainment']
    },
    {
      id: '5',
      title: 'Fall Cleanup: Preparing Your Yard for Winter',
      excerpt: 'Essential fall maintenance tasks to protect your landscape during the winter months.',
      content: 'Fall cleanup is crucial for maintaining a healthy landscape...',
      author: 'Mike Johnson',
      date: '2024-02-20',
      category: 'Maintenance',
      image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['fall cleanup', 'winter prep', 'maintenance', 'seasonal']
    },
    {
      id: '6',
      title: 'Sustainable Landscaping Practices for Eco-Friendly Gardens',
      excerpt: 'Learn how to create beautiful landscapes while protecting the environment.',
      content: 'Sustainable landscaping is more than just a trend...',
      author: 'Sarah Davis',
      date: '2024-02-15',
      category: 'Sustainability',
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      tags: ['sustainability', 'eco-friendly', 'native plants', 'conservation']
    }
  ];

  const categories = ['All', 'Lawn Care', 'Landscaping', 'Irrigation', 'Design', 'Maintenance', 'Sustainability'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Landscaping Tips & Insights</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Expert advice, seasonal tips, and industry insights to help you maintain 
            and enhance your outdoor spaces.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <motion.article
              key={post.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                  <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 font-medium">
                    <span>Read More</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center space-x-1 text-xs text-gray-500"
                      >
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles found matching your criteria.
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-green-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated with Landscaping Tips
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest landscaping tips, seasonal advice, 
            and exclusive offers delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button className="bg-white text-green-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors">
              Subscribe
            </button>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Need Professional Help?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Our expert team is ready to help you implement these tips and create 
            the landscape of your dreams.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors inline-block text-center"
            >
              Book a Consultation
            </Link>
            <a
              href="tel:+61422666104"
              className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
            >
              Call for Advice
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};