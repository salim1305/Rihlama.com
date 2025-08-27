import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { 
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  Users,
  Briefcase
} from 'lucide-react';

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        category: 'general',
        message: ''
      });
      setLoading(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      details: 'Available 24/7',
      action: 'Start Chat',
      color: 'bg-blue-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions anytime',
      details: 'contact@rihlamaroc.net',
      action: 'Send Email',
      color: 'bg-purple-500'
    }
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'booking', label: 'Booking Support' },
    { value: 'host', label: 'Host Questions' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'press', label: 'Press & Media' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or need help? We're here to assist you with your Rihla experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <Card key={index} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-lg ${method.color} text-white`}>
                          <method.icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{method.title}</h3>
                          <p className="text-sm text-gray-600 mb-1">{method.description}</p>
                          <p className="text-sm font-medium text-gray-900 mb-2">{method.details}</p>
                          <Button size="sm" variant="outline" className="text-xs">
                            {method.action}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Office Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Our Office
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-900">Rihla Morocco</p>
                    <p>123 Avenue Mohammed V</p>
                    <p>Gueliz, Marrakech 40000</p>
                    <p>Morocco</p>
                    <p className="mt-2 font-medium">Email: contact@rihlamaroc.net</p>
                  </div>
                  
                  <div className="flex items-center pt-2">
                    <Clock className="h-4 w-4 mr-2 text-green-600" />
                    <div>
                      <p className="font-medium">Office Hours</p>
                      <p>Mon-Fri: 9:00 AM - 6:00 PM</p>
                      <p>Sat: 10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full p-2 border border-gray-300 rounded-md focus:border-green-500 focus:ring-green-500"
                      >
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Brief description of your inquiry"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="Please provide details about your inquiry..."
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      * Required fields. We'll respond within 24 hours.
                    </p>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="rihla-gradient-primary flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>{loading ? 'Sending...' : 'Send Message'}</span>
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Help */}
            <Card className="mt-6 p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold mb-3 text-green-800">Need Quick Help?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">New User?</p>
                  <Button size="sm" variant="outline" className="mt-1 text-xs">
                    Getting Started Guide
                  </Button>
                </div>
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Booking Issues?</p>
                  <Button size="sm" variant="outline" className="mt-1 text-xs">
                    Booking Help
                  </Button>
                </div>
                <div className="text-center">
                  <Briefcase className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Want to Host?</p>
                  <Button size="sm" variant="outline" className="mt-1 text-xs">
                    Host Resources
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;