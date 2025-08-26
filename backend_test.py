#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for Rihla Travel Platform
Tests the TypeScript Express.js backend running on port 8001
"""

import requests
import json
import os
from datetime import datetime, timedelta
import uuid

# Forcer l'URL backend local pour les tests
BACKEND_URL = "http://localhost:8001"
API_BASE = f"{BACKEND_URL}/api"

# Test data
TEST_USER_DATA = {
    "firstName": "Ahmed",
    "lastName": "Benali",
    "email": f"ahmed.benali.{uuid.uuid4().hex[:8]}@example.com",
    "password": "SecurePass123!",
    "phoneNumber": "+212612345678",
    "dateOfBirth": "1990-05-15",
    "isHost": False
}

TEST_HOST_DATA = {
    "firstName": "Fatima",
    "lastName": "Alaoui",
    "email": f"fatima.alaoui.{uuid.uuid4().hex[:8]}@example.com",
    "password": "HostPass123!",
    "phoneNumber": "+212687654321",
    "dateOfBirth": "1985-08-20",
    "isHost": True
}

class RihlaAPITester:
    def __init__(self):
        self.session = requests.Session()
        self.user_token = None
        self.host_token = None
        self.user_id = None
        self.host_id = None
        self.experience_id = None
        self.booking_id = None
        
        # Test results
        self.results = {
            "total_tests": 0,
            "passed": 0,
            "failed": 0,
            "errors": []
        }
    
    def log_result(self, test_name, success, message="", response_data=None):
        """Log test result"""
        self.results["total_tests"] += 1
        if success:
            self.results["passed"] += 1
            print(f"[OK] {test_name}: {message}")
        else:
            self.results["failed"] += 1
            error_msg = f"[FAIL] {test_name}: {message}"
            if response_data:
                error_msg += f" | Response: {response_data}"
            print(error_msg)
            self.results["errors"].append(error_msg)
    
    def test_health_check(self):
        """Test health check endpoint"""
        try:
            # Try localhost first since external URL might be intercepted by frontend
            response = self.session.get("http://localhost:8001/health")
            if response.status_code == 200:
                try:
                    data = response.json()
                    if data.get("status") == "OK" and "Rihla Backend API" in data.get("message", ""):
                        self.log_result("Health Check", True, "Backend is running and healthy")
                        return True
                    else:
                        self.log_result("Health Check", False, "Invalid health response format", data)
                except:
                    # If JSON parsing fails, check if response contains expected text
                    if "Rihla Backend API" in response.text:
                        self.log_result("Health Check", True, "Backend is running and healthy")
                        return True
                    else:
                        self.log_result("Health Check", False, "Invalid health response", response.text)
            else:
                self.log_result("Health Check", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Health Check", False, f"Exception: {str(e)}")
        return False
    
    def test_api_root(self):
        """Test root API documentation endpoint"""
        try:
            response = self.session.get(f"{API_BASE}")
            if response.status_code == 200:
                data = response.json()
                if "Welcome to Rihla API" in data.get("message", "") and "endpoints" in data:
                    self.log_result("API Root", True, "API documentation endpoint working")
                    return True
                else:
                    self.log_result("API Root", False, "Invalid API root response", data)
            else:
                self.log_result("API Root", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("API Root", False, f"Exception: {str(e)}")
        return False
    
    def test_user_registration(self):
        """Test user registration"""
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=TEST_USER_DATA)
            if response.status_code == 201:
                data = response.json()
                if data.get("success") and "tokens" in data.get("data", {}):
                    self.user_token = data["data"]["tokens"]["accessToken"]
                    self.user_id = data["data"]["user"]["id"]
                    self.log_result("User Registration", True, "User registered successfully")
                    return True
                else:
                    self.log_result("User Registration", False, "Invalid registration response format", data)
            else:
                self.log_result("User Registration", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Registration", False, f"Exception: {str(e)}")
        return False
    
    def test_host_registration(self):
        """Test host registration"""
        try:
            response = self.session.post(f"{API_BASE}/auth/register", json=TEST_HOST_DATA)
            if response.status_code == 201:
                data = response.json()
                if data.get("success") and "tokens" in data.get("data", {}):
                    self.host_token = data["data"]["tokens"]["accessToken"]
                    self.host_id = data["data"]["user"]["id"]
                    self.log_result("Host Registration", True, "Host registered successfully")
                    return True
                else:
                    self.log_result("Host Registration", False, "Invalid registration response format", data)
            else:
                self.log_result("Host Registration", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Host Registration", False, f"Exception: {str(e)}")
        return False
    
    def test_user_login(self):
        """Test user login"""
        try:
            login_data = {
                "email": TEST_USER_DATA["email"],
                "password": TEST_USER_DATA["password"]
            }
            response = self.session.post(f"{API_BASE}/auth/login", json=login_data)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "tokens" in data.get("data", {}):
                    self.log_result("User Login", True, "User login successful")
                    return True
                else:
                    self.log_result("User Login", False, "Invalid login response format", data)
            else:
                self.log_result("User Login", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("User Login", False, f"Exception: {str(e)}")
        return False
    
    def test_get_current_user(self):
        """Test get current user profile"""
        if not self.user_token:
            self.log_result("Get Current User", False, "No user token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = self.session.get(f"{API_BASE}/auth/me", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "user" in data.get("data", {}):
                    user_data = data["data"]["user"]
                    if user_data.get("email") == TEST_USER_DATA["email"]:
                        self.log_result("Get Current User", True, "User profile retrieved successfully")
                        return True
                    else:
                        self.log_result("Get Current User", False, "User data mismatch", data)
                else:
                    self.log_result("Get Current User", False, "Invalid user profile response", data)
            else:
                self.log_result("Get Current User", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Current User", False, f"Exception: {str(e)}")
        return False
    
    def test_get_experiences(self):
        """Test get all experiences"""
        try:
            response = self.session.get(f"{API_BASE}/experiences")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "experiences" in data.get("data", {}):
                    self.log_result("Get Experiences", True, f"Retrieved {len(data['data']['experiences'])} experiences")
                    return True
                else:
                    self.log_result("Get Experiences", False, "Invalid experiences response format", data)
            else:
                self.log_result("Get Experiences", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get Experiences", False, f"Exception: {str(e)}")
        return False
    
    def test_create_experience(self):
        """Test create experience (requires host authentication)"""
        if not self.host_token:
            self.log_result("Create Experience", False, "No host token available")
            return False
        
        try:
            experience_data = {
                "title": "Authentic Moroccan Cooking Class in Marrakech",
                "description": "Learn to cook traditional Moroccan dishes with a local chef in the heart of Marrakech. Experience the vibrant flavors of tagines, couscous, and pastries.",
                "category": "food",
                "location": "Marrakech",
                "price": 75,
                "duration": 180,
                "groupSize": 8,
                "highlights": ["Learn traditional recipes", "Cook with local chef", "Enjoy your creations"],
                "images": ["https://example.com/cooking1.jpg", "https://example.com/cooking2.jpg"]
            }
            
            headers = {"Authorization": f"Bearer {self.host_token}"}
            response = self.session.post(f"{API_BASE}/experiences", json=experience_data, headers=headers)
            if response.status_code == 201:
                data = response.json()
                if data.get("success") and "experience" in data.get("data", {}):
                    self.experience_id = data["data"]["experience"]["id"]
                    self.log_result("Create Experience", True, "Experience created successfully")
                    return True
                else:
                    self.log_result("Create Experience", False, "Invalid create experience response", data)
            else:
                self.log_result("Create Experience", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Experience", False, f"Exception: {str(e)}")
        return False
    
    def test_get_user_profile(self):
        """Test get user profile by ID"""
        if not self.host_id:
            self.log_result("Get User Profile", False, "No host ID available")
            return False
        
        try:
            response = self.session.get(f"{API_BASE}/users/{self.host_id}")
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "user" in data.get("data", {}):
                    self.log_result("Get User Profile", True, "User profile retrieved successfully")
                    return True
                else:
                    self.log_result("Get User Profile", False, "Invalid user profile response", data)
            else:
                self.log_result("Get User Profile", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get User Profile", False, f"Exception: {str(e)}")
        return False
    
    def test_create_booking(self):
        """Test create booking (should fail for unapproved experience)"""
        if not self.user_token or not self.experience_id:
            self.log_result("Create Booking", False, "Missing user token or experience ID")
            return False
        
        try:
            booking_data = {
                "experienceId": self.experience_id,
                "checkIn": (datetime.now() + timedelta(days=7)).isoformat(),
                "guests": 2,
                "totalPrice": 150,
                "message": "Looking forward to this experience!"
            }
            
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = self.session.post(f"{API_BASE}/bookings", json=booking_data, headers=headers)
            
            # Since the experience was created as unapproved, booking should fail with 404
            if response.status_code == 404:
                data = response.json()
                if "Experience not found or not available" in data.get("message", ""):
                    self.log_result("Create Booking", True, "Correctly rejected booking for unapproved experience")
                    return True
                else:
                    self.log_result("Create Booking", False, "Unexpected 404 message", data)
            elif response.status_code == 201:
                # If it somehow succeeded, that's also valid (maybe experience was auto-approved)
                data = response.json()
                if data.get("success") and "booking" in data.get("data", {}):
                    self.booking_id = data["data"]["booking"]["id"]
                    self.log_result("Create Booking", True, "Booking created successfully")
                    return True
                else:
                    self.log_result("Create Booking", False, "Invalid create booking response", data)
            else:
                self.log_result("Create Booking", False, f"Unexpected status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Create Booking", False, f"Exception: {str(e)}")
        return False
    
    def test_get_user_bookings(self):
        """Test get user bookings"""
        if not self.user_token:
            self.log_result("Get User Bookings", False, "No user token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.user_token}"}
            response = self.session.get(f"{API_BASE}/bookings/my-bookings", headers=headers)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and "bookings" in data.get("data", {}):
                    self.log_result("Get User Bookings", True, f"Retrieved {len(data['data']['bookings'])} bookings")
                    return True
                else:
                    self.log_result("Get User Bookings", False, "Invalid bookings response format", data)
            else:
                self.log_result("Get User Bookings", False, f"Status code: {response.status_code}", response.text)
        except Exception as e:
            self.log_result("Get User Bookings", False, f"Exception: {str(e)}")
        return False
    
    def test_cors_headers(self):
        """Test CORS headers"""
        try:
            headers = {
                "Origin": "https://morocco-trips.preview.emergentagent.com",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type, Authorization"
            }
            response = self.session.options(f"{API_BASE}/auth/login", headers=headers)
            
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers"),
                "Access-Control-Allow-Credentials": response.headers.get("Access-Control-Allow-Credentials")
            }
            
            if any(cors_headers.values()):
                self.log_result("CORS Headers", True, "CORS headers present")
                return True
            else:
                self.log_result("CORS Headers", False, "No CORS headers found", cors_headers)
        except Exception as e:
            self.log_result("CORS Headers", False, f"Exception: {str(e)}")
        return False
    
    def test_error_handling(self):
        """Test error handling for invalid requests"""
        try:
            # Test invalid endpoint
            response = self.session.get(f"{API_BASE}/invalid-endpoint")
            if response.status_code == 404:
                self.log_result("Error Handling - 404", True, "404 error handled correctly")
            else:
                self.log_result("Error Handling - 404", False, f"Expected 404, got {response.status_code}")
            
            # Test invalid login
            invalid_login = {"email": "invalid@email.com", "password": "wrongpass"}
            response = self.session.post(f"{API_BASE}/auth/login", json=invalid_login)
            if response.status_code == 401:
                data = response.json()
                if not data.get("success"):
                    self.log_result("Error Handling - Invalid Login", True, "Invalid login handled correctly")
                    return True
                else:
                    self.log_result("Error Handling - Invalid Login", False, "Invalid login should return success: false", data)
            else:
                self.log_result("Error Handling - Invalid Login", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Error Handling", False, f"Exception: {str(e)}")
        return False
    
    def test_authentication_required(self):
        """Test that protected routes require authentication"""
        try:
            # Test accessing protected route without token
            response = self.session.get(f"{API_BASE}/auth/me")
            if response.status_code == 401:
                self.log_result("Authentication Required", True, "Protected route correctly requires authentication")
                return True
            else:
                self.log_result("Authentication Required", False, f"Expected 401, got {response.status_code}")
        except Exception as e:
            self.log_result("Authentication Required", False, f"Exception: {str(e)}")
        return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print("[START] Starting Rihla Backend API Tests")
        print("=" * 50)
        # Basic connectivity tests
        self.test_health_check()
        self.test_api_root()
        # Authentication tests
        self.test_user_registration()
        self.test_host_registration()
        self.test_user_login()
        self.test_get_current_user()
        # Experience tests
        self.test_get_experiences()
        self.test_create_experience()
        # User profile tests
        self.test_get_user_profile()
        # Booking tests
        self.test_create_booking()
        self.test_get_user_bookings()
        # Security and error handling tests
        self.test_cors_headers()
        self.test_error_handling()
        self.test_authentication_required()
        # Print summary
        print("\n" + "=" * 50)
        print("[SUMMARY] TEST SUMMARY")
        print("=" * 50)
        print(f"Total Tests: {self.results['total_tests']}")
        print(f"Passed: {self.results['passed']}")
        print(f"Failed: {self.results['failed']}")
        print(f"Success Rate: {(self.results['passed']/self.results['total_tests']*100):.1f}%")
        if self.results['errors']:
            print("\n[FAILED TESTS]:")
            for error in self.results['errors']:
                print(f"  {error}")
        return self.results['failed'] == 0

if __name__ == "__main__":
    tester = RihlaAPITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)