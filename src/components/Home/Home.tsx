import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  Users, 
  BarChart3, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  CheckCircle,
  Star,
  Play
} from 'lucide-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Advanced Question Types',
      description: 'Create categorize, cloze, and comprehension questions with drag-and-drop functionality.'
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Real-time Responses',
      description: 'Collect and manage form responses in real-time with detailed analytics.'
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Response Analytics',
      description: 'Export responses to CSV and analyze your data with comprehensive reporting.'
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Drag & Drop Builder',
      description: 'Intuitive form builder with drag-and-drop question reordering and customization.'
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Reliable',
      description: 'JWT-based authentication and secure data handling for all your forms.'
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: 'Easy Sharing',
      description: 'Share forms via public links or send directly via email to your audience.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Education Director',
      content: 'FormBuilder Pro has revolutionized how we create assessments. The comprehension questions are perfect for our reading tests.',
      rating: 5
    },
    {
      name: 'Mark Chen',
      role: 'HR Manager',
      content: 'The categorization feature is amazing for skill assessments. Our hiring process is now much more efficient.',
      rating: 5
    },
    {
      name: 'Lisa Rodriguez',
      role: 'Research Analyst',
      content: 'The export functionality and response analytics have made data collection so much easier for our research projects.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Build Amazing Forms with Advanced Question Types
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Create interactive forms with categorize, cloze, and comprehension questions. 
              Perfect for education, assessments, surveys, and research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create powerful forms
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our advanced form builder includes specialized question types and features 
              designed for modern data collection needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-shadow">
                <div className="text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Question Types Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Advanced Question Types
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Go beyond basic forms with our specialized question types designed for 
              educational assessments and interactive surveys.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-50 rounded-xl border border-blue-100">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">🗂️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Categorize</h3>
              <p className="text-gray-600">
                Drag-and-drop items into correct categories. Perfect for classification 
                exercises and sorting activities.
              </p>
            </div>

            <div className="text-center p-8 bg-green-50 rounded-xl border border-green-100">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Cloze</h3>
              <p className="text-gray-600">
                Fill-in-the-blank questions with text inputs or dropdown options. 
                Great for language learning and comprehension tests.
              </p>
            </div>

            <div className="text-center p-8 bg-purple-50 rounded-xl border border-purple-100">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl text-white">📖</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comprehension</h3>
              <p className="text-gray-600">
                Reading passages with follow-up questions. Multiple question types 
                supported for comprehensive assessment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by educators and professionals
            </h2>
            <p className="text-xl text-gray-600">
              See what our users are saying about FormBuilder Pro
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build your first form?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of users who are already creating amazing forms with advanced question types.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isAuthenticated ? (
              <Link
                to="/forms/create"
                className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Create Your First Form
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
                >
                  Start Building for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-100">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Advanced features</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;