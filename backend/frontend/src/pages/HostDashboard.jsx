import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { 
  Plus,
  TrendingUp,
  Calendar,
  Star,
  Users,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Clock,
  DollarSign,
  MessageCircle,
  Award,
  Home
} from 'lucide-react';
import { mockExperiences, mockHost, mockBookings } from '../data/mock';

const HostDashboard = () => {
  const navigate = useNavigate();
  const [hostData, setHostData] = useState(mockHost);
  const [hostExperiences, setHostExperiences] = useState([]);
  const [hostBookings, setHostBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulate API calls for host data
    setHostExperiences(mockExperiences.slice(0, 3)); // Host's experiences
    setHostBookings(mockBookings); // Host's bookings
  }, []);

  const stats = {
    totalEarnings: 2850,
    totalBookings: hostBookings.length,
    avgRating: hostData.rating,
    responseRate: hostData.responseRate
  };

  const ExperienceCard = ({ experience }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        <div className="h-48 rounded-t-lg overflow-hidden">
          <img
            src={experience.images[0]}
            alt={experience.title}
            className="w-full h-full object-cover"
          />
        </div>
        <Badge 
          className="absolute top-3 right-3 bg-white text-gray-900"
          variant="secondary"
        >
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

        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
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
          <div className="flex space-x-1">
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="outline">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const BookingCard = ({ booking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-gray-900">{booking.experience.title}</h4>
            <p className="text-sm text-gray-600">Guest: Sarah Johnson</p>
          </div>
          <Badge 
            variant={booking.status === 'confirmed' ? 'default' : 'secondary'}
            className={booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : ''}
          >
            {booking.status}
          </Badge>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div className="flex items-center justify-between">
            <span>Date:</span>
            <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Guests:</span>
            <span className="font-medium">{booking.guests}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Total:</span>
            <span className="font-medium">{booking.totalPrice} MAD</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button size="sm" variant="outline" className="flex-1">
            <MessageCircle className="h-3 w-3 mr-1" />
            Message
          </Button>
          <Button size="sm" className="flex-1">
            View details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={hostData.avatar} alt={hostData.name} />
              <AvatarFallback className="text-lg">{hostData.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome, {hostData.name}!
                </h1>
                {hostData.superhost && (
                  <Badge className="bg-orange-100 text-orange-800">
                    <Award className="h-3 w-3 mr-1" />
                    Superhost
                  </Badge>
                )}
              </div>
              <p className="text-gray-600">Host since {new Date(hostData.joinDate).getFullYear()}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <Button onClick={() => navigate('/create-experience')}>
              <Plus className="h-4 w-4 mr-2" />
              Create experience
            </Button>
            <Button variant="outline" onClick={() => navigate('/host-resources')}>
              <Home className="h-4 w-4 mr-2" />
              Host resources
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalEarnings} MAD</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Response Rate</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.responseRate}%</p>
                </div>
                <MessageCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experiences">My Experiences</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {hostBookings.slice(0, 3).map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Performance Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">This month's earnings</p>
                        <p className="text-2xl font-bold text-gray-900">12,500 MAD</p>
                      </div>
                      <div className="flex items-center text-green-600">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">+12%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">New reviews</p>
                        <p className="text-2xl font-bold text-gray-900">8</p>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm font-medium">4.9 avg</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Profile views</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                      </div>
                      <div className="flex items-center text-blue-600">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="text-sm font-medium">+28%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="experiences">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Your Experiences</CardTitle>
                <Button onClick={() => navigate('/create-experience')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add new experience
                </Button>
              </CardHeader>
              <CardContent>
                {hostExperiences.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostExperiences.map((experience) => (
                      <ExperienceCard key={experience.id} experience={experience} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No experiences yet</h3>
                    <p className="text-gray-600 mb-6">Start sharing your unique experiences with travelers!</p>
                    <Button onClick={() => navigate('/create-experience')}>
                      Create your first experience
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                {hostBookings.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hostBookings.map((booking) => (
                      <BookingCard key={booking.id} booking={booking} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600">Bookings will appear here once guests start booking your experiences.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                      <p>Earnings chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Calendar className="h-12 w-12 mx-auto mb-4" />
                      <p>Booking trends chart coming soon</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HostDashboard;