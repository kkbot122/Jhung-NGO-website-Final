import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, MessageCircle, ChevronDown, ChevronUp, Shield, FileText, HelpCircle, Send } from 'lucide-react';

const Supports = () => {
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How can I donate to a campaign?",
      answer: "You can donate by browsing our campaigns page, selecting a campaign you'd like to support, and clicking the 'Donate' button. You'll need to create an account first if you haven't already."
    },
    {
      question: "Is my donation tax-deductible?",
      answer: "Yes, HopeForAll is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law. You will receive a receipt for your records."
    },
    {
      question: "How do I become a volunteer?",
      answer: "You can apply to volunteer by visiting our volunteer page and filling out the application form. You can also browse specific campaigns and apply to volunteer for individual projects that interest you."
    },
    {
      question: "Where does my donation money go?",
      answer: "85% of all donations go directly to program services, 10% to administrative costs, and 5% to fundraising efforts. We are committed to transparency and provide detailed financial reports annually."
    },
    {
      question: "Can I cancel or modify my donation?",
      answer: "One-time donations cannot be cancelled once processed. For recurring donations, you can modify or cancel future payments by logging into your account and managing your donation settings."
    },
    {
      question: "How do I update my account information?",
      answer: "You can update your personal information, email preferences, and payment methods by logging into your account and accessing the 'My Profile' section in your dashboard."
    }
  ];

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
      details: "+1 (555) 123-HELP",
      link: "tel:+15551234357"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant help during business hours",
      details: "Mon-Fri, 9AM-6PM EST",
      link: "#chat"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Stop by our headquarters",
      details: "123 Hope Street, City, State 12345",
      link: "https://maps.google.com"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">HopeForAll</Link>
          <nav className="flex gap-8 text-sm text-gray-600">
            <Link to="/campaigns" className="hover:text-green-600 font-medium">Campaigns</Link>
            <Link to="/volunteer" className="hover:text-green-600 font-medium">Volunteer</Link>
            <Link to="/donate" className="hover:text-green-600 font-medium">Donate</Link>
            <Link to="/about" className="hover:text-green-600 font-medium">About</Link>
            <Link to="/supports" className="text-green-600 font-medium border-b-2 border-green-600 pb-1">Support</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">How Can We Help You?</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Get answers to your questions and find the support you need
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Reach out to us through any of these methods. We're here to help!
            </p>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {contactMethods.map((method, index) => {
              const IconComponent = method.icon;
              return (
                <a
                  key={index}
                  href={method.link}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow text-center group"
                >
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-3">{method.description}</p>
                  <p className="text-green-600 font-medium">{method.details}</p>
                </a>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What is this regarding?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2 font-medium"
              >
                <Send size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* Privacy & Terms Sections */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Privacy Policy */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  At HopeForAll, we are committed to protecting your privacy and ensuring the security of your personal information.
                </p>
                <h3 className="font-semibold text-gray-900 mt-4">Information We Collect</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Personal identification information (Name, email address, phone number)</li>
                  <li>Payment information for donations</li>
                  <li>Communication preferences</li>
                  <li>Website usage data and analytics</li>
                </ul>
                <h3 className="font-semibold text-gray-900 mt-4">How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Process donations and maintain records</li>
                  <li>Communicate about campaigns and updates</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
                <p className="mt-4">
                  We never sell your personal information to third parties. Read our full privacy policy for complete details.
                </p>
              </div>
              <button className="mt-6 text-green-600 hover:text-green-700 font-medium">
                Read Full Privacy Policy →
              </button>
            </div>

            {/* Terms of Service */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>
                  By using HopeForAll's services, you agree to comply with and be bound by the following terms and conditions.
                </p>
                <h3 className="font-semibold text-gray-900 mt-4">User Responsibilities</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the security of your account</li>
                  <li>Use services for lawful purposes only</li>
                  <li>Respect intellectual property rights</li>
                </ul>
                <h3 className="font-semibold text-gray-900 mt-4">Donation Terms</h3>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>All donations are final and non-refundable</li>
                  <li>Recurring donations can be cancelled anytime</li>
                  <li>Tax receipts are provided for eligible donations</li>
                  <li>Funds are allocated as described in campaign details</li>
                </ul>
                <h3 className="font-semibold text-gray-900 mt-4">Service Modifications</h3>
                <p>
                  We reserve the right to modify or discontinue any service at any time. Continued use of our services constitutes acceptance of any changes.
                </p>
              </div>
              <button className="mt-6 text-green-600 hover:text-green-700 font-medium">
                Read Full Terms of Service →
              </button>
            </div>
          </div>

          {/* Additional Legal Links */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Legal Documents</h3>
              <p className="text-gray-600 mb-6">
                Access all our legal documents and policies in one place
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Privacy Policy
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Terms of Service
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Cookie Policy
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                  Disclosure Statement
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Support CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our support team is ready to help you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@hopeforall.org"
              className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-medium flex items-center justify-center gap-2"
            >
              <Mail size={20} />
              Email Support
            </a>
            <a
              href="tel:+15551234357"
              className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-green-600 transition font-medium"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
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

export default Supports;