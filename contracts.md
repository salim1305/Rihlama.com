# Rihla Platform - API Contracts & Backend Integration Guide

## 🎯 Project Overview
Rihla is a Moroccan travel services and booking platform connecting travelers with authentic local experiences. This document outlines the API contracts and integration strategy between the React frontend and FastAPI backend.

## 📋 Current Mock Data Implementation

### Frontend Mock Data (mock.js)
The frontend currently uses comprehensive mock data including:
- **Experiences**: 4 sample Moroccan experiences (desert safari, riad stay, walking tour, cooking class)
- **Users**: Sample traveler and host profiles
- **Bookings**: Booking history and status tracking
- **Messages**: Conversation threads between guests and hosts
- **Reviews**: User reviews and ratings

## 🔌 API Endpoints to Implement

### Authentication Endpoints
```
POST /api/auth/register
POST /api/auth/login  
POST /api/auth/logout
GET /api/auth/me
POST /api/auth/refresh
```

### User Management
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/{user_id}
```

### Experience Management
```
GET /api/experiences - List all experiences
GET /api/experiences/{id} - Get experience details
POST /api/experiences - Create new experience (hosts)
PUT /api/experiences/{id} - Update experience
DELETE /api/experiences/{id} - Delete experience
GET /api/experiences/search - Search with filters
```

### Booking System
```
POST /api/bookings - Create new booking
GET /api/bookings - Get user's bookings
GET /api/bookings/{id} - Get booking details
PUT /api/bookings/{id}/status - Update booking status
DELETE /api/bookings/{id} - Cancel booking
```

### Messaging System
```
GET /api/messages/conversations - Get user's conversations
GET /api/messages/conversations/{id} - Get conversation messages
POST /api/messages - Send new message
PUT /api/messages/{id}/read - Mark message as read
```

### Reviews & Ratings
```
GET /api/reviews/experience/{id} - Get experience reviews
POST /api/reviews - Create new review
PUT /api/reviews/{id} - Update review
DELETE /api/reviews/{id} - Delete review
```

## 🗂️ Database Models Required

### User Model
```python
class User(BaseModel):
    id: str
    name: str
    email: str
    avatar: Optional[str]
    is_host: bool = False
    superhost: bool = False
    join_date: datetime
    reviews_count: int = 0
    rating: float = 0.0
```

### Experience Model
```python
class Experience(BaseModel):
    id: str
    title: str
    description: str
    location: str
    price: float
    images: List[str]
    host_id: str
    category: str
    duration: str
    group_size: int
    highlights: List[str]
    rating: float = 0.0
    review_count: int = 0
    created_at: datetime
```

### Booking Model
```python
class Booking(BaseModel):
    id: str
    experience_id: str
    user_id: str
    guests: int
    check_in: date
    check_out: Optional[date]
    status: str  # pending, confirmed, completed, cancelled
    total_price: float
    booking_date: datetime
```

## 🔄 Frontend Integration Strategy

### 1. Replace Mock Data Calls
Current mock imports in components will be replaced with API calls:

```javascript
// Before (mock)
import { mockExperiences } from '../data/mock';

// After (API)
import { getExperiences } from '../api/experiences';
```

### 2. State Management
Implement proper state management for:
- User authentication state
- Loading states during API calls  
- Error handling and user feedback
- Cache management for frequently accessed data

### 3. API Service Layer
Create service modules for each domain:
- `src/api/auth.js`
- `src/api/experiences.js`
- `src/api/bookings.js`
- `src/api/messages.js`
- `src/api/users.js`

### 4. Error Handling
Implement consistent error handling:
- Network errors
- Authentication errors (401/403)
- Validation errors (400)
- Server errors (500)

## 🚀 Implementation Phases

### Phase 1: Authentication & User Management
1. Implement user registration/login backend
2. Replace mock authentication in frontend
3. Add protected routes and auth guards
4. Implement profile management

### Phase 2: Experience Management
1. Build experience CRUD operations
2. Implement search and filtering
3. Add image upload functionality
4. Replace mock experience data

### Phase 3: Booking System
1. Create booking flow backend
2. Implement payment integration (if needed)
3. Add booking status management
4. Replace mock booking data

### Phase 4: Messaging & Reviews
1. Real-time messaging system
2. Review and rating system
3. Notification system
4. Final integration testing

## 📝 Frontend Components Requiring Updates

### Pages with Mock Data Dependencies:
- `Home.jsx` - Featured experiences
- `SearchPage.jsx` - Experience listings and filters
- `ExperienceDetails.jsx` - Experience data and reviews
- `Dashboard.jsx` - User bookings and favorites
- `BookingPage.jsx` - Booking creation
- `Messages.jsx` - Conversation management
- `HostDashboard.jsx` - Host experience and booking management

### Components Needing API Integration:
- `Header.jsx` - User authentication state
- Experience cards throughout the app
- Search and filter components
- Booking forms and status displays

## 🔒 Security Considerations

### Authentication
- JWT token implementation
- Refresh token rotation
- Secure session management

### Authorization  
- Role-based access (traveler vs host)
- Resource ownership validation
- API rate limiting

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- File upload security

## 📊 Data Migration

### Mock to Database Migration:
1. Convert mock data to database seeds
2. Maintain data relationships (users, experiences, bookings)
3. Preserve realistic Moroccan experience data
4. Ensure proper user roles and permissions

## ✅ Testing Strategy

### Backend Testing:
- API endpoint unit tests
- Integration tests for complete flows
- Authentication and authorization tests
- Database operation tests

### Frontend Testing:
- Component integration with API
- Error handling scenarios
- Loading state management
- User flow testing

## 🌐 Deployment Considerations

### Backend Deployment:
- Environment configuration
- Database migrations
- Static file serving (images)
- API versioning strategy

### Frontend Deployment:
- Environment variables for API URLs
- Build optimization
- CDN configuration for assets
- Progressive Web App features

## 📈 Performance Optimization

### Backend Optimization:
- Database query optimization
- Response caching strategies
- Image compression and CDN
- API pagination for large datasets

### Frontend Optimization:
- Lazy loading for images
- Component code splitting
- API response caching
- Infinite scroll for experience lists

---

*This contract serves as the blueprint for seamless integration between Rihla's frontend and backend systems, ensuring a smooth transition from mock data to a fully functional travel platform.*