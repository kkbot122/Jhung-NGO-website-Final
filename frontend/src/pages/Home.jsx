import { useState, useEffect } from 'react';
import { Search, Heart, Users, ArrowRight, BookOpen, HandHeart, School, Plus } from 'lucide-react';
import { campaignAPI, isAuthenticated, getCurrentUser, donationAPI } from '../api/api.js'; // Assuming all APIs are in one file
import { Link } from 'react-router-dom';

// Helper component for FAQ items
const FaqItem = ({ question, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 py-4">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left text-gray-800">
        <span className="font-medium">{question}</span>
        <Plus className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} size={20} />
      </button>
      {isOpen && (
        <div className="mt-4 text-gray-600">
          {children}
        </div>
      )}
    </div>
  );
};

const Home = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // A smaller, featured set of campaigns for the home page
  const featuredCampaigns = campaigns.slice(0, 3);

  useEffect(() => {
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
    fetchCampaigns();
  }, []);
  
  const handleDonateClick = (campaign) => {
    if (!isAuthenticated()) {
      alert('Please log in to donate.');
      // You might want to redirect to login page here
      return;
    }
    setSelectedCampaign(campaign);
    setShowDonationModal(true);
  };

  const processDonation = async () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount.');
      return;
    }
    try {
      await donationAPI.createDonation({
        campaign_id: selectedCampaign.id,
        amount: parseFloat(donationAmount),
        note: `Donation for ${selectedCampaign.title}`
      });
      alert('Thank you for your generous donation!');
      setShowDonationModal(false);
      setDonationAmount('');
      setSelectedCampaign(null);
      // Optionally, refetch campaigns to show updated amounts
    } catch (error) {
      alert('Donation failed: ' + (error.message || 'Please try again.'));
    }
  };
  
  const progressPercentage = (raised, goal) => (raised / goal) * 100;

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-emerald-700">HopeForAll</Link>
          <nav className="hidden md:flex gap-8 text-sm text-gray-700">
            <Link to="/campaigns" className="hover:text-emerald-700 font-medium">Campaigns</Link>
            <Link to="/about" className="hover:text-emerald-700 font-medium">About Us</Link>
            {isAuthenticated() && <Link to="/dashboard" className="hover:text-emerald-700 font-medium">Dashboard</Link>}
          </nav>
          <div className="flex items-center gap-4">
            {!isAuthenticated() ? (
              <Link to="/register" className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition text-sm font-medium">
                Register
              </Link>
            ) : (
               <button 
                 onClick={() => handleDonateClick(campaigns[0])} // Triggers general donation
                 className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition text-sm font-medium"
               >
                 Donate
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 px-6 bg-gray-50">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-gray-800">
          Give the gift of learning
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          Your help provides children with books, supplies, and safe classrooms. Join us in our mission to ensure that every child has the opportunity to succeed.
        </p>
        <button 
          onClick={() => handleDonateClick(campaigns[0])} // Donate to a general fund or first campaign
          className="px-8 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium"
        >
          Donate Now
        </button>
        {/* Image placeholders and stats */}
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-left">
            <div className="h-40 bg-gray-200 rounded-lg flex items-end p-4">
                <div className="bg-white p-2 rounded">
                    <p className="font-bold text-xl text-emerald-700">1 Million+</p>
                    <p className="text-sm text-gray-600">Smiles Reached</p>
                </div>
            </div>
             {/* Placeholder for an image */}
            <div className="h-40 bg-gray-300 rounded-lg row-span-2"></div>
            <div className="h-40 bg-gray-200 rounded-lg flex items-end p-4">
                 <div className="bg-white p-2 rounded">
                    <p className="font-bold text-xl text-emerald-700">5,000+</p>
                    <p className="text-sm text-gray-600">Volunteers</p>
                </div>
            </div>
             {/* Placeholder for an image */}
            <div className="h-40 bg-gray-300 rounded-lg"></div>
            <div className="h-40 bg-gray-300 rounded-lg col-start-1"></div>
            {/* Placeholder for an image */}
            <div className="h-40 bg-gray-200 rounded-lg flex items-end p-4">
                <div className="bg-white p-2 rounded">
                    <p className="font-bold text-xl text-emerald-700">150+</p>
                    <p className="text-sm text-gray-600">Schools Supported</p>
                </div>
            </div>
        </div>
      </section>

      {/* How We Make a Difference Section */}
      <section className="bg-emerald-800 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">How We Make A Difference?</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <School size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-2">Build & Support Schools</h3>
              <p className="text-emerald-200">We fund the construction and renovation of schools in underprivileged areas.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <BookOpen size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-2">Provide Essential Resources</h3>
              <p className="text-emerald-200">From textbooks to technology, we ensure students have the tools they need.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-white/10 p-4 rounded-full mb-4">
                <HandHeart size={32} />
              </div>
              <h3 className="font-semibold text-xl mb-2">Relationships & Programs</h3>
              <p className="text-emerald-200">Our mentorship and after-school programs help children thrive.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Campaigns Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Our Active Campaigns</h2>
            <p className="text-lg text-gray-600">Your contribution can directly support these vital projects.</p>
        </div>

        {loading ? (
            <p className="text-center text-gray-600">Loading campaigns...</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredCampaigns.map(campaign => (
                <div key={campaign.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                    {/* Image placeholder */}
                    <div className="h-48 bg-gray-200 w-full"></div>
                    <div className="p-6 flex-grow flex flex-col">
                        <h3 className="font-bold text-xl mb-2 text-gray-800">{campaign.title}</h3>
                        <span className="inline-block bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full mb-4 self-start">
                            {campaign.category || 'General'}
                        </span>
                        <p className="text-gray-600 text-sm mb-4 flex-grow">{campaign.description}</p>
                        
                        <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                                <span>Raised: ${new Intl.NumberFormat().format(campaign.collected || 0)}</span>
                                <span>Goal: ${new Intl.NumberFormat().format(campaign.goal)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-emerald-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min(progressPercentage(campaign.collected || 0, campaign.goal), 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleDonateClick(campaign)}
                            className="w-full mt-auto px-4 py-2 bg-emerald-700 text-white text-sm rounded-md hover:bg-emerald-800 transition font-medium"
                        >
                            Donate to this Cause
                        </button>
                    </div>
                </div>
            ))}
            </div>
        )}
        <div className="text-center">
            <Link to="/campaigns" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition font-medium">
                View All Campaigns
            </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-3xl mx-auto">
            <h2 className="text-center text-3xl md:text-4xl font-bold mb-8 text-gray-800">Frequently Asked Questions</h2>
            <FaqItem question="How exactly will my donation be used?">
                <p>Your donation will be allocated to the campaign you choose. If you make a general donation, it will be used in our area of greatest need, which could include funding for school supplies, teacher training, or infrastructure projects.</p>
            </FaqItem>
            <FaqItem question="Can I choose a specific school or child to support?">
                <p>To ensure fairness and protect the privacy of the children we serve, we do not facilitate direct support for specific individuals. However, you can choose to support campaigns targeted at specific regions or types of projects, like 'Build a Library' or 'Fund a Science Lab'.</p>
            </FaqItem>
            <FaqItem question="Is my donation tax-deductible?">
                <p>Yes, HopeForAll is a registered non-profit organization. All donations are tax-deductible to the extent allowed by law. You will receive a receipt for your records after your donation is processed.</p>
            </FaqItem>
        </div>
      </section>


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
                  <li><a href="/supports" className="hover:text-green-600">Contact</a></li>
                  <li><a href="/supports" className="hover:text-green-600">FAQ</a></li>
                  <li><a href="/supports" className="hover:text-green-600">Privacy</a></li>
                  <li><a href="/supports" className="hover:text-green-600">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                <p>© {new Date().getFullYear()} HopeForAll. All rights reserved.</p>
            </div>
        </div>
      </footer>

      {/* Donation Modal (Functionality remains, styling is minimal) */}
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
    </div>
  );
};

export default Home;