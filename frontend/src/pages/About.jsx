import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award, Globe, Shield, Star, BookOpen, School, HandHeart } from 'lucide-react';
import { isAuthenticated } from '../api/api.js';

const About = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: '👩‍💼',
      bio: 'Former social worker with 10+ years of experience in community development'
    },
    {
      name: 'Michael Chen',
      role: 'Operations Director',
      image: '👨‍💼',
      bio: 'Expert in nonprofit management and strategic planning'
    },
    {
      name: 'Dr. Maria Rodriguez',
      role: 'Medical Programs Lead',
      image: '👩‍⚕️',
      bio: 'Medical professional dedicated to healthcare accessibility'
    },
    {
      name: 'David Kim',
      role: 'Education Coordinator',
      image: '👨‍🏫',
      bio: 'Passionate about creating educational opportunities for all'
    }
  ];

  const impactStats = [
    { number: '50,000+', label: 'Lives Impacted', icon: Users },
    { number: '120+', label: 'Projects Completed', icon: Target },
    { number: '$2.5M+', label: 'Funds Raised', icon: Heart },
    { number: '35+', label: 'Communities Served', icon: Globe }
  ];

  const partners = [
    { name: 'Global Health Initiative', logo: '🏥', type: 'Healthcare Partner' },
    { name: 'Education for All Foundation', logo: '📚', type: 'Education Partner' },
    { name: 'Green Earth Alliance', logo: '🌱', type: 'Environmental Partner' },
    { name: 'Community First Org', logo: '🤝', type: 'Community Development' },
    { name: 'Future Leaders Program', logo: '🌟', type: 'Youth Empowerment' },
    { name: 'Safe Shelter Network', logo: '🏠', type: 'Housing Partner' }
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
            <Link to="/about" className="text-emerald-700 font-medium border-b-2 border-emerald-700 pb-1">About</Link>
            {!isAuthenticated() && <Link to="/register" className="hover:text-emerald-700 font-medium">Register</Link>}
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
      <section className="text-center py-20 px-6 bg-emerald-700 text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About Jhung Divyang Asharam
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Creating lasting change through compassion, community, and collective action. 
          Together, we're building a brighter future through education and opportunity.
        </p>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From humble beginnings to creating meaningful impact in communities worldwide
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Heart className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">From Vision to Global Movement</h3>
              </div>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                HopeForAll was founded in 2015 with a simple yet powerful vision: to create a world where 
                every child has access to quality education and every community has the tools to build a better future.
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                What started as a small community initiative has grown into a global movement, bringing together 
                thousands of volunteers, donors, and partners who share our commitment to positive change through education.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                Our journey has been guided by the belief that education is the most powerful tool for 
                transforming lives and building sustainable communities.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-emerald-700 mb-2">2015</div>
                  <div className="text-gray-700 font-medium">Founded</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-700 font-medium">Countries Reached</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5,000+</div>
                  <div className="text-gray-700 font-medium">Volunteers</div>
                </div>
                <div className="text-center p-6 bg-white rounded-lg border border-gray-200">
                  <div className="text-3xl font-bold text-orange-600 mb-2">120+</div>
                  <div className="text-gray-700 font-medium">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center bg-white p-8 rounded-lg border border-gray-200">
              <div className="bg-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                To empower communities through education, providing access to learning resources, 
                building schools, and creating opportunities for children to reach their full potential.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg border border-gray-200">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                A world where every child has access to quality education, every community has the 
                resources to thrive, and education becomes the foundation for lasting positive change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who drive our mission forward with passion and expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{member.name}</h3>
                  <div className="text-emerald-600 font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-emerald-50 rounded-lg p-8 border border-emerald-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Join Our Team</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate individuals who want to make a difference. 
                Whether you're interested in volunteering or career opportunities, we'd love to hear from you.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-emerald-700 text-white rounded-md hover:bg-emerald-800 transition font-medium"
              >
                <Users className="mr-2" size={20} />
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Measuring success through the lives we've touched and the communities we've transformed
            </p>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center bg-white p-6 rounded-lg border border-gray-200">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Impact Stories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-emerald-100 p-3 rounded-full inline-flex mb-4">
                <School className="h-6 w-6 text-emerald-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Education Transformation</h4>
              <p className="text-gray-600 leading-relaxed">
                Built and supported 45 schools, providing quality education to over 15,000 children 
                in underserved communities across three continents.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-blue-100 p-3 rounded-full inline-flex mb-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Learning Resources</h4>
              <p className="text-gray-600 leading-relaxed">
                Distributed over 100,000 educational materials and established 25 libraries 
                to support continuous learning and literacy development.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="bg-purple-100 p-3 rounded-full inline-flex mb-4">
                <HandHeart className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">Community Development</h4>
              <p className="text-gray-600 leading-relaxed">
                Implemented teacher training programs and parent education initiatives, 
                creating sustainable educational ecosystems in rural areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Partners</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Collaborating with leading organizations to maximize our impact and reach
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {partners.map((partner, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-emerald-300 transition-colors h-full flex flex-col items-center justify-center">
                  <div className="text-3xl mb-3">{partner.logo}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{partner.name}</h4>
                  <p className="text-gray-500 text-xs">{partner.type}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-emerald-50 rounded-lg p-8 border border-emerald-200 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Become a Partner</h3>
              <p className="text-gray-600 mb-6">
                Join our network of change-makers and help us expand our reach. 
                Together, we can create even greater impact through education.
              </p>
              <button className="px-6 py-3 border border-emerald-700 text-emerald-700 rounded-md hover:bg-emerald-700 hover:text-white transition font-medium">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of supporters who are creating positive change through education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/campaigns"
              className="px-8 py-4 bg-white text-emerald-700 rounded-md hover:bg-gray-100 transition font-medium flex items-center justify-center gap-3 text-lg"
            >
              <Heart size={20} />
              Support
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 border-2 border-white text-white rounded-md hover:bg-white hover:text-emerald-800 transition font-medium"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Jhung Divyang Sanstha</h3>
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
            <p>© {new Date().getFullYear()} Jhung Divyang Sanstha. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;