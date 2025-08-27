import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Image as ImageIcon,
  Plus,
  X
} from 'lucide-react';
import { categories, moroccanCities } from '../data/mock';
import { useToast } from '../hooks/use-toast';

const CreateExperience = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    price: '',
    duration: '',
    groupSize: '',
    highlights: [''],
    images: []
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, '']
    }));
  };

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const handleHighlightChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((highlight, i) => 
        i === index ? value : highlight
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Experience created!",
        description: "Your experience has been successfully created and is now live.",
      });
      setLoading(false);
      navigate('/host-dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Experience</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Tell us about your experience</CardTitle>
            <p className="text-gray-600">Share the details that will help travelers discover your unique offering.</p>
          </CardHeader>

          <CardContent className="space-y-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Experience Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Desert Safari in Sahara with Berber Family"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Select value={formData.location} onValueChange={(value) => handleChange('location', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {moroccanCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              {city}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your experience in detail. What makes it special? What will guests do? What should they expect?"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Logistics */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="price">Price per person (MAD) *</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="price"
                        type="number"
                        placeholder="120"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration *</Label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="duration"
                        placeholder="3 days"
                        value={formData.duration}
                        onChange={(e) => handleChange('duration', e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="groupSize">Max group size *</Label>
                    <div className="relative mt-1">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="groupSize"
                        type="number"
                        placeholder="8"
                        value={formData.groupSize}
                        onChange={(e) => handleChange('groupSize', e.target.value)}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Experience Highlights</h3>
                
                <div className="space-y-3">
                  <Label>What's included/featured? *</Label>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Highlight ${index + 1} (e.g., Camel trekking)`}
                        value={highlight}
                        onChange={(e) => handleHighlightChange(index, e.target.value)}
                        required={index === 0}
                        className="flex-1"
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveHighlight(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddHighlight}
                    className="flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add highlight</span>
                  </Button>
                </div>
              </div>

              {/* Images */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Photos</h3>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Add photos of your experience</h4>
                  <p className="text-gray-600 mb-4">Upload high-quality photos that showcase what guests will experience</p>
                  <Button type="button" variant="outline">
                    Choose files
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG up to 10MB each. Minimum 3 photos required.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={loading}
                >
                  Save as Draft
                </Button>
                <Button 
                  type="submit"
                  className="rihla-gradient-primary px-8"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Publish Experience'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateExperience;