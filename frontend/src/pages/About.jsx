import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award, Globe, Shield, Star } from 'lucide-react';

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-green-600">HopeForAll</Link>
          <nav className="flex gap-8 text-sm text-gray-600">
            <Link to="/campaigns" className="hover:text-green-600 font-medium">Campaigns</Link>
            <Link to="/register" className="hover:text-green-600 font-medium">Volunteer</Link>
            <Link to="/register" className="hover:text-green-600 font-medium">Donate</Link>
            <Link to="/about" className="text-green-600 font-medium border-b-2 border-green-600 pb-1">About</Link>
            <Link to="/register" className="hover:text-green-600 font-medium">Register</Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About HopeForAll</h1>
          <p className="text-xl md:text-2xl opacity-90">
            Creating lasting change through compassion, community, and collective action
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-6xl mb-6">❤️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">From Humble Beginnings to Global Impact</h3>
              <p className="text-gray-600 mb-4 text-lg">
                HopeForAll was founded in 2015 with a simple yet powerful vision: to create a world where 
                every individual has access to basic necessities, education, and opportunities for a better life.
              </p>
              <p className="text-gray-600 mb-4 text-lg">
                What started as a small community initiative has grown into a global movement, bringing together 
                thousands of volunteers, donors, and partners who share our commitment to positive change.
              </p>
              <p className="text-gray-600 text-lg">
                Our journey has been guided by the belief that when communities come together, we can overcome 
                even the most challenging obstacles and create lasting, meaningful impact.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 mb-2">2015</div>
                  <div className="text-gray-700">Founded</div>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-700">Countries Reached</div>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 mb-2">5,000+</div>
                  <div className="text-gray-700">Volunteers</div>
                </div>
                <div className="text-center p-6 bg-orange-50 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 mb-2">120+</div>
                  <div className="text-gray-700">Projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-600 text-lg">
                To empower communities through sustainable development projects, providing access to education, 
                healthcare, and essential resources while fostering self-reliance and resilience.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg">
                A world where every person has the opportunity to thrive, communities are empowered to drive 
                their own development, and hope is accessible to all, regardless of circumstance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the dedicated professionals who drive our mission forward with passion and expertise
            </p>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4">{member.image}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <div className="text-green-600 font-medium mb-3">{member.role}</div>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Team</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                We're always looking for passionate individuals who want to make a difference. 
                Whether you're interested in volunteering or career opportunities, we'd love to hear from you.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
              >
                <Users className="mr-2" size={20} />
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Measuring success through the lives we've touched and the communities we've transformed
            </p>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {impactStats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-10 w-10 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>

          {/* Impact Stories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-green-50 rounded-lg p-6">
              <div className="text-green-600 mb-3">
                <Award size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Education Transformation</h4>
              <p className="text-gray-600">
                Built and supported 45 schools, providing quality education to over 15,000 children 
                in underserved communities across three continents.
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-6">
              <div className="text-blue-600 mb-3">
                <Heart size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Healthcare Access</h4>
              <p className="text-gray-600">
                Established mobile medical clinics serving 25,000+ patients annually with free 
                healthcare services and preventive care programs.
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-6">
              <div className="text-purple-600 mb-3">
                <Shield size={32} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Community Development</h4>
              <p className="text-gray-600">
                Implemented sustainable agriculture projects and clean water initiatives, 
                improving livelihoods for 10,000+ families in rural areas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Collaborating with leading organizations to maximize our impact and reach
            </p>
            <div className="w-24 h-1 bg-green-600 mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
            {partners.map((partner, index) => (
              <div key={index} className="text-center group">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col items-center justify-center">
                  <div className="text-4xl mb-3">{partner.logo}</div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{partner.name}</h4>
                  <p className="text-gray-500 text-xs">{partner.type}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Become a Partner</h3>
              <p className="text-gray-600 mb-6">
                Join our network of change-makers and help us expand our reach. 
                Together, we can create even greater impact.
              </p>
              <button className="px-6 py-3 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition font-medium">
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of supporters who are creating positive change around the world
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-3 bg-white text-green-600 rounded-lg hover:bg-gray-100 transition font-medium flex items-center justify-center gap-2"
            >
              <Heart size={20} />
              Donate Now
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 border border-white text-white rounded-lg hover:bg-white hover:text-green-600 transition font-medium"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="text-2xl font-bold text-green-600 mb-4">HopeForAll</div>
            <p className="text-gray-600 max-w-md">
              Creating positive change through community support and collective action since 2015.
            </p>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            <p>© 2025 HopeForAll NGO. All rights reserved. Made with ❤️ for a better world.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;