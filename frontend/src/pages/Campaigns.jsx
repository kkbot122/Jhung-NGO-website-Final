import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Users, DollarSign, ArrowRight, Target } from 'lucide-react';
import { campaignAPI, isAuthenticated, getCurrentUser } from '../api/api.js';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  const categories = [
    'All',
    'Education',
    'Healthcare',
    'Environment',
    'Poverty',
    'Children',
    'Emergency',
    'Community'
  ];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const data = await campaignAPI.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (raised, goal) => (raised / goal) * 100;

  const getCampaignImage = (category) => {
    const images = {
      'Education': '📚',
      'Healthcare': '🏥',
      'Environment': '🌱',
      'Poverty': '🍲',
      'Children': '🌟',
      'Emergency': '🚨',
      'Community': '👥'
    };
    return images[category] || '❤️';
  };

  const handleDonateClick = (campaign) => {
    if (!isAuthenticated()) {
      alert('Please login or register to make a donation');
      navigate('/login');
      return;
    }
    navigate('/dashboard');
  };

  const handleVolunteerClick = (campaign) => {
    if (!isAuthenticated()) {
      alert('Please login or register to volunteer');
      navigate('/login');
      return;
    }
    navigate('/dashboard');
  };

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = campaigns
    .filter(campaign => {
      const matchesCategory = activeFilter === 'all' || 
        (campaign.category || 'General').toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at) - new Date(a.created_at);
        case 'most-funded':
          return (b.collected || 0) - (a.collected || 0);
        case 'goal':
          return b.goal - a.goal;
        case 'progress':
          return progressPercentage(b.collected || 0, b.goal) - progressPercentage(a.collected || 0, a.goal);
        default:
          return 0;
      }
    });

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-green-600 mr-8">HopeForAll</Link>
              <nav className="flex space-x-8">
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated() ? (
                <>
                  <Link to="/login" className="text-gray-500 hover:text-gray-700 font-medium">Login</Link>
                  <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                    Get Started
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                  My Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Make a Difference</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Discover campaigns that need your support
          </p>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Filters and Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Campaigns</h2>
              <p className="text-gray-600">
                {filteredAndSortedCampaigns.length} campaign{filteredAndSortedCampaigns.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="most-funded">Most Funded</option>
                  <option value="progress">Progress</option>
                  <option value="goal">Goal Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                  activeFilter === cat.toLowerCase()
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        ) : (
          <>
            {filteredAndSortedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredAndSortedCampaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-4xl">
                          {getCampaignImage(campaign.category)}
                        </div>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {campaign.category || 'General'}
                        </span>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 text-gray-800">
                        {campaign.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {campaign.description}
                      </p>
                      
                      {/* Progress Section */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>${(campaign.collected || 0).toLocaleString()} raised</span>
                          <span>${campaign.goal.toLocaleString()} goal</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(progressPercentage(campaign.collected || 0, campaign.goal))}`}
                            style={{ width: `${Math.min(progressPercentage(campaign.collected || 0, campaign.goal), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>{Math.round(progressPercentage(campaign.collected || 0, campaign.goal))}% funded</span>
                          <span>
                            {campaign.end_date 
                              ? `${Math.ceil((new Date(campaign.end_date) - new Date()) / (1000 * 60 * 60 * 24))} days left`
                              : 'Ongoing'
                            }
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDonateClick(campaign)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                        >
                          <DollarSign size={16} />
                          Donate
                        </button>
                        <button 
                          onClick={() => handleVolunteerClick(campaign)}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-1"
                        >
                          <Users size={16} />
                          Volunteer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || activeFilter !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'There are no active campaigns at the moment'
                  }
                </p>
                {(searchTerm || activeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        {!isAuthenticated() && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Make a Difference?</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of supporters who are creating positive change in communities around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                Get Started
              </Link>
              <Link
                to="/about"
                className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="text-2xl font-bold text-green-600 mb-4">HopeForAll</div>
            <p className="text-gray-600 max-w-md">
              Creating positive change through community support and collective action.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2024 HopeForAll NGO. All rights reserved. Made with ❤️ for a better world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Campaigns;