import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Award, Users, Clock, Phone, Mail, MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  const milestones = [
    { year: '2004', event: 'Company Founded', description: 'Started with a vision to transform construction industry' },
    { year: '2008', event: 'First Major Project', description: 'Completed our first residential complex in Bangalore' },
    { year: '2015', event: '10+ Projects', description: 'Successfully delivered 10 residential and commercial projects' },
    { year: '2020', event: 'Digital Transformation', description: 'Launched BuildTracker platform for better transparency' },
    { year: '2024', event: '24 Projects', description: 'Completed 24 successful projects across South India' }
  ];

  const completedProjects = [
    {
      name: 'Emerald Heights',
      location: 'Whitefield, Bangalore',
      type: 'Residential Complex',
      year: '2023',
      image: '/placeholder.svg'
    },
    {
      name: 'Tech Park Plaza',
      location: 'Electronic City, Bangalore',
      type: 'Commercial Complex',
      year: '2022',
      image: '/placeholder.svg'
    },
    {
      name: 'Golden Gardens',
      location: 'Koramangala, Bangalore',
      type: 'Villa Project',
      year: '2023',
      image: '/placeholder.svg'
    },
    {
      name: 'Marina Residency',
      location: 'Chennai, Tamil Nadu',
      type: 'Apartment Complex',
      year: '2021',
      image: '/placeholder.svg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Back Button */}
        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate(-1)}
            variant="outline" 
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">About BuildTracker</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Established in 2004, we have completed 24 successful residential and commercial projects across India. 
            Known for transparency, quality construction, and on-time delivery.
          </p>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="p-6">
              <Building className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">24+</div>
              <div className="text-sm text-gray-400">Projects Completed</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">200+</div>
              <div className="text-sm text-gray-400">Happy Customers</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="p-6">
              <Clock className="h-8 w-8 text-orange-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">20</div>
              <div className="text-sm text-gray-400">Years of Experience</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800 text-center">
            <CardContent className="p-6">
              <Award className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">15+</div>
              <div className="text-sm text-gray-400">Awards Won</div>
            </CardContent>
          </Card>
        </div>

        {/* Company Story */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 mb-4">
                BuildTracker was founded in 2004 with a simple yet ambitious vision: to revolutionize the construction 
                industry through transparency, quality, and innovation. What started as a small construction company 
                in Bangalore has grown into one of South India's most trusted construction partners.
              </p>
              <p className="text-gray-300 mb-4">
                Our journey began when our founder, recognizing the need for better communication between contractors 
                and clients, decided to build a company that would prioritize transparency at every step. Over the years, 
                we've completed residential complexes, commercial buildings, and villa projects, always maintaining our 
                commitment to quality and timely delivery.
              </p>
              <p className="text-gray-300">
                Today, we leverage cutting-edge technology through our BuildTracker platform to provide real-time 
                project updates, expense tracking, and seamless communication between all project stakeholders. 
                Our digital-first approach has set new standards in the construction industry.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Our Milestones</h2>
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{milestone.year}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white">{milestone.event}</h3>
                    <p className="text-gray-400">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Completed Projects Gallery */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Our Recent Completed Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {completedProjects.map((project, index) => (
                <div key={index} className="bg-gray-800 rounded-lg overflow-hidden">
                  <div className="aspect-square bg-gray-700 flex items-center justify-center">
                    <Building className="h-12 w-12 text-gray-500" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{project.name}</h3>
                    <p className="text-sm text-gray-400 mb-1">{project.location}</p>
                    <p className="text-xs text-blue-400">{project.type} • {project.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Get In Touch</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Phone</h3>
                  <p className="text-gray-400">+91 98765 43210</p>
                  <p className="text-gray-400">+91 87654 32109</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <p className="text-gray-400">info@buildtracker.com</p>
                  <p className="text-gray-400">projects@buildtracker.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-white">Office</h3>
                  <p className="text-gray-400">123 Tech Park Road</p>
                  <p className="text-gray-400">Bangalore, Karnataka 560100</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutUs;
