
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Shield, AlertTriangle, FileText, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Policy = () => {
  const navigate = useNavigate();

  const terms = [
    {
      title: "Data Accuracy",
      description: "Users agree to provide accurate project data and information throughout the construction process."
    },
    {
      title: "Platform Liability", 
      description: "The platform is not liable for construction delays, quality issues, or disputes between parties."
    },
    {
      title: "Payment Responsibility",
      description: "Payment approvals and financial decisions are the sole responsibility of the client/land owner."
    },
    {
      title: "Local Data Storage",
      description: "All data is stored locally on the user's device and browser, ensuring privacy and security."
    },
    {
      title: "Currency Display",
      description: "All financial amounts are displayed in Indian Rupees (₹ INR) unless otherwise specified."
    },
    {
      title: "Timeline Estimates",
      description: "Construction timelines and completion dates are estimates and may vary due to various factors."
    },
    {
      title: "Visual Representations",
      description: "Paint colors, designs, and visual previews may vary from actual results due to lighting and material differences."
    },
    {
      title: "Blueprint Verification",
      description: "All blueprints and technical drawings must be verified by qualified professionals before implementation."
    },
    {
      title: "Account Security",
      description: "Users must maintain confidentiality of login credentials and are responsible for account security."
    },
    {
      title: "Feedback Collection",
      description: "User feedback and usage data may be recorded for quality assurance and platform improvement."
    },
    {
      title: "Platform Updates",
      description: "App updates may modify layout, functionality, or features to enhance user experience."
    },
    {
      title: "Content Ownership",
      description: "Users retain ownership of all content, images, and data uploaded to the platform."
    },
    {
      title: "Data Privacy",
      description: "No personal data is sold, shared, or transmitted to third parties without explicit consent."
    },
    {
      title: "Service Availability",
      description: "Platform availability and uptime are subject to maintenance schedules and technical requirements."
    },
    {
      title: "Terms Acceptance",
      description: "By creating an account and using BuildTracker, users acknowledge and accept these terms and conditions."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Shield className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Terms & Conditions</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Please read these terms and conditions carefully before using BuildTracker. 
            By accessing and using our platform, you agree to be bound by these terms.
          </p>
        </div>

        {/* Header Image */}
        <div className="w-full h-48 bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src="/placeholder.svg" 
            alt="Legal documents and construction site"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Last Updated */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FileText className="h-4 w-4" />
              <span>Last updated: July 12, 2024</span>
            </div>
          </CardContent>
        </Card>

        {/* Terms List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
              Terms and Conditions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {terms.map((term, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{index + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{term.title}</h3>
                  <p className="text-gray-300">{term.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Important Notice */}
        <Card className="bg-yellow-900/20 border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Important Notice</h3>
                <p className="text-yellow-200">
                  BuildTracker is a project management and tracking platform designed to facilitate communication 
                  and transparency in construction projects. While we strive to provide accurate tools and features, 
                  all construction-related decisions, quality assurance, and safety measures remain the responsibility 
                  of qualified professionals and contractors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Questions or Concerns?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              If you have any questions about these terms and conditions or need clarification on any points, 
              please don't hesitate to contact us.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                <strong className="text-white">Email:</strong> legal@buildtracker.com
              </p>
              <p className="text-gray-400">
                <strong className="text-white">Phone:</strong> +91 98765 43210
              </p>
              <p className="text-gray-400">
                <strong className="text-white">Address:</strong> 123 Tech Park Road, Bangalore, Karnataka 560100
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-800">
          <p>© 2024 BuildTracker. All rights reserved.</p>
          <p className="mt-2">
            These terms and conditions are governed by the laws of India and are subject to the jurisdiction of Bangalore courts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Policy;
