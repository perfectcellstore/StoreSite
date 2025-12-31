#!/usr/bin/env python3
"""
Backend API Testing Script for Perfect Sell
Tests authentication flows and core API endpoints
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "http://localhost:3000"
API_BASE = f"{BASE_URL}/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.admin_token = None
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test result"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
    
    def test_admin_login(self) -> bool:
        """Test 1: Admin login with correct credentials"""
        print("\n=== Testing Admin Login ===")
        
        try:
            response = self.session.post(f"{API_BASE}/auth/login", json={
                "email": "perfectcellstore@gmail.com",
                "password": "admin123456"
            })
            
            if response.status_code == 200:
                data = response.json()
                if 'token' in data and 'user' in data:
                    user = data['user']
                    if user.get('role') == 'admin' and user.get('email') == 'perfectcellstore@gmail.com':
                        self.admin_token = data['token']
                        self.log_test("Admin login with correct credentials", True, 
                                    f"Token received, role: {user.get('role')}")
                        return True
                    else:
                        self.log_test("Admin login with correct credentials", False, 
                                    f"Invalid user data: role={user.get('role')}, email={user.get('email')}")
                        return False
                else:
                    self.log_test("Admin login with correct credentials", False, 
                                f"Missing token or user in response: {data}")
                    return False
            else:
                self.log_test("Admin login with correct credentials", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Admin login with correct credentials", False, f"Exception: {str(e)}")
            return False
    
    def test_email_case_variants(self) -> bool:
        """Test 2: Login with email case variants and spaces"""
        print("\n=== Testing Email Case Variants ===")
        
        test_cases = [
            " PerfectCellStore@Gmail.com ",  # Spaces and mixed case
            "PERFECTCELLSTORE@GMAIL.COM",   # All uppercase
            "perfectcellstore@gmail.com",   # All lowercase
            "PerfectCellStore@gmail.com"    # Mixed case
        ]
        
        all_passed = True
        
        for email in test_cases:
            try:
                response = self.session.post(f"{API_BASE}/auth/login", json={
                    "email": email,
                    "password": "admin123456"
                })
                
                if response.status_code == 200:
                    data = response.json()
                    if 'token' in data and data.get('user', {}).get('role') == 'admin':
                        self.log_test(f"Login with email variant: '{email}'", True, "Successfully logged in")
                    else:
                        self.log_test(f"Login with email variant: '{email}'", False, 
                                    f"Invalid response data: {data}")
                        all_passed = False
                else:
                    self.log_test(f"Login with email variant: '{email}'", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Login with email variant: '{email}'", False, f"Exception: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_register_duplicate_prevention(self) -> bool:
        """Test 3: Register with email case variants should prevent duplicates"""
        print("\n=== Testing Registration Duplicate Prevention ===")
        
        # First, try to register a new user
        test_email_base = "Test@Email.com"
        test_password = "testpassword123"
        test_name = "Test User"
        
        try:
            # First registration attempt
            response1 = self.session.post(f"{API_BASE}/auth/register", json={
                "email": test_email_base,
                "password": test_password,
                "name": test_name
            })
            
            if response1.status_code == 200:
                self.log_test("First registration with Test@Email.com", True, "User registered successfully")
                
                # Second registration with different case - should fail
                response2 = self.session.post(f"{API_BASE}/auth/register", json={
                    "email": "test@email.com",  # lowercase version
                    "password": test_password,
                    "name": test_name
                })
                
                if response2.status_code == 400:
                    data = response2.json()
                    if 'error' in data and 'already exists' in data['error'].lower():
                        self.log_test("Duplicate registration prevention (case variant)", True, 
                                    f"Correctly rejected: {data['error']}")
                        return True
                    else:
                        self.log_test("Duplicate registration prevention (case variant)", False, 
                                    f"Wrong error message: {data}")
                        return False
                else:
                    self.log_test("Duplicate registration prevention (case variant)", False, 
                                f"Should have failed with 400, got {response2.status_code}: {response2.text}")
                    return False
                    
            elif response1.status_code == 400:
                # User might already exist, try with a different email
                test_email_base = f"TestUser{hash(test_email_base) % 10000}@Email.com"
                return self.test_register_duplicate_prevention_with_email(test_email_base, test_password, test_name)
            else:
                self.log_test("First registration with Test@Email.com", False, 
                            f"HTTP {response1.status_code}: {response1.text}")
                return False
                
        except Exception as e:
            self.log_test("Registration duplicate prevention test", False, f"Exception: {str(e)}")
            return False
    
    def test_register_duplicate_prevention_with_email(self, email: str, password: str, name: str) -> bool:
        """Helper method to test duplicate prevention with specific email"""
        try:
            # First registration
            response1 = self.session.post(f"{API_BASE}/auth/register", json={
                "email": email,
                "password": password,
                "name": name
            })
            
            if response1.status_code == 200:
                # Second registration with case variant
                response2 = self.session.post(f"{API_BASE}/auth/register", json={
                    "email": email.lower(),
                    "password": password,
                    "name": name
                })
                
                if response2.status_code == 400:
                    data = response2.json()
                    if 'error' in data and 'already exists' in data['error'].lower():
                        self.log_test("Duplicate registration prevention (case variant)", True, 
                                    f"Correctly rejected: {data['error']}")
                        return True
                    else:
                        self.log_test("Duplicate registration prevention (case variant)", False, 
                                    f"Wrong error message: {data}")
                        return False
                else:
                    self.log_test("Duplicate registration prevention (case variant)", False, 
                                f"Should have failed with 400, got {response2.status_code}")
                    return False
            else:
                self.log_test("Registration duplicate prevention test", False, 
                            f"First registration failed: {response1.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Registration duplicate prevention test", False, f"Exception: {str(e)}")
            return False
    
    def test_customization_public_endpoint(self) -> bool:
        """Test 4: Ensure GET /api/customization/public returns 200"""
        print("\n=== Testing Public Customization Endpoint ===")
        
        try:
            response = self.session.get(f"{API_BASE}/customization/public")
            
            if response.status_code == 200:
                data = response.json()
                if 'customization' in data:
                    customization = data['customization']
                    required_keys = ['colors', 'typography', 'content', 'layout']
                    
                    missing_keys = [key for key in required_keys if key not in customization]
                    if not missing_keys:
                        self.log_test("GET /api/customization/public", True, 
                                    "Returns valid customization data")
                        return True
                    else:
                        self.log_test("GET /api/customization/public", False, 
                                    f"Missing required keys: {missing_keys}")
                        return False
                else:
                    self.log_test("GET /api/customization/public", False, 
                                f"Missing 'customization' key in response: {data}")
                    return False
            else:
                self.log_test("GET /api/customization/public", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("GET /api/customization/public", False, f"Exception: {str(e)}")
            return False
    
    def test_invalid_login(self) -> bool:
        """Test 5: Invalid login credentials should return 401"""
        print("\n=== Testing Invalid Login ===")
        
        try:
            response = self.session.post(f"{API_BASE}/auth/login", json={
                "email": "perfectcellstore@gmail.com",
                "password": "wrongpassword"
            })
            
            if response.status_code == 401:
                data = response.json()
                if 'error' in data:
                    self.log_test("Invalid login credentials", True, 
                                f"Correctly rejected with: {data['error']}")
                    return True
                else:
                    self.log_test("Invalid login credentials", False, 
                                f"Missing error message in response: {data}")
                    return False
            else:
                self.log_test("Invalid login credentials", False, 
                            f"Should return 401, got {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Invalid login credentials", False, f"Exception: {str(e)}")
            return False
    
    def test_auth_me_endpoint(self) -> bool:
        """Test 6: Test /auth/me endpoint with admin token"""
        print("\n=== Testing Auth Me Endpoint ===")
        
        if not self.admin_token:
            self.log_test("GET /api/auth/me", False, "No admin token available")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.admin_token}"}
            response = self.session.get(f"{API_BASE}/auth/me", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if 'user' in data:
                    user = data['user']
                    if user.get('role') == 'admin' and user.get('email') == 'perfectcellstore@gmail.com':
                        self.log_test("GET /api/auth/me with admin token", True, 
                                    f"Returns correct user data: {user.get('email')}")
                        return True
                    else:
                        self.log_test("GET /api/auth/me with admin token", False, 
                                    f"Invalid user data: {user}")
                        return False
                else:
                    self.log_test("GET /api/auth/me with admin token", False, 
                                f"Missing user in response: {data}")
                    return False
            else:
                self.log_test("GET /api/auth/me with admin token", False, 
                            f"HTTP {response.status_code}: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("GET /api/auth/me with admin token", False, f"Exception: {str(e)}")
            return False
    
    def run_all_tests(self) -> bool:
        """Run all authentication tests"""
        print("🧪 Starting Backend Authentication Tests")
        print("=" * 50)
        
        tests = [
            self.test_admin_login,
            self.test_email_case_variants,
            self.test_register_duplicate_prevention,
            self.test_customization_public_endpoint,
            self.test_invalid_login,
            self.test_auth_me_endpoint
        ]
        
        all_passed = True
        for test in tests:
            try:
                result = test()
                if not result:
                    all_passed = False
            except Exception as e:
                print(f"❌ FAIL {test.__name__}: Exception {str(e)}")
                all_passed = False
        
        return all_passed
    
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 50)
        print("🧪 TEST SUMMARY")
        print("=" * 50)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['details']}")
        
        return passed == total

def main():
    """Main test execution"""
    tester = BackendTester()
    
    try:
        all_passed = tester.run_all_tests()
        tester.print_summary()
        
        if all_passed:
            print("\n🎉 All tests passed!")
            sys.exit(0)
        else:
            print("\n💥 Some tests failed!")
            sys.exit(1)
            
    except KeyboardInterrupt:
        print("\n\n⚠️  Tests interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()