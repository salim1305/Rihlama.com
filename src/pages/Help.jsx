import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { 
	Search,
	MessageCircle,
	// ...existing code...
	Mail,
	Clock,
	ChevronRight,
	Users,
	CreditCard,
	Shield,
	MapPin,
	Calendar,
	FileText
} from 'lucide-react';

const Help = () => {
	const [searchQuery, setSearchQuery] = useState('');

	const faqCategories = [
		{
			icon: Users,
			title: 'Getting Started',
			description: 'New to Rihla? Learn the basics',
			articles: [
				'How to create your Rihla account',
				'Finding and booking your first experience',
				'Understanding our verification process',
				'Setting up your profile'
			]
		},
		{
			icon: Calendar,
			title: 'Bookings',
			description: 'Everything about your reservations',
			articles: [
				'How to book an experience',
				'Modifying or canceling bookings',
				'Understanding booking confirmations',
				'Group booking policies'
			]
		},
		{
			icon: CreditCard,
			title: 'Payments',
			description: 'Payment methods and billing',
			articles: [
				'Accepted payment methods',
				'Understanding pricing and fees',
				'Refund policies and processing',
				'Payment security measures'
			]
		},
		{
			icon: MapPin,
			title: 'Experiences',
			description: 'About our Moroccan experiences',
			articles: [
				'Types of experiences available',
				'Experience quality standards',
				'What to expect during your visit',
				'Special requirements and accessibility'
			]
		},
		{
			icon: Shield,
			title: 'Safety & Trust',
			description: 'Your safety is our priority',
			articles: [
				'Safety guidelines for travelers',
				'Host verification process',
				'Emergency contacts and procedures',
				'Travel insurance recommendations'
			]
		},
		{
			icon: FileText,
			title: 'Policies',
			description: 'Terms, conditions, and guidelines',
			articles: [
				'Cancellation policies',
				'Community guidelines',
				'Privacy policy explained',
				'Terms of service'
			]
		}
	];

	const popularQuestions = [
		{
			question: "How do I book an experience on Rihla?",
			answer: "Browse experiences, select dates and group size, then click 'Reserve'. You'll be guided through the payment process."
		},
		{
			question: "What payment methods do you accept?",
			answer: "We accept major credit cards, debit cards, and PayPal. All payments are processed securely."
		},
		{
			question: "Can I cancel my booking?",
			answer: "Yes, cancellation policies vary by experience. Check the specific policy on your booking confirmation."
		},
		{
			question: "How do I contact my host?",
			answer: "After booking, you can message your host directly through the Rihla messaging system."
		},
		{
			question: "What if I need to change my booking dates?",
			answer: "Contact your host through messages to discuss date changes. Availability and policies may apply."
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
					<p className="text-xl text-gray-600 mb-8">Find answers to your questions or get in touch with our support team</p>
          
					{/* Search */}
					<div className="max-w-2xl mx-auto relative">
						<div className="relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
							<Input
								type="text"
								placeholder="Search for help articles..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-12 py-4 text-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
							/>
						</div>
					</div>
				</div>

				{/* Quick Contact */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<Card className="text-center p-6 hover:shadow-lg transition-shadow">
						<MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">Live Chat</h3>
						<p className="text-gray-600 mb-4">Get instant help from our support team</p>
						<Button className="rihla-gradient-primary">Start Chat</Button>
					</Card>
          
					<Card className="text-center p-6 hover:shadow-lg transition-shadow">
						<Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
						<h3 className="text-lg font-semibold mb-2">Email Support</h3>
						<p className="text-gray-600 mb-4">Send us your questions anytime</p>
						<Button variant="outline">contact@rihlamaroc.net</Button>
					</Card>
				</div>

				{/* FAQ Categories */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-8">Browse help topics</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{faqCategories.map((category, index) => (
							<Card key={index} className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
								<div className="flex items-center mb-4">
									<category.icon className="h-8 w-8 text-green-600 mr-3" />
									<div>
										<h3 className="text-lg font-semibold">{category.title}</h3>
										<p className="text-sm text-gray-600">{category.description}</p>
									</div>
								</div>
								<ul className="space-y-2">
									{category.articles.map((article, articleIndex) => (
										<li key={articleIndex} className="flex items-center text-sm text-gray-700 hover:text-green-600 cursor-pointer">
											<ChevronRight className="h-4 w-4 mr-2" />
											{article}
										</li>
									))}
								</ul>
							</Card>
						))}
					</div>
				</div>

				{/* Popular Questions */}
				<div className="mb-12">
					<h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently asked questions</h2>
					<div className="space-y-4">
						{popularQuestions.map((item, index) => (
							<Card key={index}>
								<CardHeader>
									<CardTitle className="text-lg">{item.question}</CardTitle>
								</CardHeader>
								<CardContent>
									<p className="text-gray-600">{item.answer}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				{/* Support Hours */}
				<Card className="p-8 text-center bg-green-50 border-green-200">
					<Clock className="h-12 w-12 text-green-600 mx-auto mb-4" />
					<h3 className="text-xl font-semibold mb-2">Support Hours</h3>
					<p className="text-gray-600 mb-4">Our support team is available to help you</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
						<div>
							<p className="font-medium">Monday - Friday</p>
							<p className="text-gray-600">9:00 AM - 6:00 PM (GMT)</p>
						</div>
						<div>
							<p className="font-medium">Weekend</p>
							<p className="text-gray-600">10:00 AM - 4:00 PM (GMT)</p>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
};

export default Help;
