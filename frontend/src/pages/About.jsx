import { Link } from 'react-router-dom';
import { Users, Target, Heart, Award, Globe, Shield, Star, BookOpen, School, HandHeart, Phone, Mail, MapPin } from 'lucide-react';
import { isAuthenticated } from '../api/api.js';
import CountUp from '../components/CountUp.jsx';

const About = () => {
  const awards = [
    "Global Icon Award",
    "National Youth Awareness Award", 
    "National Achievement Award",
    "Dr. A.P.J. Abdul Kalam Youth Inspiration Award",
    "Social Pride Award",
    "Society Excellence Award",
    "Social Ambassador Award",
    "Social Gem Award – 1",
    "Social Gem Award – 2",
    "Bharari (Flight) Award"
  ];

  const achievements = [
    {
      icon: Users,
      title: "Residential Facility",
      description: "Provides residential facilities for 20 differently-abled students."
    },
    {
      icon: Heart,
      title: "Matrimonial Support", 
      description: "Arranged 72 marriages of differently-abled couples with full traditional ceremonies."
    },
    {
      icon: School,
      title: "Vocational Training",
      description: "Trained 2,000+ students in mobile repairing, beauty parlour, tailoring, and data entry."
    },
    {
      icon: BookOpen,
      title: "Business Guidance",
      description: "Thousands of youth started their own businesses through free guidance programs."
    },
    {
      icon: Shield,
      title: "UDID Cards",
      description: "Distributed UDID cards to 300+ differently-abled individuals through special camps."
    },
    {
      icon: Target,
      title: "Housing Assistance",
      description: "350 beneficiaries received ₹1 lakh each for housing under Chikhli Housing Scheme."
    }
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+91 9011452216 / +91 8788535200",
      description: "Speak directly with our team"
    },
    {
      icon: Mail,
      title: "Email Us", 
      details: "jhunjsanstha@gmail.com",
      description: "Send us your queries and we'll respond promptly"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: "Pimpri-Chinchwad, Maharashtra",
      description: "Stop by our headquarters"
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
          About Jhunj Divyang Sanstha Ashram
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Empowering differently-abled individuals through education, vocational training, and social support since 2014.
        </p>
      </section>

      {/* Founder Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Founder</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-emerald-100 p-4 rounded-full">
                  <Star className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Raju Kadappa Hirve</h3>
              </div>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                <strong>Founder & President</strong> - Jhunj Divyang Sanstha Ashram Training Center
              </p>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                <strong>Education:</strong> Passed 11th Grade, Pune<br/>
                <strong>Occupation:</strong> Mobile Repairing Shop Owner<br/>
                <strong>Passion:</strong> Social Work & Empowerment
              </p>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                Raju Hirve's life journey of struggle and determination has been captured in the book 
                <strong> "Sangharshashi Don Haath" (Fighting Against Struggles)</strong>, inspiring countless individuals 
                to overcome challenges and create positive change.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                He personally provides mobile repairing training to students and has been honored with 
                over 40 awards for his exceptional contribution to disability welfare.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <div className="text-center mb-6">
                <Award className="h-16 w-16 text-emerald-600 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-gray-800">Awards & Recognition</h4>
              </div>
              <div className="grid grid-cols-1 gap-4 max-h-80 overflow-y-auto">
                {awards.map((award, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Star className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{award}</span>
                    </div>
                  </div>
                ))}
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
                To empower differently-abled individuals through comprehensive support including education, 
                vocational training, social integration, and independent living opportunities.
              </p>
            </div>
            <div className="text-center bg-white p-8 rounded-lg border border-gray-200">
              <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                A society where differently-abled individuals are fully integrated, self-reliant, 
                and empowered to lead dignified lives with equal opportunities and social acceptance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Achievements</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transforming lives through dedicated service and innovative programs since 2014.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="bg-emerald-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <IconComponent className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{achievement.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                </div>
              );
            })}
          </div>

          {/* Additional Impact Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-emerald-50 rounded-lg p-8 border border-emerald-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700 mb-2">
                <CountUp to={20} from={0} duration={2} />
              </div>
              <div className="text-gray-700 font-medium">Residential Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700 mb-2">
                <CountUp to={72} from={0} duration={2} />
              </div>
              <div className="text-gray-700 font-medium">Marriages Arranged</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700 mb-2">
                <CountUp to={2000} from={0} duration={2} separator="," />+
              </div>
              <div className="text-gray-700 font-medium">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700 mb-2">
                <CountUp to={40} from={0} duration={2} />+
              </div>
              <div className="text-gray-700 font-medium">Awards Received</div>
            </div>
          </div>
        </div>
      </section>

      {/* COVID Response Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">COVID-19 Response</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Support During Pandemic</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full mt-1">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Safety Distribution</h4>
                    <p className="text-gray-600">Distributed masks and sanitizers among differently-abled individuals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full mt-1">
                    <HandHeart className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Livelihood Support</h4>
                    <p className="text-gray-600">Provided mask-making kits and tailoring materials worth ₹5,000 each to 100 individuals</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full mt-1">
                    <School className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Online Training</h4>
                    <p className="text-gray-600">Conducted free online mobile repairing training for 350 students in collaboration with GTT Foundation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Get In Touch</h3>
              <div className="space-y-6">
                {contactInfo.map((contact, index) => {
                  const IconComponent = contact.icon;
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <div className="bg-emerald-100 p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{contact.title}</h4>
                        <p className="text-gray-600 text-sm">{contact.description}</p>
                        <p className="text-emerald-700 font-medium">{contact.details}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-800 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Support our efforts to empower differently-abled individuals and create an inclusive society
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/campaigns"
              className="px-8 py-4 bg-white text-emerald-700 rounded-md hover:bg-gray-100 transition font-medium flex items-center justify-center gap-3 text-lg"
            >
              <Heart size={20} />
              Support Our Work
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
              <h3 className="text-xl font-bold text-emerald-700 mb-4">Jhunj Divyang Sanstha</h3>
              <p className="text-sm text-gray-600">Empowering differently-abled individuals since 2014</p>
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
            <p>© {new Date().getFullYear()} Jhunj Divyang Sanstha Ashram Training Center. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;