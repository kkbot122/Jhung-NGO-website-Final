import { useState, useEffect } from 'react';
import { Search, Heart, Users, Target, ArrowRight } from 'lucide-react';
import { campaignAPI, authAPI, donationAPI, volunteerAPI, isAuthenticated, getCurrentUser } from '../api/api.js';
import { Link } from 'react-router-dom';

const Home = () => {
  const [email, setEmail] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

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

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesFilter = activeFilter === 'all' || 
      campaign.category?.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSubscribe = () => {
    if (email && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 2000);
    }
  };

  const handleDonate = async (campaign) => {
    if (!isAuthenticated()) {
      alert('Please login to donate');
      return;
    }
    
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const processDonation = async () => {
    if (!donationAmount || donationAmount <= 0) {
      alert('Please enter a valid donation amount');
      return;
    }

    try {
      await donationAPI.createDonation({
        campaign_id: selectedCampaign.id,
        amount: parseFloat(donationAmount),
        note: `Donation for ${selectedCampaign.title}`
      });
      
      alert('Donation successful! Thank you for your support.');
      setShowDonationModal(false);
      setDonationAmount('');
      setSelectedCampaign(null);
      // Refresh campaigns to update collected amounts
      fetchCampaigns();
    } catch (error) {
      alert('Donation failed: ' + error.message);
    }
  };

  const handleVolunteerSignup = async () => {
    if (!isAuthenticated()) {
      alert('Please login to become a volunteer');
      return;
    }

    try {
      // For now, using the first campaign as default
      // You might want to create a general campaign for volunteers
      const generalCampaign = campaigns[0];
      if (generalCampaign) {
        await volunteerAPI.applyVolunteer({
          campaign_id: generalCampaign.id,
          message: 'I want to volunteer for various campaigns'
        });
      }
      
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    } catch (error) {
      alert('Volunteer application failed: ' + error.message);
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-green-600">HopeForAll</div>
          <nav className="flex gap-8 text-sm text-gray-600">
  <Link to="/campaigns" className="hover:text-green-600 font-medium">Campaigns</Link>
  <Link to="/about" className="hover:text-green-600 font-medium">About</Link>
  
  {isAuthenticated() && getCurrentUser()?.role === 'admin' && (
    <Link to="/admin" className="hover:text-green-600 font-medium">Admin</Link>
  )}
  
  {!isAuthenticated() ? (
    <>
      <Link to="/register" className="hover:text-green-600 font-medium">Register</Link>
      <Link to="/login" className="hover:text-green-600 font-medium">Login</Link>
    </>
  ) : (
    <div className="flex gap-4">
      <Link to="/dashboard" className="hover:text-green-600 font-medium">My Dashboard</Link>
      <button 
        onClick={() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/';
        }}
        className="hover:text-green-600 font-medium"
      >
        Logout
      </button>
    </div>
  )}
</nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6 text-gray-800">Make a Difference Today</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join us in creating positive change. Your support helps transform lives and build better communities.
        </p>
        <div className="flex gap-4 justify-center mb-8">
          <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2">
            <Heart size={20} />
            Donate Now
          </button>
          <button className="px-8 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-medium flex items-center gap-2">
            <Users size={20} />
            Become Volunteer
          </button>
        </div>
        <div className="flex justify-center gap-12 text-center">
          <div>
            <div className="text-3xl font-bold text-green-600">50K+</div>
            <div className="text-gray-600">Lives Impacted</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">120+</div>
            <div className="text-gray-600">Projects Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">35+</div>
            <div className="text-gray-600">Communities Served</div>
          </div>
        </div>
      </section>

      {/* Campaigns Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Featured Campaigns</h2>
          <p className="text-xl text-gray-600">Support our ongoing initiatives and make an impact</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Filter by:</span>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                activeFilter === cat.toLowerCase()
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="mb-12">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Loading campaigns...</p>
          </div>
        )}

        {/* Campaigns Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {filteredCampaigns.map(campaign => (
                <div
                  key={campaign.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                >
                  <div className="p-6">
                    <div className="text-4xl mb-4 text-center">
                      {getCampaignImage(campaign.category)}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-center text-gray-800">{campaign.title}</h3>
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
                      {campaign.category || 'General'}
                    </span>
                    <p className="text-gray-600 text-sm mb-4 text-center">{campaign.description}</p>
                    
                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Raised: ${(campaign.collected || 0).toLocaleString()}</span>
                        <span>Goal: ${campaign.goal.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${Math.min(progressPercentage(campaign.collected || 0, campaign.goal), 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        {Math.round(progressPercentage(campaign.collected || 0, campaign.goal))}% funded
                      </span>
                      <button 
                        onClick={() => handleDonate(campaign)}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center gap-1"
                      >
                        Donate <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No campaigns found matching your criteria.</p>
              </div>
            )}
          </>
        )}

        <Link 
    to="/campaigns"
    className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium mb-8 flex items-center justify-center"
    >
    View All Campaigns →
    </Link>
      </section>

      {/* Volunteer CTA */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Users className="mx-auto mb-4 text-green-600" size={48} />
          <h2 className="text-4xl font-bold mb-4 text-gray-800">Join Our Volunteer Team</h2>
          <p className="text-xl text-gray-600 mb-8">
            Your time and skills can create lasting change. Become part of our community of changemakers.
          </p>
          <div className="flex gap-3 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleVolunteerSignup()}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleVolunteerSignup}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
            >
              {subscribed ? '✓ Applied' : 'Join Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-xl text-gray-300">Together, we're making a real difference</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">$2.5M+</div>
              <div className="text-gray-300">Funds Raised</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">5,000+</div>
              <div className="text-gray-300">Volunteers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">120+</div>
              <div className="text-gray-300">Projects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">35+</div>
              <div className="text-gray-300">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Donate to {selectedCampaign.title}</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($)
              </label>
              <input
                type="number"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12">
            <div className="text-2xl font-bold text-green-600 mb-8">HopeForAll</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-4 text-gray-800">Get Involved</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/register" className="hover:text-green-600">Donate</a></li>
                  <li><a href="/register" className="hover:text-green-600">Volunteer</a></li>
                  <li><a href="/campaigns" className="hover:text-green-600">Campaigns</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-800">About Us</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/about" className="hover:text-green-600">Our Story</a></li>
                  <li><a href="/about" className="hover:text-green-600">Our Team</a></li>
                  <li><a href="/about" className="hover:text-green-600">Impact</a></li>
                  <li><a href="/about" className="hover:text-green-600">Partners</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-800">Campaigns</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/campaigns" className="hover:text-green-600">Education</a></li>
                  <li><a href="/campaigns" className="hover:text-green-600">Healthcare</a></li>
                  <li><a href="/campaigns"  className="hover:text-green-600">Environment</a></li>
                  <li><a href="/campaigns" className="hover:text-green-600">Emergency Relief</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4 text-gray-800">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><a href="/supports" className="hover:text-green-600">Contact</a></li>
                  <li><a href="/supports" className="hover:text-green-600">FAQ</a></li>
                  <li><a href="/supports" className="hover:text-green-600">Privacy</a></li>
                  <li><a href="/supports" className="hover:text-green-600">Terms</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 HopeForAll NGO. All rights reserved. Made with ❤️ for a better world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;