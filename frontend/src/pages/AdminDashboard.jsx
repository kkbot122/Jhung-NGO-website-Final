import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, DollarSign, BarChart3, LogOut, Plus, X, Calendar, Target, Trash2, Edit, Upload } from 'lucide-react';
import { adminAPI, campaignAPI, getCurrentUser, isAuthenticated } from '../api/api.js';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const [campaignToDelete, setCampaignToDelete] = useState(null);
  const [deletingCampaign, setDeletingCampaign] = useState(false);

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    description: '',
    goal: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    category: 'General'
  });
  const [campaignImage, setCampaignImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [creatingCampaign, setCreatingCampaign] = useState(false);

  const categories = [
    'General',
    'Education',
    'Healthcare',
    'Environment',
    'Poverty',
    'Children',
    'Emergency',
    'Community'
  ];

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchData();
    }
  }, [activeTab, user]);

  const checkAuth = () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    const currentUser = getCurrentUser();
    if (currentUser?.role !== 'admin') {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }

    setUser(currentUser);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching data for tab: ${activeTab}`);
      
      if (activeTab === 'overview') {
        // Fetch all data for overview
        const campaignsData = await campaignAPI.getCampaigns();
        setCampaigns(campaignsData);
        
        try {
          const donationsData = await adminAPI.getDonations();
          setDonations(donationsData);
        } catch (donationError) {
          console.error('Failed to fetch donations:', donationError);
          setDonations([]);
        }
        
        try {
          const volunteersData = await adminAPI.getVolunteerApplications();
          setVolunteers(volunteersData);
        } catch (volunteerError) {
          console.error('Failed to fetch volunteers:', volunteerError);
          setVolunteers([]);
        }
        
      } else if (activeTab === 'donations') {
        const donationsData = await adminAPI.getDonations();
        console.log('Donations received:', donationsData);
        setDonations(donationsData);
      } else if (activeTab === 'volunteers') {
        const volunteersData = await adminAPI.getVolunteerApplications();
        console.log('Volunteers received:', volunteersData);
        setVolunteers(volunteersData);
      } else if (activeTab === 'campaigns') {
        const campaignsData = await campaignAPI.getCampaigns();
        setCampaigns(campaignsData);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      alert('Failed to load data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (campaign) => {
  console.log('Delete button clicked for campaign:', campaign);
  console.log('Campaign ID:', campaign.id);
  setCampaignToDelete(campaign);
  setShowDeleteModal(true);
};

const handleDeleteCampaign = async () => {
  if (!campaignToDelete) {
    console.log('No campaign to delete');
    return;
  }

  console.log('Attempting to delete campaign with ID:', campaignToDelete.id);
  
  setDeletingCampaign(true);
  try {
    console.log('Calling campaignAPI.deleteCampaign...');
    const result = await campaignAPI.deleteCampaign(campaignToDelete.id);
    console.log('Delete API response:', result);
    
    alert('Campaign deleted successfully!');
    setShowDeleteModal(false);
    setCampaignToDelete(null);
    
    // Refresh campaigns data
    fetchData();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    console.error('Error message:', error.message);
    alert('Failed to delete campaign: ' + error.message);
  } finally {
    setDeletingCampaign(false);
  }
};

  // Add image preview handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCampaignImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateCampaign = async (e) => {
    e.preventDefault();
    setCreatingCampaign(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', campaignForm.title);
      formData.append('description', campaignForm.description);
      formData.append('goal', campaignForm.goal);
      formData.append('start_date', campaignForm.start_date);
      formData.append('category', campaignForm.category);

      if (campaignForm.end_date) {
        formData.append('end_date', campaignForm.end_date);
      }
      
      if (campaignImage) {
        formData.append('image', campaignImage);
      }

      await campaignAPI.createCampaign(formData);
      
      alert('Campaign created successfully!');
      setShowCreateModal(false);
      
      // Reset form
      setCampaignForm({
        title: '',
        description: '',
        goal: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: '',
        category: 'General'
      });
      setCampaignImage(null);
      setImagePreview(null);
      
      // Refresh campaigns data
      fetchData();
    } catch (error) {
      alert('Failed to create campaign: ' + error.message);
    } finally {
      setCreatingCampaign(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const calculateStats = () => {
    const totalDonations = donations?.reduce((sum, donation) => sum + parseFloat(donation.amount || 0), 0) || 0;
    const totalVolunteers = volunteers?.length || 0;
    const totalCampaigns = campaigns?.length || 0;
    const activeCampaigns = campaigns?.filter(campaign => 
      !campaign.end_date || new Date(campaign.end_date) > new Date()
    ).length || 0;
    
    return { totalDonations, totalVolunteers, totalCampaigns, activeCampaigns };
  };

  const { totalDonations, totalVolunteers, totalCampaigns, activeCampaigns } = calculateStats();

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-4">Access Denied</div>
          <p className="text-gray-600">Admin privileges required to access this page.</p>
        </div>
      </div>
    );
  }
  const handleUpdateVolunteerStatus = async (volunteerId, newStatus) => {
  try {
    await adminAPI.updateVolunteerStatus(volunteerId, newStatus);
    alert(`Volunteer application ${newStatus} successfully!`);
    
    // Refresh the data
    fetchData();
  } catch (error) {
    console.error('Failed to update volunteer status:', error);
    alert('Failed to update volunteer status: ' + error.message);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="text-2xl font-bold text-green-600 mr-8">Admin</div>
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'overview'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'campaigns'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Campaigns
                </button>
                <button
                  onClick={() => setActiveTab('donations')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'donations'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Donations
                </button>
                <button
                  onClick={() => setActiveTab('volunteers')}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'volunteers'
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Volunteers
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user.name || 'Admin'}</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                <span>New Campaign</span>
              </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Donations</dt>
                        <dd className="text-lg font-medium text-gray-900">₹{totalDonations.toLocaleString()}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Volunteers</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalVolunteers}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Campaigns</dt>
                        <dd className="text-lg font-medium text-gray-900">{totalCampaigns}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Active Campaigns</dt>
                        <dd className="text-lg font-medium text-gray-900">{activeCampaigns}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Donations */}
            <div className="bg-white shadow rounded-lg mb-8">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Donations</h3>
              </div>
              <div className="border-t border-gray-200">
                {donations && donations.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {donations.slice(0, 5).map((donation) => (
                      <li key={donation.id} className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Heart className="h-5 w-5 text-green-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {donation.users?.name || donation.user?.name || 'Anonymous'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {donation.campaigns?.title || donation.campaign?.title || 'General Campaign'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900">
                              ₹{parseFloat(donation.amount || 0).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(donation.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No donations yet
                  </div>
                )}
              </div>
            </div>

            {/* Recent Volunteers */}
            <div className="bg-white shadow rounded-lg">
  <div className="px-4 py-5 sm:px-6">
    <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Volunteer Applications</h3>
  </div>
  <div className="border-t border-gray-200">
    {volunteers && volunteers.length > 0 ? (
      <ul className="divide-y divide-gray-200">
        {volunteers.slice(0, 5).map((volunteer) => (
          <li key={volunteer.id} className="px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-sm font-medium text-gray-900">
                    {volunteer.users?.name || volunteer.user?.name || 'Volunteer'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {volunteer.campaigns?.title || volunteer.campaign?.title || 'General Campaign'}
                  </div>
                  <div className="text-sm text-gray-500 mt-1 max-w-md truncate">
                    {volunteer.message}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  volunteer.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : volunteer.status === 'rejected'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {volunteer.status || 'Pending'}
                </span>
                <div className="text-sm text-gray-500 mt-1">
                  {new Date(volunteer.applied_at || volunteer.created_at).toLocaleDateString()}
                </div>
                <div className="flex space-x-1 mt-2">
                  {volunteer.status !== 'approved' && (
                    <button
                      onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'approved')}
                      className="text-xs text-green-600 hover:text-green-800"
                    >
                      Approve
                    </button>
                  )}
                  {volunteer.status !== 'rejected' && (
                    <button
                      onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'rejected')}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Reject
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="px-4 py-8 text-center text-gray-500">
        No volunteer applications yet
      </div>
    )}
  </div>
</div>
          </div>
        )}

        {/* Campaigns Tab */}
        {activeTab === 'campaigns' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Campaign Management</h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Plus size={20} />
                <span>New Campaign</span>
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-8">Loading campaigns...</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Goal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Raised
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {campaigns && campaigns.map((campaign) => (
                      <tr key={campaign.id}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{campaign.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{campaign.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {campaign.category || 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{campaign.goal?.toLocaleString() || '0'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{(campaign.collected || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            !campaign.end_date || new Date(campaign.end_date) > new Date() 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {!campaign.end_date || new Date(campaign.end_date) > new Date() ? 'Active' : 'Ended'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(campaign.created_at).toLocaleDateString()}
                        </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDeleteClick(campaign)}
                              className="text-red-600 hover:text-red-900 transition-colors"
                              title="Delete Campaign"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {(!campaigns || campaigns.length === 0) && (
                  <div className="px-6 py-12 text-center text-gray-500">
                    <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-500 mb-4">Create your first campaign to get started.</p>
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Create Campaign
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Donations Tab */}
        {activeTab === 'donations' && (
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">All Donations</h1>
            
            {loading ? (
              <div className="text-center py-8">Loading donations...</div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Campaign
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Note
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {donations && donations.map((donation) => (
                      <tr key={donation.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {donation.users?.name || donation.user?.name || 'Anonymous'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {donation.users?.email || donation.user?.email || 'No email'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {donation.campaigns?.title || donation.campaign?.title || 'Unknown Campaign'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-green-600">
                            ₹{parseFloat(donation.amount || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {donation.note || 'No note'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {(!donations || donations.length === 0) && (
                  <div className="px-6 py-12 text-center text-gray-500">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No donations found</h3>
                    <p className="text-gray-500">Donations will appear here once users start donating to campaigns.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === 'volunteers' && (
  <div className="px-4 py-6 sm:px-0">
    <h1 className="text-2xl font-bold text-gray-900 mb-6">Volunteer Applications</h1>
    
    {loading ? (
      <div className="text-center py-8">Loading volunteers...</div>
    ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Volunteer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {volunteers && volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {volunteer.users?.name || volunteer.user?.name || 'Volunteer'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {volunteer.users?.email || volunteer.user?.email || 'No email'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {volunteer.users?.mobile || volunteer.user?.mobile || 'No phone'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {volunteer.campaigns?.title || volunteer.campaign?.title || 'Unknown Campaign'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 max-w-xs">
                    {volunteer.message || 'No message'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(volunteer.applied_at || volunteer.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    volunteer.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : volunteer.status === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {volunteer.status || 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    {volunteer.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'approved')}
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="Approve Volunteer"
                      >
                        Approve
                      </button>
                    )}
                    {volunteer.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'rejected')}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Reject Volunteer"
                      >
                        Reject
                      </button>
                    )}
                    {volunteer.status !== 'pending' && (
                      <button
                        onClick={() => handleUpdateVolunteerStatus(volunteer.id, 'pending')}
                        className="text-yellow-600 hover:text-yellow-900 transition-colors"
                        title="Set to Pending"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {(!volunteers || volunteers.length === 0) && (
          <div className="px-6 py-12 text-center text-gray-500">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No volunteer applications found</h3>
            <p className="text-gray-500">Volunteer applications will appear here once users apply to volunteer.</p>
          </div>
        )}
      </div>
    )}
  </div>
)}
      </main>

      {/* Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Create New Campaign</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setImagePreview(null);
                  setCampaignImage(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setCampaignImage(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                    )}
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  required
                  value={campaignForm.title}
                  onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter campaign title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={campaignForm.description}
                  onChange={(e) => setCampaignForm({...campaignForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Describe the campaign and its goals"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Goal Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={campaignForm.goal}
                    onChange={(e) => setCampaignForm({...campaignForm, goal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={campaignForm.category}
                    onChange={(e) => setCampaignForm({...campaignForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={campaignForm.start_date}
                    onChange={(e) => setCampaignForm({...campaignForm, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={campaignForm.end_date}
                    onChange={(e) => setCampaignForm({...campaignForm, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingCampaign}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingCampaign ? 'Creating...' : 'Create Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Campaign Modal */}
      {showDeleteModal && campaignToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Delete Campaign</h3>
            </div>
            
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete the campaign "<strong>{campaignToDelete.title}</strong>"? 
              This action cannot be undone and all associated data will be permanently removed.
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <div className="text-red-600 mr-2">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-red-800 text-sm font-medium">
                  Warning: This action is irreversible!
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setCampaignToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                disabled={deletingCampaign}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCampaign}
                disabled={deletingCampaign}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {deletingCampaign ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;