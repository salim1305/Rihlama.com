import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  Star, 
  MapPin, 
  Users, 
  Clock,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { categories, moroccanCities } from '../data/mock';
import experienceService from '../services/experienceService';
import { useToast } from '../hooks/use-toast';
import { useTranslation } from '../hooks/useTranslation';

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [featuredExperiences, setFeaturedExperiences] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedExperiences = async () => {
      try {
        setLoading(true);
        const experiences = await experienceService.getFeaturedExperiences(4);
        setFeaturedExperiences(experiences);
        
        // Initialize image indices
        const initialIndices = {};
        experiences.forEach(exp => {
          initialIndices[exp.id] = 0;
        });
        setCurrentImageIndex(initialIndices);
      } catch (error) {
        console.error('Failed to fetch featured experiences:', error);
        toast({
          title: t('errors.networkError'),
          description: t('errors.networkErrorDesc'),
          variant: "destructive",
        });
        // Fallback to empty array on error
        setFeaturedExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedExperiences();
  }, [toast]);

  const nextImage = (experienceId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [experienceId]: (prev[experienceId] + 1) % totalImages
    }));
  };

  const prevImage = (experienceId, totalImages) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [experienceId]: prev[experienceId] === 0 ? totalImages - 1 : prev[experienceId] - 1
    }));
  };

  const ExperienceCard = ({ experience }) => {
    const currentIndex = currentImageIndex[experience.id] || 0;
    
    return (
      <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative">
          <div className="relative h-64 overflow-hidden">
            <img
              src={experience.images[currentIndex]}
              alt={experience.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            
            {/* Heart button */}
            <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
              <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
            </button>

            {/* Image navigation */}
            {experience.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage(experience.id, experience.images.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage(experience.id, experience.images.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white transition-colors opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
                  {experience.images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {experience.host?.superhost && (
              <Badge className="absolute top-3 left-3 bg-white text-gray-900 hover:bg-white">
                Superhost
              </Badge>
            )}
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
                <span className="text-sm text-gray-500 ml-1">({experience.reviewsCount || experience.reviewCount || 0})</span>
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
                  <span>{t('home.upTo')} {experience.maxGroupSize || experience.groupSize || 1}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-gray-900">{experience.price} MAD</span>
                <span className="text-sm text-gray-600 ml-1">{t('common.perPerson')}</span>
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                {experience.category}
              </Badge>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center bg-gradient-to-r from-green-50 to-teal-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539650116574-75c0c6d73f1e?w=1920')] bg-cover bg-center">
          <div className="absolute inset-0 rihla-gradient-hero opacity-80" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-green-200 to-teal-200 bg-clip-text text-transparent">
              {t('home.heroTitle')}
            </span>
            <span className="block bg-gradient-to-r from-green-200 to-teal-200 bg-clip-text text-transparent">
              {t('home.heroSubtitle')}
            </span>
          </h1>
          <p className="text-xl text-green-50 mb-8 max-w-2xl mx-auto">
            {t('home.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 text-lg"
              onClick={() => navigate('/search')}
            >
              <Search className="mr-2 h-5 w-5" />
              {t('home.startExploring')}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-3 text-lg"
              onClick={() => navigate('/host')}
            >
              Become a host
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {t('home.exploreByCategory')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border-gray-200 hover:border-green-200"
                onClick={() => navigate(`/search?category=${category.id}`)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900">{t(`categories.${category.id}`)}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {t('home.featuredExperiences')}
            </h2>
            <Button 
              variant="outline" 
              onClick={() => navigate('/search')}
              className="hover:bg-green-50 hover:text-green-600 hover:border-green-200"
            >
              {t('home.viewAll')}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-200" />
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : featuredExperiences.length > 0 ? (
              featuredExperiences.map((experience) => (
                <div 
                  key={experience.id} 
                  onClick={() => navigate(`/experience/${experience.id}`)}
                >
                  <ExperienceCard experience={experience} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg mb-4">No featured experiences available at the moment.</p>
                <Button onClick={() => navigate('/search')} variant="outline">
                  Browse all experiences
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Destinations */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {t('home.popularDestinations')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {moroccanCities.slice(0, 10).map((city, index) => (
              <Card 
                key={city} 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:border-green-200"
                onClick={() => navigate(`/search?destination=${city}`)}
              >
                <CardContent className="p-4 text-center">
                  <h3 className="font-semibold text-gray-900">{city}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 rihla-gradient-primary">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('home.readyToStart')}
          </h2>
          <p className="text-xl text-green-100 mb-8">
            {t('home.joinTravelers')}
          </p>
          <Button 
            size="lg" 
            className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 text-lg"
            onClick={() => navigate('/register')}
          >
            {t('home.getStarted')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;