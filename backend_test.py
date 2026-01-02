#!/usr/bin/env python3
"""
Backend Testing Script for Perfect Sell E-Commerce Platform
Testing Admin Order Search Functionality
"""

import requests
import json
import time
import uuid
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://edit-delete-align.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"

# Test credentials
ADMIN_EMAIL = "perfectcellstore@gmail.com"
ADMIN_PASSWORD = "admin123456"

class BackendTester:
    def __init__(self):
        self.admin_token = None
        self.user_token = None
        self.test_orders = []
        self.test_user_id = None
        
    def log(self, message: str, level: str = "INFO"):
        """Log test messages with timestamp"""
        timestamp = time.strftime("%H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def make_request(self, method: str, endpoint: str, data: Optional[Dict] = None, 
                    headers: Optional[Dict] = None, expected_status: int = 200) -> Dict[str, Any]:
        """Make HTTP request with error handling"""
        url = f"{API_BASE}/{endpoint.lstrip('/')}"
        
        try:
            if method.upper() == "GET":
                response = requests.get(url, headers=headers, timeout=30)
            elif method.upper() == "POST":
                response = requests.post(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "PUT":
                response = requests.put(url, json=data, headers=headers, timeout=30)
            elif method.upper() == "DELETE":
                response = requests.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
                
            self.log(f"{method} {endpoint} -> {response.status_code}")
            
            if response.status_code != expected_status:
                self.log(f"Expected {expected_status}, got {response.status_code}", "WARNING")
                self.log(f"Response: {response.text}", "WARNING")
                
            return {
                "status_code": response.status_code,
                "data": response.json() if response.content else {},
                "success": response.status_code == expected_status
            }
            
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {str(e)}", "ERROR")
            return {"status_code": 0, "data": {}, "success": False, "error": str(e)}
        except json.JSONDecodeError as e:
            self.log(f"JSON decode error: {str(e)}", "ERROR")
            return {"status_code": response.status_code, "data": {}, "success": False, "error": "Invalid JSON"}
            
    def test_admin_login(self) -> bool:
        """Test admin login and get token"""
        self.log("Testing admin login...")
        
        response = self.make_request("POST", "/auth/login", {
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD
        })
        
        if response["success"] and "token" in response["data"]:
            self.admin_token = response["data"]["token"]
            user_data = response["data"].get("user", {})
            if user_data.get("role") == "admin":
                self.log("✅ Admin login successful")
                return True
            else:
                self.log(f"❌ User role is {user_data.get('role')}, expected 'admin'", "ERROR")
                return False
        else:
            self.log("❌ Admin login failed", "ERROR")
            return False
            
    def create_test_user(self) -> bool:
        """Create a test user for non-admin testing"""
        self.log("Creating test user...")
        
        test_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
        test_password = "testpass123"
        
        response = self.make_request("POST", "/auth/register", {
            "email": test_email,
            "password": test_password,
            "name": "Test User"
        })
        
        if response["success"] and "token" in response["data"]:
            self.user_token = response["data"]["token"]
            self.test_user_id = response["data"]["user"]["id"]
            self.log(f"✅ Test user created: {test_email}")
            return True
        else:
            self.log("❌ Test user creation failed", "ERROR")
            return False
            
    def create_test_orders(self) -> bool:
        """Create test orders for search testing"""
        self.log("Creating test orders...")
        
        # Create orders without authentication (as per review request)
        orders_data = [
            {
                "items": [{"id": "test-item-1", "name": "Test Item 1", "price": 100, "quantity": 1}],
                "shippingInfo": {
                    "name": "Test Customer 1",
                    "phone": "1234567890",
                    "address": "Test Address 1",
                    "city": "Baghdad",
                    "governorate": "Baghdad"
                },
                "total": 100,
                "userId": None
            },
            {
                "items": [{"id": "test-item-2", "name": "Test Item 2", "price": 200, "quantity": 1}],
                "shippingInfo": {
                    "name": "Test Customer 2", 
                    "phone": "0987654321",
                    "address": "Test Address 2",
                    "city": "Basra",
                    "governorate": "Basra"
                },
                "total": 200,
                "userId": self.test_user_id  # Associate with test user
            }
        ]
        
        for i, order_data in enumerate(orders_data):
            response = self.make_request("POST", "/orders", order_data, expected_status=200)
            
            if response["success"] and "order" in response["data"]:
                order = response["data"]["order"]
                self.test_orders.append(order)
                self.log(f"✅ Test order {i+1} created: {order['id'][:8]}...")
            else:
                self.log(f"❌ Failed to create test order {i+1}", "ERROR")
                return False
                
        return len(self.test_orders) == 2
        
    def test_admin_orders_no_search(self) -> bool:
        """Test admin can see all orders without search"""
        self.log("Testing admin orders endpoint without search...")
        
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        response = self.make_request("GET", "/orders", headers=headers)
        
        if response["success"] and "orders" in response["data"]:
            orders = response["data"]["orders"]
            self.log(f"✅ Admin can see {len(orders)} orders without search")
            
            # Verify our test orders are included
            test_order_ids = [order["id"] for order in self.test_orders]
            found_orders = [order for order in orders if order["id"] in test_order_ids]
            
            if len(found_orders) >= 2:
                self.log("✅ Test orders found in admin orders list")
                return True
            else:
                self.log(f"❌ Only found {len(found_orders)} test orders out of 2", "ERROR")
                return False
        else:
            self.log("❌ Failed to get admin orders", "ERROR")
            return False
            
    def test_admin_order_search(self) -> bool:
        """Test admin order search by partial order ID"""
        self.log("Testing admin order search functionality...")
        
        if not self.test_orders:
            self.log("❌ No test orders available for search testing", "ERROR")
            return False
            
        headers = {"Authorization": f"Bearer {self.admin_token}"}
        test_order = self.test_orders[0]
        search_term = test_order["id"][:6]  # First 6 characters
        
        # Test 1: Search with partial order ID
        self.log(f"Searching for orders with term: {search_term}")
        response = self.make_request("GET", f"/orders?search={search_term}", headers=headers)
        
        if response["success"] and "orders" in response["data"]:
            orders = response["data"]["orders"]
            matching_orders = [order for order in orders if search_term.lower() in order["id"].lower()]
            
            if len(matching_orders) > 0:
                self.log(f"✅ Found {len(matching_orders)} orders matching search term")
                
                # Verify our test order is in results
                if any(order["id"] == test_order["id"] for order in matching_orders):
                    self.log("✅ Test order found in search results")
                else:
                    self.log("❌ Test order not found in search results", "ERROR")
                    return False
            else:
                self.log("❌ No orders found matching search term", "ERROR")
                return False
        else:
            self.log("❌ Failed to search orders", "ERROR")
            return False
            
        # Test 2: Search with non-existent order ID
        self.log("Testing search with non-existent order ID...")
        response = self.make_request("GET", "/orders?search=nonexistent123", headers=headers)
        
        if response["success"] and "orders" in response["data"]:
            orders = response["data"]["orders"]
            if len(orders) == 0:
                self.log("✅ Empty results for non-existent search term")
            else:
                self.log(f"❌ Expected empty results, got {len(orders)} orders", "ERROR")
                return False
        else:
            self.log("❌ Failed to search with non-existent term", "ERROR")
            return False
            
        return True
        
    def test_user_orders_no_search(self) -> bool:
        """Test normal user can only see their own orders"""
        self.log("Testing normal user orders endpoint without search...")
        
        headers = {"Authorization": f"Bearer {self.user_token}"}
        response = self.make_request("GET", "/orders", headers=headers)
        
        if response["success"] and "orders" in response["data"]:
            orders = response["data"]["orders"]
            self.log(f"✅ User can see {len(orders)} orders")
            
            # Verify all orders belong to the user
            user_orders = [order for order in orders if order.get("userId") == self.test_user_id]
            
            if len(user_orders) == len(orders):
                self.log("✅ All returned orders belong to the user")
                return True
            else:
                self.log(f"❌ Found {len(orders) - len(user_orders)} orders not belonging to user", "ERROR")
                return False
        else:
            self.log("❌ Failed to get user orders", "ERROR")
            return False
            
    def test_user_order_search_restriction(self) -> bool:
        """Test normal user cannot search for other users' orders"""
        self.log("Testing normal user order search restrictions...")
        
        if not self.test_orders:
            self.log("❌ No test orders available for search testing", "ERROR")
            return False
            
        headers = {"Authorization": f"Bearer {self.user_token}"}
        
        # Find an order that doesn't belong to the test user
        other_user_order = None
        for order in self.test_orders:
            if order.get("userId") != self.test_user_id:
                other_user_order = order
                break
                
        if not other_user_order:
            self.log("❌ No other user's order found for testing", "ERROR")
            return False
            
        # Try to search for another user's order
        search_term = other_user_order["id"][:6]
        self.log(f"User searching for other user's order: {search_term}")
        
        response = self.make_request("GET", f"/orders?search={search_term}", headers=headers)
        
        if response["success"] and "orders" in response["data"]:
            orders = response["data"]["orders"]
            
            # Check if the other user's order is returned
            found_other_order = any(order["id"] == other_user_order["id"] for order in orders)
            
            if not found_other_order:
                self.log("✅ User cannot see other user's order via search")
                
                # Verify all returned orders belong to the user
                user_orders = [order for order in orders if order.get("userId") == self.test_user_id]
                if len(user_orders) == len(orders):
                    self.log("✅ Search results properly filtered to user's orders only")
                    return True
                else:
                    self.log("❌ Search returned orders not belonging to user", "ERROR")
                    return False
            else:
                self.log("❌ User can see other user's order via search - SECURITY ISSUE", "ERROR")
                return False
        else:
            self.log("❌ Failed to test user search restrictions", "ERROR")
            return False
            
    def cleanup_test_data(self):
        """Clean up test data (orders cannot be deleted via API, so just log)"""
        self.log("Test cleanup - orders will remain in database for admin review")
        for order in self.test_orders:
            self.log(f"Test order created: {order['id']}")
            
    def run_all_tests(self) -> bool:
        """Run all admin order search tests"""
        self.log("=" * 60)
        self.log("STARTING ADMIN ORDER SEARCH BACKEND TESTS")
        self.log("=" * 60)
        
        try:
            # Step 1: Admin login
            if not self.test_admin_login():
                return False
                
            # Step 2: Create test user
            if not self.create_test_user():
                return False
                
            # Step 3: Create test orders
            if not self.create_test_orders():
                return False
                
            # Step 4: Test admin orders without search
            if not self.test_admin_orders_no_search():
                return False
                
            # Step 5: Test admin order search
            if not self.test_admin_order_search():
                return False
                
            # Step 6: Test user orders without search
            if not self.test_user_orders_no_search():
                return False
                
            # Step 7: Test user search restrictions
            if not self.test_user_order_search_restriction():
                return False
                
            self.log("=" * 60)
            self.log("✅ ALL ADMIN ORDER SEARCH TESTS PASSED")
            self.log("=" * 60)
            return True
            
        except Exception as e:
            self.log(f"❌ Test suite failed with exception: {str(e)}", "ERROR")
            return False
        finally:
            self.cleanup_test_data()

if __name__ == "__main__":
    tester = BackendTester()
    success = tester.run_all_tests()
    exit(0 if success else 1)