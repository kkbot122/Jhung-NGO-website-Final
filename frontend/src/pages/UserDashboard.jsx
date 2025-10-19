import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Users, Target, Clock, DollarSign, ArrowRight } from 'lucide-react';
import { campaignAPI, userAPI, donationAPI, volunteerAPI, getCurrentUser, isAuthenticated } from '../api/api.js';

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
        // Use real backend data
        const donationsData = await userAPI.getUserDonations();
        setMyDonations(donationsData);
      } else if (activeTab === 'volunteering') {
        // Use real backend data
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
      fetchData(); // Refresh data
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
      fetchData(); // Refresh data
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const getTotalDonated = () => {
    return myDonations.reduce((total, donation) => total + parseFloat(donation.amount), 0);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600 mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600 mr-8">HopeForAll</div>
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'campaigns'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Ongoing Campaigns
                </button>
                <button
                  onClick={() => setActiveTab('donations')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'donations'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Donations
                </button>
                <button
                  onClick={() => setActiveTab('volunteering')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'volunteering'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  My Volunteering
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name || 'User'}</span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name || 'Valued Supporter'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Thank you for being part of our mission to create positive change.
          </p>
        </div>

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="px-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Ongoing Campaigns</h2>
              <p className="text-gray-600">Support our current initiatives and make a difference</p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading campaigns...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map(campaign => (
                  <div
                    key={campaign.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="text-4xl mb-4 text-center">
                        {getCampaignImage(campaign.category)}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 text-center text-gray-800">
                        {campaign.title}
                      </h3>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-3">
                        {campaign.category || 'General'}
                      </span>
                      <p className="text-gray-600 text-sm mb-4 text-center">
                        {campaign.description}
                      </p>
                      
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

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600">
                          {Math.round(progressPercentage(campaign.collected || 0, campaign.goal))}% funded
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleDonate(campaign)}
                          className="flex-1 px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-1"
                        >
                          <DollarSign size={16} />
                          Donate
                        </button>
                        <button 
                          onClick={() => handleVolunteer(campaign)}
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
          <div className="px-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Donations</h2>
              <p className="text-gray-600">Your generous contributions making a difference</p>
              
              {/* Total Donated Summary */}
              {myDonations.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-green-800">Total Donated</h3>
                      <p className="text-green-600">Thank you for your support!</p>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      ${getTotalDonated().toLocaleString()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-8">Loading donations...</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {myDonations.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {myDonations.map((donation) => (
                      <div key={donation.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Heart className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Donation to {donation.campaigns?.title || 'Campaign'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {donation.note || 'Thank you for your support!'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              ${parseFloat(donation.amount).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No donations yet</h3>
                    <p className="text-gray-500 mb-4">Your donations will appear here once you start supporting campaigns.</p>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
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
          <div className="px-4">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Volunteer Applications</h2>
              <p className="text-gray-600">Your applications to volunteer for various campaigns</p>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading applications...</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {myVolunteerApplications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {myVolunteerApplications.map((application) => (
                      <div key={application.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                Volunteer for {application.campaigns?.title || 'Campaign'}
                              </div>
                              <div className="text-sm text-gray-500 max-w-md">
                                {application.message}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              application.status === 'approved' 
                                ? 'bg-green-100 text-green-800'
                                : application.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {application.status || 'Pending'}
                            </span>
                            <div className="text-sm text-gray-500 mt-1">
                              {new Date(application.applied_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteer applications yet</h3>
                    <p className="text-gray-500 mb-4">Your volunteer applications will appear here once you apply.</p>
                    <button
                      onClick={() => setActiveTab('campaigns')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Browse Campaigns
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

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

      {/* Volunteer Modal */}
      {showVolunteerModal && selectedCampaign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Volunteer for {selectedCampaign.title}</h3>
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