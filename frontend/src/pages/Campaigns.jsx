import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, Users, DollarSign, ArrowRight, Target, BookOpen, School, HandHeart } from 'lucide-react';
import { campaignAPI, isAuthenticated, getCurrentUser } from '../api/api.js';
import PaymentModal from '../components/PaymentModal.jsx';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const navigate = useNavigate();

  const [showDonationModal, setShowDonationModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');

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

  const getCampaignImage = (campaign) => {
    // If campaign has an image_url, use it
    if (campaign.image_url) {
      return campaign.image_url;
    }
    
    // Fallback to emojis for campaigns without images
    const images = {
      'Education': '📚',
      'Healthcare': '🏥',
      'Environment': '🌱',
      'Poverty': '🍲',
      'Children': '🌟',
      'Emergency': '🚨',
      'Community': '👥'
    };
    return images[campaign.category] || '❤️';
  };

  const handleDonateClick = (campaign) => {
    if (!isAuthenticated()) {
      alert('Please login or register to make a donation');
      navigate('/login');
      return;
    }
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const processDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    // Close donation modal and open payment modal
    setShowDonationModal(false);
    setShowPaymentModal(true);
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
    if (percentage >= 100) return 'bg-emerald-600';
    if (percentage >= 75) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-emerald-700">HopeForAll</Link>
          <nav className="hidden md:flex gap-8 text-sm text-gray-700">
            <Link to="/" className="hover:text-emerald-700 font-medium">Home</Link>
            <Link to="/about" className="hover:text-emerald-700 font-medium">About Us</Link>
            {isAuthenticated() && <Link to="/dashboard" className="hover:text-emerald-700 font-medium">Dashboard</Link>}
          </nav>
          <div className="flex items-center gap-4">
            {!isAuthenticated() ? (
              <>
                <Link to="/login" className="text-gray-600 hover:text-emerald-700 font-medium">Login</Link>
                <Link to="/register" className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition text-sm font-medium">
                  Register
                </Link>
              </>
            ) : (
              <Link to="/dashboard" className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition text-sm font-medium">
                My Dashboard
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 px-6 bg-emerald-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Discover Campaigns That Inspire Change
        </h1>
        <p className="text-lg mb-8 max-w-2xl mx-auto">
          Explore our active campaigns and find the perfect opportunity to make a meaningful impact in communities around the world.
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search campaigns by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Filters and Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">All Campaigns</h2>
              <p className="text-gray-600">
                {filteredAndSortedCampaigns.length} campaign{filteredAndSortedCampaigns.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 whitespace-nowrap">Category:</span>
                <select
                  value={activeFilter}
                  onChange={(e) => setActiveFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
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
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="most-funded">Most Funded</option>
                  <option value="progress">Progress</option>
                  <option value="goal">Goal Amount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-sm text-gray-600 whitespace-nowrap">Filter:</span>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                  activeFilter === cat.toLowerCase()
                    ? 'bg-emerald-700 text-white'
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
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-700"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        ) : (
          <>
            {filteredAndSortedCampaigns.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {filteredAndSortedCampaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg transition-shadow"
                  >
                    {/* Campaign Image */}
                    <div className="h-48 bg-gray-200 w-full overflow-hidden">
                      {campaign.image_url ? (
                        <img 
                          src={campaign.image_url} 
                          alt={campaign.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // If image fails to load, show fallback
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-full h-full bg-gray-200 flex items-center justify-center text-4xl';
                            fallback.textContent = getCampaignImage(campaign);
                            e.target.parentNode.appendChild(fallback);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">
                          {getCampaignImage(campaign)}
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6 flex-grow flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-xl text-gray-800">
                          {campaign.title}
                        </h3>
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
                          {campaign.category || 'General'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-6 flex-grow">
                        {campaign.description}
                      </p>
                      
                      {/* Progress Section */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Raised: ${(campaign.collected || 0).toLocaleString()}</span>
                          <span>Goal: ${campaign.goal.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getProgressColor(progressPercentage(campaign.collected || 0, campaign.goal))}`}
                            style={{ width: `${Math.min(progressPercentage(campaign.collected || 0, campaign.goal), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
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
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleDonateClick(campaign)}
                          className="flex-1 px-4 py-3 bg-emerald-700 text-white text-sm rounded-md hover:bg-emerald-800 transition flex items-center justify-center gap-2 font-medium"
                        >
                          <DollarSign size={16} />
                          Donate
                        </button>
                        <button 
                          onClick={() => handleVolunteerClick(campaign)}
                          className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 font-medium"
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
              <div className="text-center py-16">
                <Target className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No campaigns found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || activeFilter !== 'all' 
                    ? `We couldn't find any campaigns matching your criteria. Try adjusting your search or filters.`
                    : 'There are no active campaigns at the moment. Please check back later.'
                  }
                </p>
                {(searchTerm || activeFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setActiveFilter('all');
                    }}
                    className="px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA Section */}
        {!isAuthenticated() && (
          <div className="bg-emerald-800 text-white rounded-lg p-12 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h3>
            <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
              Join our community of changemakers and start supporting causes that matter to you. 
              Create an account to donate, volunteer, and track your impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-emerald-700 rounded-md hover:bg-gray-100 transition font-medium flex items-center justify-center gap-3 text-lg"
              >
                <Heart size={20} />
                Join HopeForAll
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 border-2 border-white text-white rounded-md hover:bg-white hover:text-emerald-800 transition font-medium"
              >
                Learn About Our Mission
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">HopeForAll</h3>
              <p className="text-sm text-gray-600">Educating children for a brighter future.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Get Involved</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/campaigns" className="hover:text-emerald-700">Donate</Link></li>
                <li><a href="#" className="hover:text-emerald-700">Volunteer</a></li>
                <li><Link to="/campaigns" className="hover:text-emerald-700">Our Campaigns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">About Us</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/about" className="hover:text-emerald-700">Our Mission</Link></li>
                <li><Link to="/about" className="hover:text-emerald-700">Our Impact</Link></li>
                <li><Link to="/about" className="hover:text-emerald-700">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-gray-800">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><a href="/supports" className="hover:text-emerald-700">Contact</a></li>
                <li><a href="/supports" className="hover:text-emerald-700">FAQ</a></li>
                <li><a href="/supports" className="hover:text-emerald-700">Privacy</a></li>
                <li><a href="/supports" className="hover:text-emerald-700">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} HopeForAll. All rights reserved.</p>
          </div>
        </div>
      </footer>

       {/* ADD Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Donate to {selectedCampaign.title}</h3>
            <p className="text-gray-600 mb-6">Your contribution makes a difference!</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount (₹)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter amount"
                min="1"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDonationModal(false);
                  setDonationAmount('');
                  setSelectedCampaign(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={processDonation}
                className="flex-1 px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition"
              >
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD Payment Modal */}
      {showPaymentModal && selectedCampaign && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedCampaign(null);
            setDonationAmount('');
          }}
          campaign={selectedCampaign}
          donationAmount={donationAmount}
          user={getCurrentUser()}
        />
      )}
    </div>
  );
};

export default Campaigns;