import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { FileText, Users, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react';

const Terms = () => {
	const sections = [
		{
			icon: Users,
			title: 'User Accounts and Responsibilities',
			content: [
				'You must be at least 18 years old to create an account',
				'Provide accurate and complete information during registration',
				'Maintain the security of your account credentials',
				'You are responsible for all activities under your account',
				'Notify us immediately of any unauthorized use of your account'
			]
		},
		{
			icon: FileText,
			title: 'Booking and Cancellation',
			content: [
				'All bookings are subject to host approval and availability',
				'Cancellation policies vary by experience and are set by hosts',
				'Refunds are processed according to the applicable cancellation policy',
				'Rihla reserves the right to cancel bookings in exceptional circumstances',
				'No-shows may result in forfeiture of the full booking amount'
			]
		},
		{
			icon: CreditCard,
			title: 'Payments and Fees',
			content: [
				'All prices are listed in the local currency (MAD) unless otherwise specified',
				'Payment is required at the time of booking confirmation',
				'Service fees may apply and will be clearly displayed before payment',
				'We use secure third-party payment processors',
				'Hosts are responsible for their own tax obligations'
			]
		},
		{
			icon: Shield,
			title: 'User Conduct and Prohibited Activities',
			content: [
				'Treat all users with respect and courtesy',
				'Do not engage in discriminatory or harassing behavior',
				'Provide honest and accurate reviews and ratings',
				'Do not use the platform for illegal activities',
				'Respect intellectual property rights of others'
			]
		},
		{
			icon: AlertTriangle,
			title: 'Safety and Liability',
			content: [
				'Participate in experiences at your own risk',
				'Follow all safety guidelines provided by hosts',
				'Rihla is not liable for accidents or incidents during experiences',
				'We recommend obtaining appropriate travel insurance',
				'Report any safety concerns immediately to our support team'
			]
		},
		{
			icon: Scale,
			title: 'Dispute Resolution',
			content: [
				'We encourage users to resolve disputes directly when possible',
				'Contact our support team for mediation assistance',
				'Disputes will be governed by Moroccan law',
				'Legal proceedings must be conducted in Moroccan courts',
				'We may suspend accounts pending dispute resolution'
			]
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto mb-4">
						These terms govern your use of Rihla's platform and services. Please read them carefully.
					</p>
					<p className="text-sm text-gray-500">Last updated: January 2024</p>
				</div>

				{/* Introduction */}
				<Card className="mb-8 p-6 bg-blue-50 border-blue-200">
					<div className="flex items-start space-x-4">
						<FileText className="h-8 w-8 text-blue-600 mt-1" />
						<div>
							<h2 className="text-xl font-semibold text-blue-800 mb-2">Welcome to Rihla</h2>
							<p className="text-blue-700">
								By using our platform, you agree to these terms of service. Rihla connects travelers with authentic 
								Moroccan experiences hosted by local guides and cultural experts. These terms ensure a safe and 
								enjoyable experience for everyone in our community.
							</p>
						</div>
					</div>
				</Card>

				{/* Terms Sections */}
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

				{/* Host Terms */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>Host-Specific Terms</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-700 font-medium">
								If you're hosting experiences on Rihla, you also agree to:
							</p>
							<ul className="space-y-2 ml-4">
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Provide accurate descriptions of your experiences</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Maintain appropriate licenses and insurance as required</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Ensure the safety and security of your guests</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Comply with local laws and regulations</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Pay applicable taxes on income earned through the platform</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Intellectual Property */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>Intellectual Property</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-700">
								The Rihla platform, including its design, functionality, and content, is protected by intellectual property laws:
							</p>
							<ul className="space-y-2 ml-4">
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>You may not copy, reproduce, or distribute our content without permission</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>User-generated content remains owned by the user but grants us usage rights</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>We respect the intellectual property rights of others</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Report any copyright infringement to our designated agent</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Platform Changes */}
				<Card className="mt-8">
					<CardHeader>
						<CardTitle>Platform Modifications and Termination</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<p className="text-gray-700">
								We reserve the right to modify or discontinue our services:
							</p>
							<ul className="space-y-2 ml-4">
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>We may update features, policies, or terms with reasonable notice</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>We can suspend or terminate accounts for violations of these terms</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>You may close your account at any time through your settings</span>
								</li>
								<li className="flex items-start space-x-2">
									<span className="text-green-600">•</span>
									<span>Certain provisions survive account termination</span>
								</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* Contact Information */}
				<Card className="mt-8 p-6 bg-green-50 border-green-200">
					<h3 className="text-lg font-semibold text-green-800 mb-3">Questions About These Terms?</h3>
					<p className="text-green-700 mb-4">
						If you have questions or concerns about these terms of service, please contact us:
					</p>
					<div className="space-y-2 text-green-700">
						<p><strong>Email:</strong> legal@rihlamaroc.net</p>
						<p><strong>Address:</strong> Rihla Legal Team, 123 Avenue Mohammed V, Marrakech 40000, Morocco</p>
					</div>
				</Card>

				{/* Agreement */}
				<Card className="mt-8 p-6 bg-yellow-50 border-yellow-200">
					<div className="flex items-start space-x-4">
						<AlertTriangle className="h-6 w-6 text-yellow-600 mt-1" />
						<div>
							<h3 className="text-lg font-semibold text-yellow-800 mb-2">Your Agreement</h3>
							<p className="text-yellow-700">
								By continuing to use Rihla, you acknowledge that you have read, understood, and agree to be bound by these 
								terms of service. If you do not agree with any part of these terms, please discontinue use of our platform.
							</p>
						</div>
					</div>
				</Card>

				{/* Footer */}
				<div className="mt-12 text-center">
					<div className="space-x-4">
						<a href="/privacy" className="text-green-600 hover:text-green-500 font-medium">
							Privacy Policy
						</a>
						<span className="text-gray-300">|</span>
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

export default Terms;
