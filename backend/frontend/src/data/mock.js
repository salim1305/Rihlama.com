// Mock data for Rihla platform

export const mockExperiences = [
  {
    id: '1',
    title: 'Desert Safari in Sahara with Berber Family',
    location: 'Merzouga, Morocco',
    price: 120,
    rating: 4.8,
    reviewCount: 147,
    images: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f1e?w=800',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800'
    ],
    host: {
      id: 'host1',
      name: 'Ahmed Ben Ali',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      superhost: true
    },
    duration: '3 days',
    groupSize: 8,
    description: 'Experience the magic of the Sahara Desert with our authentic Berber family. Sleep under the stars, ride camels, and enjoy traditional music around the campfire.',
    highlights: ['Camel trekking', 'Traditional Berber camp', 'Stargazing', 'Local cuisine'],
    category: 'adventure'
  },
  {
    id: '2',
    title: 'Traditional Riad in Marrakech Medina',
    location: 'Marrakech, Morocco',
    price: 85,
    rating: 4.9,
    reviewCount: 203,
    images: [
      'https://images.unsplash.com/photo-1544718985-5d4185278e1b?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'
    ],
    host: {
      id: 'host2',
      name: 'Fatima Zahra',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100',
      superhost: true
    },
    duration: 'Per night',
    groupSize: 4,
    description: 'Stay in an authentic 16th-century riad in the heart of Marrakech medina. Beautiful traditional architecture with modern amenities.',
    highlights: ['Rooftop terrace', 'Traditional breakfast', 'Central location', 'Authentic architecture'],
    category: 'accommodation'
  },
  {
    id: '3',
    title: 'Blue City Walking Tour & Local Crafts',
    location: 'Chefchaouen, Morocco',
    price: 45,
    rating: 4.7,
    reviewCount: 89,
    images: [
      'https://images.unsplash.com/photo-1539650116574-75c0c6d73f1e?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800'
    ],
    host: {
      id: 'host3',
      name: 'Youssef Alami',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      superhost: false
    },
    duration: '4 hours',
    groupSize: 12,
    description: 'Explore the enchanting blue streets of Chefchaouen with a local guide. Learn about traditional crafts and enjoy mint tea with locals.',
    highlights: ['Local guide', 'Craft workshops', 'Mint tea', 'Photography spots'],
    category: 'tour'
  },
  {
    id: '4',
    title: 'Moroccan Cooking Class in Fes',
    location: 'Fes, Morocco',
    price: 65,
    rating: 4.9,
    reviewCount: 156,
    images: [
      'https://images.unsplash.com/photo-1544718985-5d4185278e1b?w=800',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    ],
    host: {
      id: 'host4',
      name: 'Aicha Benali',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      superhost: true
    },
    duration: '5 hours',
    groupSize: 6,
    description: 'Learn to cook authentic Moroccan dishes in a traditional home. Shop at local markets and prepare a full feast.',
    highlights: ['Market visit', 'Traditional recipes', 'Family meal', 'Take recipes home'],
    category: 'experience'
  }
];

export const mockUser = {
  id: 'user1',
  name: 'Sarah Johnson',
  email: 'sarah@example.com',
  avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100',
  isHost: false,
  joinDate: '2023-01-15',
  reviewsCount: 12,
  rating: 4.8
};

export const mockHost = {
  id: 'host1',
  name: 'Ahmed Ben Ali',
  email: 'ahmed@example.com',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  isHost: true,
  superhost: true,
  joinDate: '2021-03-10',
  reviewsCount: 147,
  rating: 4.9,
  experiencesCount: 3,
  responseRate: 98,
  languages: ['Arabic', 'French', 'English']
};

export const mockBookings = [
  {
    id: 'booking1',
    experienceId: '1',
    experience: mockExperiences[0],
    status: 'confirmed',
    checkIn: '2024-08-15',
    checkOut: '2024-08-18',
    guests: 2,
    totalPrice: 240,
    bookingDate: '2024-07-10'
  },
  {
    id: 'booking2',
    experienceId: '3',
    experience: mockExperiences[2],
    status: 'pending',
    checkIn: '2024-09-05',
    checkOut: '2024-09-05',
    guests: 1,
    totalPrice: 45,
    bookingDate: '2024-07-20'
  }
];

export const mockMessages = [
  {
    id: 'msg1',
    senderId: 'user1',
    receiverId: 'host1',
    senderName: 'Sarah Johnson',
    receiverName: 'Ahmed Ben Ali',
    lastMessage: 'Thanks for the amazing desert experience! It was unforgettable.',
    timestamp: '2024-07-25T10:30:00Z',
    unread: false,
    experienceId: '1'
  },
  {
    id: 'msg2',
    senderId: 'host3',
    receiverId: 'user1',
    senderName: 'Youssef Alami',
    receiverName: 'Sarah Johnson',
    lastMessage: 'Looking forward to showing you around Chefchaouen!',
    timestamp: '2024-07-20T15:45:00Z',
    unread: true,
    experienceId: '3'
  }
];

export const mockReviews = [
  {
    id: 'review1',
    userId: 'user1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b647?w=100',
    experienceId: '1',
    rating: 5,
    comment: 'Absolutely incredible experience! Ahmed and his family were so welcoming and the desert was breathtaking.',
    date: '2024-07-20',
    helpful: 12
  },
  {
    id: 'review2',
    userId: 'user2',
    userName: 'Mike Chen',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    experienceId: '1',
    rating: 5,
    comment: 'Perfect blend of adventure and cultural immersion. The camel ride and traditional food were highlights.',
    date: '2024-07-15',
    helpful: 8
  }
];

export const categories = [
  { id: 'adventure', name: 'Adventure', icon: '🏔️' },
  { id: 'tour', name: 'Tours', icon: '🚶' },
  { id: 'experience', name: 'Experiences', icon: '🎭' },
  { id: 'food', name: 'Food & Drink', icon: '🍽️' },
  { id: 'culture', name: 'Culture', icon: '🕌' },
  { id: 'workshop', name: 'Workshops', icon: '🎨' }
];

export const moroccanCities = [
  'Marrakech',
  'Casablanca', 
  'Fes',
  'Chefchaouen',
  'Essaouira',
  'Merzouga',
  'Ouarzazate',
  'Tangier',
  'Rabat',
  'Agadir'
];