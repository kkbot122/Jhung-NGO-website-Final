const API_BASE_URL = 'http://localhost:5000'; // Adjust port as needed

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  const isFormData = options.body instanceof FormData;
  
  const config = {
    headers: {
      // 'Content-Type': 'application/json',
      ...(!isFormData && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  if (config.body && !isFormData) {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// // Campaign API
// export const campaignAPI = {
//   getCampaigns: () => apiCall('/campaigns'),
//   getCampaign: (id) => apiCall(`/campaigns/${id}`),
// };

// Auth API
export const authAPI = {
  register: (userData) => apiCall('/auth/register', { method: 'POST', body: userData }),
  login: (credentials) => apiCall('/auth/login', { method: 'POST', body: credentials }),
};

// Update the existing API calls to use the new endpoints
export const donationAPI = {
  createDonation: (donationData) => apiCall('/donations', { method: 'POST', body: donationData }),
  getUserDonations: () => userAPI.getUserDonations(), // Alias for convenience
};


// Volunteer API
export const volunteerAPI = {
  applyVolunteer: (applicationData) => apiCall('/volunteers/apply', { method: 'POST', body: applicationData }),
  getUserApplications: () => userAPI.getUserVolunteerApplications(), // Alias for convenience
  updateStatus: (volunteerId, status) => apiCall(`/volunteers/${volunteerId}/status`, { 
    method: 'PATCH', 
    body: { status } 
  }),
  getApplication: (volunteerId) => apiCall(`/volunteers/${volunteerId}`),
};

// Utility to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Utility to get current user
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch {
    return null;
  }
};

export const adminAPI = {
  getDonations: () => apiCall('/donations'),
  getVolunteerApplications: () => apiCall('/volunteers/applications'),
  getUsers: () => apiCall('/admin/users'), // You might want to create this endpoint
  updateVolunteerStatus: (volunteerId, status) => volunteerAPI.updateStatus(volunteerId, status),
};

// User-specific API
export const userAPI = {
  getUserDonations: () => apiCall('/donations/my-donations'),
  getUserVolunteerApplications: () => apiCall('/volunteers/my-applications'),
  getUserProfile: () => apiCall('/user/profile'),
};

// Campaign API
export const campaignAPI = {
  getCampaigns: () => apiCall('/campaigns'),
  getCampaign: (id) => apiCall(`/campaigns/${id}`),
  createCampaign: (campaignData) => {
    // If it's FormData, use as-is, otherwise stringify
    if (campaignData instanceof FormData) {
      return apiCall('/campaigns', { 
        method: 'POST', 
        body: campaignData 
      });
    } else {
      return apiCall('/campaigns', { 
        method: 'POST', 
        body: campaignData 
      });
    }
  },
  deleteCampaign: (campaignId) => apiCall(`/campaigns/${campaignId}`, { method: 'DELETE' }),
};

// Contact API
export const contactAPI = {
  sendContactMessage: (messageData) => apiCall('/api/contact', { 
    method: 'POST', 
    body: messageData 
  }),
};


export default apiCall;