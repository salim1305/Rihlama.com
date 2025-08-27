import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import { Heart, Star, MapPin, Users, Clock } from 'lucide-react';

const Favorites = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const { toast } = useToast();
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login');
			return;
		}

		// Simulate loading favorites
		setTimeout(() => {
			setFavorites([
				{
					id: '1',
					title: 'Desert Safari in Sahara with Berber Family',
					location: 'Merzouga, Morocco',
					price: 120,
					rating: 4.8,
					reviewCount: 147,
					image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f1e?w=800',
					duration: '3 days',
					groupSize: 8,
					category: 'adventure'
				},
				{
					id: '3',
					title: 'Blue City Walking Tour with Local Guide',
					location: 'Chefchaouen, Morocco',
					price: 45,
					rating: 4.9,
					reviewCount: 89,
					image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
					duration: '4 hours',
					groupSize: 12,
					category: 'tour'
				}
			]);
			setLoading(false);
		}, 1000);
	}, [isAuthenticated, navigate]);

	const removeFavorite = (experienceId) => {
		setFavorites(prev => prev.filter(exp => exp.id !== experienceId));
		toast({
			title: "Removed from favorites",
			description: "Experience removed from your favorites list.",
		});
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{Array.from({ length: 6 }).map((_, index) => (
								<div key={index} className="bg-white rounded-lg overflow-hidden shadow-sm">
									<div className="h-48 bg-gray-200"></div>
									<div className="p-4">
										<div className="h-4 bg-gray-200 rounded mb-2"></div>
										<div className="h-4 bg-gray-200 rounded w-2/3"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900 mb-2">Your Favorites</h1>
					<p className="text-gray-600">Experiences you've saved for later</p>
				</div>

				{favorites.length === 0 ? (
					<div className="text-center py-16">
						<Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
						<h3 className="text-xl font-semibold text-gray-900 mb-2">No favorites yet</h3>
						<p className="text-gray-600 mb-8">Start exploring and save experiences you love</p>
						<Button onClick={() => navigate('/search')} className="rihla-gradient-primary">
							Discover Experiences
						</Button>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{favorites.map((experience) => (
							<Card key={experience.id} className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
								<div className="relative">
									<div className="relative h-48 overflow-hidden">
										<img
											src={experience.image}
											alt={experience.title}
											className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    
										<button
											onClick={(e) => {
												e.stopPropagation();
												removeFavorite(experience.id);
											}}
											className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
										>
											<Heart className="h-4 w-4 text-red-500 fill-current" />
										</button>

										<Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
											{experience.category}
										</Badge>
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
												<span className="text-sm text-gray-500 ml-1">({experience.reviewCount})</span>
											</div>
										</div>

										<h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
											{experience.title}
										</h3>

										<div className="flex items-center justify-between text-sm text-gray-600 mb-3">
											<div className="flex items-center space-x-3">
												<div className="flex items-center">
													<Clock className="h-3 w-3 mr-1" />
													<span>{experience.duration}</span>
												</div>
												<div className="flex items-center">
													<Users className="h-3 w-3 mr-1" />
													<span>Up to {experience.groupSize}</span>
												</div>
											</div>
										</div>

										<div className="flex items-center justify-between">
											<div>
												<span className="text-lg font-bold text-gray-900">{experience.price} MAD</span>
												<span className="text-sm text-gray-600 ml-1">per person</span>
											</div>
											<Button 
												size="sm" 
												onClick={(e) => {
													e.stopPropagation();
													navigate(`/experience/${experience.id}`);
												}}
												className="rihla-gradient-primary"
											>
												View Details
											</Button>
										</div>
									</CardContent>
								</div>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default Favorites;
