import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Users, 
  Clock, 
  Heart,
  SlidersHorizontal,
  Grid3X3,
  List
} from 'lucide-react';
import { mockExperiences, categories, moroccanCities } from '../data/mock';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [experiences, setExperiences] = useState([]);
  const [filteredExperiences, setFilteredExperiences] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Get initial category from URL params
    const category = searchParams.get('category');
    const destination = searchParams.get('destination');
    
    setExperiences(mockExperiences);
    
    if (category) {
      setSelectedCategories([category]);
    }
    if (destination) {
      setSelectedCities([destination]);
    }
  }, [searchParams]);

  useEffect(() => {
    // Apply filters
    let filtered = [...experiences];

    if (searchQuery) {
      filtered = filtered.filter(exp => 
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(exp => selectedCategories.includes(exp.category));
    }

    if (selectedCities.length > 0) {
      filtered = filtered.filter(exp => 
        selectedCities.some(city => exp.location.includes(city))
      );
    }

    filtered = filtered.filter(exp => 
      exp.price >= priceRange[0] && exp.price <= priceRange[1] && exp.rating >= minRating
    );

    setFilteredExperiences(filtered);
  }, [experiences, searchQuery, selectedCategories, selectedCities, priceRange, minRating]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleCityChange = (city) => {
    setSelectedCities(prev => 
      prev.includes(city) 
        ? prev.filter(c => c !== city)
        : [...prev, city]
    );
  };

  const ExperienceCard = ({ experience, isListView = false }) => (
    <Card className={`cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${isListView ? 'flex' : ''}`}>
      <div className={`${isListView ? 'w-80 flex-shrink-0' : ''}`}>
        <div className={`relative ${isListView ? 'h-48' : 'h-64'} overflow-hidden ${!isListView ? 'rounded-t-lg' : 'rounded-l-lg'}`}>
          <img
            src={experience.images[0]}
            alt={experience.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors">
            <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
          </button>
          {experience.host.superhost && (
            <Badge className="absolute top-3 left-3 bg-white text-gray-900">
              Superhost
            </Badge>
          )}
        </div>
      </div>
      
      <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
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

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {experience.title}
        </h3>

        {isListView && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {experience.description}
          </p>
        )}

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
          <Badge variant="secondary" className="bg-orange-50 text-orange-700">
            {experience.category}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search experiences, locations, activities..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 hover:border-orange-200"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Results Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {filteredExperiences.length} experiences found
              </h1>
              <p className="text-gray-600">
                {selectedCategories.length > 0 && `In ${selectedCategories.join(', ')} • `}
                {selectedCities.length > 0 && `${selectedCities.join(', ')}`}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'rihla-gradient-primary' : ''}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'rihla-gradient-primary' : ''}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                  </h3>

                  {/* Price Range */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">
                      Price range: {priceRange[0]} MAD - {priceRange[1]} MAD
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={300}
                      step={10}
                      className="w-full"
                    />
                  </div>

                  {/* Categories */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Categories</label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                          />
                          <label htmlFor={category.id} className="text-sm">
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cities */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-3">Destinations</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {moroccanCities.map((city) => (
                        <div key={city} className="flex items-center space-x-2">
                          <Checkbox
                            id={city}
                            checked={selectedCities.includes(city)}
                            onCheckedChange={() => handleCityChange(city)}
                          />
                          <label htmlFor={city} className="text-sm">
                            {city}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium mb-3">
                      Minimum rating: {minRating}+
                    </label>
                    <Slider
                      value={[minRating]}
                      onValueChange={(value) => setMinRating(value[0])}
                      max={5}
                      step={0.1}
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Results Grid */}
          <div className="flex-1">
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-6'
            }>
              {filteredExperiences.map((experience) => (
                <ExperienceCard 
                  key={experience.id} 
                  experience={experience} 
                  isListView={viewMode === 'list'}
                />
              ))}
            </div>

            {filteredExperiences.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms.</p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategories([]);
                    setSelectedCities([]);
                    setPriceRange([0, 200]);
                    setMinRating(0);
                  }}
                  className="mt-4 rihla-gradient-primary"
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;