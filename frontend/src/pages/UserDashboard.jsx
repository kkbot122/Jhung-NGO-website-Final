import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Users, DollarSign, BookOpen, HandHeart, School, Plus } from 'lucide-react';
import { campaignAPI, userAPI, donationAPI, volunteerAPI, getCurrentUser, isAuthenticated } from '../api/api.js';


// Helper component for consistent styling
const StatCard = ({ icon: Icon, label, value, color = "emerald" }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
    <div className={`bg-${color}-100 text-${color}-600 p-3 rounded-full inline-flex mb-4`}>
      <Icon size={24} />
    </div>
    <div className="text-2xl font-bold text-gray-800 mb-1">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [myDonations, setMyDonations] = useState([]);
  const [myVolunteerApplications, setMyVolunteerApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [volunteerMessage, setVolunteerMessage] = useState('');
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [activeTab, user]);

  const checkAuth = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'campaigns') {
        const campaignsData = await campaignAPI.getCampaigns();
        setCampaigns(campaignsData);
      } else if (activeTab === 'donations') {
        const donationsData = await userAPI.getUserDonations();
        setMyDonations(donationsData);
      } else if (activeTab === 'volunteering') {
        const volunteerData = await userAPI.getUserVolunteerApplications();
        setMyVolunteerApplications(volunteerData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = (campaign) => {
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
      fetchData();
    } catch (error) {
      alert('Donation failed: ' + error.message);
    }
  };

  const handleVolunteer = (campaign) => {
    setSelectedCampaign(campaign);
    setShowVolunteerModal(true);
  };

  const processVolunteerApplication = async () => {
    if (!volunteerMessage.trim()) {
      alert('Please enter a message about why you want to volunteer');
      return;
    }

    try {
      await volunteerAPI.applyVolunteer({
        campaign_id: selectedCampaign.id,
        message: volunteerMessage
      });
      
      alert('Volunteer application submitted successfully!');
      setShowVolunteerModal(false);
      setVolunteerMessage('');
      setSelectedCampaign(null);
      fetchData();
    } catch (error) {
      alert('Volunteer application failed: ' + error.message);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getTotalDonated = () => {
    return myDonations.reduce((total, donation) => total + parseFloat(donation.amount), 0);
  };

  const getTotalCampaignsSupported = () => {
    const uniqueCampaigns = new Set(myDonations.map(donation => donation.campaign_id));
    return uniqueCampaigns.size;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-700 mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-emerald-700">HopeForAll</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">Welcome, {user.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user.name || 'Valued Supporter'}!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for being part of our mission to create positive change through education.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={Heart} 
            label="Total Donated" 
            value={`$${getTotalDonated().toLocaleString()}`}
            color="emerald"
          />
          <StatCard 
            icon={BookOpen} 
            label="Campaigns Supported" 
            value={getTotalCampaignsSupported()}
            color="blue"
          />
          <StatCard 
            icon={Users} 
            label="Volunteer Applications" 
            value={myVolunteerApplications.length}
            color="purple"
          />
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('campaigns')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'campaigns'
                    ? 'border-emerald-700 text-emerald-700 bg-emerald-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                Ongoing Campaigns
              </button>
              <button
                onClick={() => setActiveTab('donations')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'donations'
                    ? 'border-emerald-700 text-emerald-700 bg-emerald-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                My Donations
              </button>
              <button
                onClick={() => setActiveTab('volunteering')}
                className={`px-6 py-4 font-medium text-sm border-b-2 transition-colors ${
                  activeTab === 'volunteering'
                    ? 'border-emerald-700 text-emerald-700 bg-emerald-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                My Volunteering
              </button>
            </nav>
          </div>

          {/* Tab Panels */}
          <div className="p-6">
            {/* Campaigns Tab */}
            {activeTab === 'campaigns' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Ongoing Campaigns</h2>
                  <p className="text-gray-600">Support our current initiatives and make a difference</p>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-600">Loading campaigns...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => (
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
                          <h3 className="font-bold text-lg mb-2 text-gray-800">{campaign.title}</h3>
                          <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mb-4 self-start">
                            {campaign.category || 'General'}
                          </span>
                          <p className="text-gray-600 text-sm mb-4 flex-grow">{campaign.description}</p>
                          
                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Raised: ${(campaign.collected || 0).toLocaleString()}</span>
                              <span>Goal: ${campaign.goal.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-emerald-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(progressPercentage(campaign.collected || 0, campaign.goal), 100)}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-600">
                              {Math.round(progressPercentage(campaign.collected || 0, campaign.goal))}% funded
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleDonate(campaign)}
                              className="flex-1 px-4 py-2 bg-emerald-700 text-white text-sm rounded-md hover:bg-emerald-800 transition flex items-center justify-center gap-1"
                            >
                              <DollarSign size={16} />
                              Donate
                            </button>
                            <button 
                              onClick={() => handleVolunteer(campaign)}
                              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-1"
                            >
                              <Users size={16} />
                              Volunteer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!loading && campaigns.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">No ongoing campaigns at the moment.</p>
                  </div>
                )}
              </div>
            )}

            {/* My Donations Tab */}
            {activeTab === 'donations' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">My Donations</h2>
                  <p className="text-gray-600">Your generous contributions making a difference</p>
                  
                  {/* Total Donated Summary */}
                  {myDonations.length > 0 && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-800">Total Impact</h3>
                          <p className="text-emerald-600">Thank you for your incredible support!</p>
                        </div>
                        <div className="text-3xl font-bold text-emerald-700">
                          ${getTotalDonated().toLocaleString()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-600">Loading donations...</div>
                ) : (
                  <div className="space-y-4">
                    {myDonations.length > 0 ? (
                      myDonations.map((donation) => (
                        <div key={donation.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-emerald-100 p-3 rounded-full mr-4">
                                <Heart className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div>
                                <div className="font-semibold text-gray-900">
                                  Donation to {donation.campaigns?.title || 'Campaign'}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  {donation.note || 'Thank you for your support!'}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(donation.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-700">
                                ${parseFloat(donation.amount).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No donations yet</h3>
                        <p className="text-gray-600 mb-6">Your donations will appear here once you start supporting campaigns.</p>
                        <button
                          onClick={() => setActiveTab('campaigns')}
                          className="px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium"
                        >
                          Browse Campaigns
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* My Volunteering Tab */}
            {activeTab === 'volunteering' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">My Volunteer Applications</h2>
                  <p className="text-gray-600">Your applications to volunteer for various campaigns</p>
                </div>

                {loading ? (
                  <div className="text-center py-8 text-gray-600">Loading applications...</div>
                ) : (
                  <div className="space-y-4">
                    {myVolunteerApplications.length > 0 ? (
                      myVolunteerApplications.map((application) => (
                        <div key={application.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-3 rounded-full mr-4">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-semibold text-gray-900">
                                  Volunteer for {application.campaigns?.title || 'Campaign'}
                                </div>
                                <div className="text-sm text-gray-600 mt-1 max-w-md">
                                  {application.message}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Applied on {new Date(application.applied_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 text-sm rounded-full font-medium ${
                                application.status === 'approved' 
                                  ? 'bg-green-100 text-green-800'
                                  : application.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {application.status?.charAt(0).toUpperCase() + application.status?.slice(1) || 'Pending'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">No volunteer applications yet</h3>
                        <p className="text-gray-600 mb-6">Your volunteer applications will appear here once you apply.</p>
                        <button
                          onClick={() => setActiveTab('campaigns')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                        >
                          Browse Campaigns
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Donation Modal */}
      {showDonationModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Donate to {selectedCampaign.title}</h3>
            <p className="text-gray-600 mb-6">Your contribution makes a difference!</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Amount ($)
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
                Donate Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Modal */}
      {showVolunteerModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Volunteer for {selectedCampaign.title}</h3>
            <p className="text-gray-600 mb-6">Tell us about your interest and skills</p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why do you want to volunteer for this campaign?
              </label>
              <textarea
                value={volunteerMessage}
                onChange={(e) => setVolunteerMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about your interest and skills..."
                rows="4"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowVolunteerModal(false);
                  setVolunteerMessage('');
                  setSelectedCampaign(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={processVolunteerApplication}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Apply to Volunteer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;