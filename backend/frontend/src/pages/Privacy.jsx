import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Personal information you provide when creating an account (name, email, phone number)',
        'Booking and payment information for reservations',
        'Communication data when you contact us or message hosts',
        'Device and usage information to improve our services',
        'Location data when you use our mobile app (with your consent)'
      ]
    },
    {
      icon: Database,
      title: 'How We Use Your Information',
      content: [
        'To provide and improve our travel booking services',
        'To process bookings and facilitate communication with hosts',
        'To send important updates about your reservations',
        'To personalize your experience and show relevant content',
        'To ensure safety and prevent fraud across our platform'
      ]
    },
    {
      icon: Users,
      title: 'Information Sharing',
      content: [
        'With hosts to facilitate your bookings and experiences',
        'With payment processors to handle secure transactions',
        'With service providers who help us operate our platform',
        'When required by law or to protect rights and safety',
        'We never sell your personal information to third parties'
      ]
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure servers and regular security audits',
        'Limited access to personal information on a need-to-know basis',
        'Regular monitoring for unauthorized access or breaches',
        'Prompt notification if any security incidents occur'
      ]
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        'Access and download your personal information',
        'Correct inaccurate or incomplete information',
        'Delete your account and associated data',
        'Opt out of marketing communications',
        'File complaints with data protection authorities'
      ]
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: [
        'For privacy questions: privacy@rihlamaroc.net',
        'For data requests: data@rihlamaroc.net',
        'Email: contact@rihlamaroc.net',
        'Mail: Rihla Privacy Team, 123 Avenue Mohammed V, Marrakech 40000, Morocco'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
            Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
          </p>
          <p className="text-sm text-gray-500">Last updated: January 2024</p>
        </div>

        {/* Introduction */}
        <Card className="mb-8 p-6 bg-green-50 border-green-200">
          <div className="flex items-start space-x-4">
            <Shield className="h-8 w-8 text-green-600 mt-1" />
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-2">Our Commitment to Privacy</h2>
              <p className="text-green-700">
                At Rihla, we're committed to protecting your privacy and ensuring transparency about how we handle your data. 
                This policy applies to all our services, including our website, mobile apps, and any interactions you have with us.
              </p>
            </div>
          </div>
        </Card>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <section.icon className="h-6 w-6 text-green-600" />
                  <span>{section.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Retention */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                We retain your personal information only as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Account Information:</strong> Until you delete your account or request deletion</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Booking Records:</strong> 7 years after completion for tax and legal purposes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Communication Data:</strong> 3 years after last interaction</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600">•</span>
                  <span><strong>Usage Analytics:</strong> Anonymized after 2 years</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* International Transfers */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              As a global platform, we may transfer your information to countries outside Morocco. We ensure adequate 
              protection through:
            </p>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Standard contractual clauses approved by data protection authorities</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Adequacy decisions for countries with appropriate protection levels</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-green-600">•</span>
                <span>Your explicit consent where required by law</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Updates to Policy */}
        <Card className="mt-8 p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Changes to This Policy</h3>
          <p className="text-blue-700 mb-4">
            We may update this privacy policy periodically to reflect changes in our practices or legal requirements. 
            We'll notify you of significant changes by:
          </p>
          <ul className="space-y-1 text-blue-700 ml-4">
            <li>• Sending you an email notification</li>
            <li>• Posting a notice on our website</li>
            <li>• Including an in-app notification</li>
          </ul>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Have questions about this privacy policy or how we handle your data?
          </p>
          <div className="space-x-4">
            <a href="/contact" className="text-green-600 hover:text-green-500 font-medium">
              Contact Us
            </a>
            <span className="text-gray-300">|</span>
            <a href="/help" className="text-green-600 hover:text-green-500 font-medium">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;