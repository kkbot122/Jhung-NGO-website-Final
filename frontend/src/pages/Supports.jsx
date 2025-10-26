import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, Shield, FileText, HelpCircle, Send, BookOpen, School, HandHeart, CheckCircle, AlertCircle } from 'lucide-react';
import { isAuthenticated, contactAPI } from '../api/api';

// FAQ Item Component

const Supports = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await contactAPI.sendContactMessage(formData);
      setSuccess(true);
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email and we'll respond within 24 hours",
      details: "support@hopeforall.org",
      link: "mailto:support@hopeforall.org"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our support team",
      details: "+91 9011452216",
      link: "tel:+91 9011452216"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Stop by our headquarters",
      details: "Pimpri-Chinchwad",
      link: "https://maps.google.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
  <img 
    src="/NGO-Logo.jpeg" 
    alt="Jhung Divyang Aashram" 
    className="h-13 w-auto"
  />
</Link>
          <nav className="hidden md:flex gap-8 text-md text-gray-700">
            <Link to="/" className="hover:text-emerald-700 font-medium">Home</Link>
            <Link to="/campaigns" className="hover:text-emerald-700 font-medium">Campaigns</Link>
            <Link to="/about" className="hover:text-emerald-700 font-medium">About</Link>
            <Link to="/supports" className="text-emerald-700 font-medium border-b-2 border-emerald-700 pb-1">Support</Link>
          </nav>
          <div className="flex items-center gap-4">
            {!isAuthenticated() ? (
              <Link to="/register" className="px-5 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition text-sm font-medium">
                Register
              </Link>
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
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          How Can We Help You?
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          Get answers to your questions and find the support you need to make a difference through education.
        </p>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-6">
    <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Reach out to us through any of these methods. We're here to help you support education!
      </p>
    </div>

    {/* Centered contact methods grid - FIXED */}
    <div className="flex justify-center mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-fit">
        {contactMethods.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <a
              key={index}
              href={method.link}
              className="bg-white rounded-lg border border-gray-200 p-6 text-center hover:shadow-lg transition-shadow group w-64"
            >
              <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-200 transition-colors">
                <IconComponent className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{method.title}</h3>
              <p className="text-gray-600 mb-3 text-sm">{method.description}</p>
              <p className="text-emerald-700 font-medium">{method.details}</p>
            </a>
          );
        })}
      </div>
    </div>

    {/* Centered contact form */}
    <div className="flex justify-center">
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-8 w-full max-w-2xl">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Send us a Message</h3>
        
        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <p className="text-green-800 font-medium">Message sent successfully!</p>
                <p className="text-green-700 text-sm">Thank you for contacting us. We'll get back to you soon.</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Enter your last name"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
            <select 
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="General Inquiry">General Inquiry</option>
              <option value="Donation Questions">Donation Questions</option>
              <option value="Volunteer Opportunities">Volunteer Opportunities</option>
              <option value="Partnership Inquiry">Partnership Inquiry</option>
              <option value="Technical Support">Technical Support</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <textarea
              name="message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Tell us how we can help you support education..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-700 text-white py-3 px-6 rounded-md hover:bg-emerald-800 transition flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={20} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  </div>
</section>

      {/* Privacy & Terms Sections */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Privacy Policy */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  At Zunj Divyang Sanstha, we are committed to protecting your privacy and ensuring the security of your personal information.
                </p>
                <h3 className="font-semibold text-gray-800 mt-4">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Personal identification information</li>
                  <li>Payment information for donations</li>
                  <li>Communication preferences</li>
                  <li>Website usage data and analytics</li>
                </ul>
                <p className="mt-4 leading-relaxed">
                  We never sell your personal information to third parties. Read our full privacy policy for complete details.
                </p>
              </div>
            </div>

            {/* Terms of Service */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-8">
              <div className="flex items-center mb-6">
                <div className="bg-emerald-100 p-3 rounded-full mr-4">
                  <FileText className="h-6 w-6 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Terms of Service</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="leading-relaxed">
                  By using Zunj Divyang Sanstha's services, you agree to comply with and be bound by the following terms and conditions.
                </p>
                <h3 className="font-semibold text-gray-800 mt-4">User Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use services for lawful purposes only</li>
                  <li>Respect intellectual property rights</li>
                </ul>
                <h3 className="font-semibold text-gray-800 mt-4">Donation Terms</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All donations are final and non-refundable</li>
                  <li>Recurring donations can be cancelled anytime</li>
                  <li>Tax receipts are provided for eligible donations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Additional Legal Links */}

        </div>
      </section>

      {/* Quick Support CTA */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">Need Immediate Assistance?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Our support team is ready to help you with any questions about supporting education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@hopeforall.org"
              className="px-8 py-4 bg-white text-emerald-700 rounded-md hover:bg-gray-100 transition font-medium flex items-center justify-center gap-3 text-lg"
            >
              <Mail size={20} />
              Email Support
            </a>
            <a
              href="tel:+15551234357"
              className="px-8 py-4 border-2 border-white text-white rounded-md hover:bg-white hover:text-emerald-800 transition font-medium"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Zunj Divyang Sanstha</h3>
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
            <p>© {new Date().getFullYear()} Zunj Divyang Sanstha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Supports;