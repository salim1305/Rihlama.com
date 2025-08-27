import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Calendar, MapPin, Star, Users, Heart, MessageCircle, Settings, Plus, Eye } from 'lucide-react';
import { mockUser, mockBookings, mockExperiences, mockMessages } from '../data/mock';

// ...existing code...
function Dashboard() {
	const navigate = useNavigate();
	// ...existing code...
	const [bookings, setBookings] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [messages, setMessages] = useState([]);
	const [activeTab, setActiveTab] = useState('bookings');

	useEffect(() => {
		// Simulate API calls
		setBookings(mockBookings);
		setFavorites(mockExperiences.slice(0, 2));
		setMessages(mockMessages);
	}, []);

	const BookingCard = ({ booking }) => (
		<Card className="cursor-pointer hover:shadow-lg transition-shadow">
			<CardContent className="p-6">
				<div className="flex items-start space-x-4">
					<div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
						<img
							src={booking.experience.images[0]}
							alt={booking.experience.title}
							className="w-full h-full object-cover"
						/>
					</div>
					<div className="flex-1 min-w-0">
						<div className="flex items-start justify-between mb-2">
							<h3 className="font-semibold text-gray-900 truncate">
								{booking.experience.title}
							</h3>
							<Badge 
								variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
								className={booking.status === 'confirmed' ? 'bg-orange-100 text-orange-800' : ''}
							>
								{booking.status}
							</Badge>
						</div>
			
						<div className="space-y-1 text-sm text-gray-600">
							<div className="flex items-center">
								<MapPin className="h-3 w-3 mr-1" />
								<span>{booking.experience.location}</span>
							</div>
							<div className="flex items-center">
								<Calendar className="h-3 w-3 mr-1" />
								<span>{new Date(booking.checkIn).toLocaleDateString()}</span>
								{booking.checkOut !== booking.checkIn && (
									<span> - {new Date(booking.checkOut).toLocaleDateString()}</span>
								)}
							</div>
							<div className="flex items-center">
								<Users className="h-3 w-3 mr-1" />
								<span>{booking.guests} guests</span>
							</div>
						</div>

						<div className="flex items-center justify-between mt-4">
							<span className="font-semibold text-gray-900">
								${booking.totalPrice}
							</span>
							<div className="flex space-x-2">
								<Button size="sm" variant="outline">
									<Eye className="h-3 w-3 mr-1" />
									View
								</Button>
								<Button size="sm" variant="outline">
									<MessageCircle className="h-3 w-3 mr-1" />
									Message
								</Button>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);

	const FavoriteCard = ({ experience }) => (
		<Card className="cursor-pointer hover:shadow-lg transition-shadow">
			<div className="relative">
				<div className="h-48 rounded-t-lg overflow-hidden">
					<img
						src={experience.images[0]}
						alt={experience.title}
						className="w-full h-full object-cover"
					/>
				</div>
				<button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
					<Heart className="h-4 w-4 text-red-500 fill-current" />
				</button>
			</div>
	  
			<CardContent className="p-4">
				<div className="flex items-start justify-between mb-2">
					<div className="flex items-center text-sm text-gray-600 mb-1">
						<MapPin className="h-3 w-3 mr-1" />
						<span>{experience.location}</span>
					</div>
					<div className="flex items-center">
						<Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
						<span className="text-sm font-medium">{experience.rating}</span>
					</div>
				</div>

				<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
					{experience.title}
				</h3>

				<div className="flex items-center justify-between">
					<span className="font-bold text-gray-900">${experience.price}</span>
					<Button size="sm" className="rihla-gradient-primary">
						Book now
					</Button>
				</div>
			</CardContent>
		</Card>
	);

	const MessageCard = ({ message }) => (
		<Card className="cursor-pointer hover:shadow-md transition-shadow">
			<CardContent className="p-4">
				<div className="flex items-start space-x-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src="/api/placeholder/40/40" alt={message.senderName} />
						<AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-1">
							<h4 className="font-medium text-gray-900 truncate">
								{message.senderName}
							</h4>
							<span className="text-xs text-gray-500">
								{new Date(message.timestamp).toLocaleDateString()}
							</span>
						</div>
						<p className="text-sm text-gray-600 line-clamp-2">
							{message.lastMessage}
						</p>
						{message.unread && (
							<Badge className="mt-2 bg-orange-100 text-orange-800 text-xs">
								New
							</Badge>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);

	// If you use user data, make sure to define it
	const user = mockUser;

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Header */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							Welcome back, {user.name}!
						</h1>
						<p className="text-gray-600">Manage your trips and explore new experiences</p>
					</div>
					<div className="flex items-center space-x-3 mt-4 md:mt-0">
						<Button variant="outline" onClick={() => navigate('/search')}>
							<Plus className="h-4 w-4 mr-2" />
							Book new experience
						</Button>
						<Button variant="outline" onClick={() => navigate('/settings')}>
							<Settings className="h-4 w-4 mr-2" />
							Settings
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Total Bookings</p>
									<p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
								</div>
								<Calendar className="h-8 w-8 text-orange-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Favorites</p>
									<p className="text-2xl font-bold text-gray-900">{favorites.length}</p>
								</div>
								<Heart className="h-8 w-8 text-red-500" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Messages</p>
									<p className="text-2xl font-bold text-gray-900">{messages.length}</p>
								</div>
								<MessageCircle className="h-8 w-8 text-blue-600" />
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardContent className="p-6">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-gray-600">Member Since</p>
									<p className="text-lg font-bold text-gray-900">Jan 2023</p>
								</div>
								<Star className="h-8 w-8 text-yellow-500" />
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Main Content */}
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-3 mb-6">
						<TabsTrigger value="bookings">My Bookings</TabsTrigger>
						<TabsTrigger value="favorites">Favorites</TabsTrigger>
						<TabsTrigger value="messages">Messages</TabsTrigger>
					</TabsList>

					<TabsContent value="bookings">
						<Card>
							<CardHeader>
								<CardTitle>Your Bookings</CardTitle>
							</CardHeader>
							<CardContent>
								{bookings.length > 0 ? (
									<div className="space-y-4">
										{bookings.map((booking) => (
											<BookingCard key={booking.id} booking={booking} />
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
										<p className="text-gray-600 mb-6">Start exploring amazing experiences in Morocco!</p>
										<Button onClick={() => navigate('/search')} className="rihla-gradient-primary">
											Explore experiences
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="favorites">
						<Card>
							<CardHeader>
								<CardTitle>Your Favorites</CardTitle>
							</CardHeader>
							<CardContent>
								{favorites.length > 0 ? (
									<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
										{favorites.map((experience) => (
											<FavoriteCard key={experience.id} experience={experience} />
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
										<p className="text-gray-600 mb-6">Save experiences you love to book them later!</p>
										<Button onClick={() => navigate('/search')} className="rihla-gradient-primary">
											Find experiences
										</Button>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>

					<TabsContent value="messages">
						<Card>
							<CardHeader>
								<CardTitle>Recent Messages</CardTitle>
							</CardHeader>
							<CardContent>
								{messages.length > 0 ? (
									<div className="space-y-3">
										{messages.map((message) => (
											<MessageCard key={message.id} message={message} />
										))}
									</div>
								) : (
									<div className="text-center py-12">
										<MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
										<h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
										<p className="text-gray-600">Messages with hosts will appear here</p>
									</div>
								)}
							</CardContent>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

// Exportation par défaut unique
export default Dashboard;
