#!/usr/bin/env python3
"""
Backend API Testing for Auth Hardening Features
Tests the upgraded auth system with validation, unique email, rate limiting, and password policy
"""

import requests
import json
import time
import random
import string
from datetime import datetime

# Test configuration
BASE_URL = "http://localhost:3000/api"
HEADERS = {"Content-Type": "application/json"}

def log_test(test_name, status, details=""):
    """Log test results with timestamp"""
    timestamp = datetime.now().strftime("%H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}")
    if details:
        print(f"    {details}")

def generate_random_email():
    """Generate a random email for testing"""
    random_str = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"test_{random_str}@example.com"

def test_auth_register_validation():
    """Test POST /api/auth/register validation"""
    print("\n=== TESTING AUTH REGISTER VALIDATION ===")
    
    # Test 1: Missing fields
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={}, headers=HEADERS, timeout=10)
        if response.status_code == 400:
            log_test("Register - Missing fields", "PASS", "Returns 400 for missing fields")
        else:
            log_test("Register - Missing fields", "FAIL", f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Register - Missing fields", "FAIL", f"Request failed: {e}")
    
    # Test 2: Invalid email format
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": "invalid-email", "password": "password123", "name": "Test User"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 400:
            log_test("Register - Invalid email", "PASS", "Returns 400 for invalid email")
        else:
            log_test("Register - Invalid email", "FAIL", f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Register - Invalid email", "FAIL", f"Request failed: {e}")
    
    # Test 3: Short password (<8 chars)
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": "test@example.com", "password": "short", "name": "Test User"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 400:
            log_test("Register - Short password", "PASS", "Returns 400 for password < 8 chars")
        else:
            log_test("Register - Short password", "FAIL", f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Register - Short password", "FAIL", f"Request failed: {e}")
    
    # Test 4: Valid registration
    test_email = generate_random_email()
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": test_email, "password": "validpass123", "name": "Test User"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data and "password" not in data["user"]:
                log_test("Register - Valid registration", "PASS", "Returns 200 with token and user (no password)")
                return test_email, data["token"]
            else:
                log_test("Register - Valid registration", "FAIL", "Missing token/user or password exposed")
        else:
            log_test("Register - Valid registration", "FAIL", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("Register - Valid registration", "FAIL", f"Request failed: {e}")
    
    return None, None

def test_auth_register_duplicate(test_email):
    """Test duplicate email registration with different cases"""
    print("\n=== TESTING DUPLICATE EMAIL REGISTRATION ===")
    
    if not test_email:
        log_test("Register - Duplicate test", "SKIP", "No valid email from previous test")
        return
    
    # Test duplicate with same case
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": test_email, "password": "anotherpass123", "name": "Another User"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 400:
            log_test("Register - Duplicate same case", "PASS", "Returns 400 for duplicate email")
        else:
            log_test("Register - Duplicate same case", "FAIL", f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Register - Duplicate same case", "FAIL", f"Request failed: {e}")
    
    # Test duplicate with different case
    try:
        upper_email = test_email.upper()
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": upper_email, "password": "anotherpass123", "name": "Another User"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 400:
            log_test("Register - Duplicate different case", "PASS", "Returns 400 for case-variant duplicate")
        else:
            log_test("Register - Duplicate different case", "FAIL", f"Expected 400, got {response.status_code}")
    except Exception as e:
        log_test("Register - Duplicate different case", "FAIL", f"Request failed: {e}")

def test_auth_login_validation():
    """Test POST /api/auth/login validation and rate limiting"""
    print("\n=== TESTING AUTH LOGIN VALIDATION ===")
    
    # Create a test user first
    test_email = generate_random_email()
    test_password = "testpass123"
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": test_email, "password": test_password, "name": "Login Test User"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code != 200:
            log_test("Login - Setup user", "FAIL", f"Failed to create test user: {response.status_code}")
            return
        log_test("Login - Setup user", "PASS", "Test user created successfully")
    except Exception as e:
        log_test("Login - Setup user", "FAIL", f"Failed to create test user: {e}")
        return
    
    # Test 1: Wrong password (should work initially)
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               json={"email": test_email, "password": "wrongpassword"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 401:
            log_test("Login - Wrong password", "PASS", "Returns 401 for wrong password")
        else:
            log_test("Login - Wrong password", "FAIL", f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Login - Wrong password", "FAIL", f"Request failed: {e}")
    
    # Test 2: Correct password (should work before lockout)
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               json={"email": test_email, "password": test_password}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                log_test("Login - Correct password", "PASS", "Returns 200 with token and user")
            else:
                log_test("Login - Correct password", "FAIL", "Missing token or user in response")
        else:
            log_test("Login - Correct password", "FAIL", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("Login - Correct password", "FAIL", f"Request failed: {e}")
    
    return test_email, test_password

def test_auth_rate_limiting(test_email, test_password):
    """Test brute force rate limiting (5 fails / 15 min)"""
    print("\n=== TESTING BRUTE FORCE RATE LIMITING ===")
    
    if not test_email:
        log_test("Rate limiting test", "SKIP", "No test email available")
        return
    
    # Make 5 failed login attempts
    print("Making 5 failed login attempts...")
    for i in range(5):
        try:
            response = requests.post(f"{BASE_URL}/auth/login", 
                                   json={"email": test_email, "password": "wrongpassword"}, 
                                   headers=HEADERS, timeout=10)
            print(f"  Attempt {i+1}: {response.status_code}")
            time.sleep(0.5)  # Small delay between attempts
        except Exception as e:
            log_test(f"Rate limiting - Attempt {i+1}", "FAIL", f"Request failed: {e}")
    
    # 6th attempt should be rate limited
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               json={"email": test_email, "password": "wrongpassword"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 429:
            retry_after = response.headers.get('Retry-After')
            if retry_after:
                log_test("Rate limiting - 429 response", "PASS", f"Returns 429 with Retry-After: {retry_after}")
            else:
                log_test("Rate limiting - 429 response", "FAIL", "Returns 429 but missing Retry-After header")
        else:
            log_test("Rate limiting - 429 response", "FAIL", f"Expected 429, got {response.status_code}")
    except Exception as e:
        log_test("Rate limiting - 429 response", "FAIL", f"Request failed: {e}")
    
    # Test that correct password still works during lockout (should also be blocked)
    try:
        response = requests.post(f"{BASE_URL}/auth/login", 
                               json={"email": test_email, "password": test_password}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 429:
            log_test("Rate limiting - Correct password blocked", "PASS", "Correct password also blocked during lockout")
        else:
            log_test("Rate limiting - Correct password blocked", "FAIL", f"Expected 429, got {response.status_code}")
    except Exception as e:
        log_test("Rate limiting - Correct password blocked", "FAIL", f"Request failed: {e}")

def test_data_persistence():
    """Test that user data is properly stored in MongoDB"""
    print("\n=== TESTING DATA PERSISTENCE ===")
    
    # Create a user and verify the data structure
    test_email = generate_random_email()
    test_password = "persisttest123"
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", 
                               json={"email": test_email, "password": test_password, "name": "Persistence Test"}, 
                               headers=HEADERS, timeout=10)
        if response.status_code == 200:
            data = response.json()
            user = data.get("user", {})
            
            # Check that user has required fields
            required_fields = ["id", "email", "name", "role", "createdAt"]
            missing_fields = [field for field in required_fields if field not in user]
            
            if not missing_fields:
                log_test("Data persistence - User fields", "PASS", "User has all required fields")
            else:
                log_test("Data persistence - User fields", "FAIL", f"Missing fields: {missing_fields}")
            
            # Check that password is not exposed
            if "password" not in user:
                log_test("Data persistence - Password security", "PASS", "Password not exposed in response")
            else:
                log_test("Data persistence - Password security", "FAIL", "Password exposed in response")
            
            # Check that emailLower field exists (should be in DB but not returned)
            if "emailLower" not in user:
                log_test("Data persistence - EmailLower hidden", "PASS", "emailLower field not exposed")
            else:
                log_test("Data persistence - EmailLower hidden", "INFO", "emailLower field present in response")
            
            return data["token"]
        else:
            log_test("Data persistence - User creation", "FAIL", f"Failed to create user: {response.status_code}")
    except Exception as e:
        log_test("Data persistence - User creation", "FAIL", f"Request failed: {e}")
    
    return None

def test_regression_auth_me(token):
    """Test GET /api/auth/me endpoint"""
    print("\n=== TESTING REGRESSION: AUTH ME ===")
    
    if not token:
        log_test("Auth me test", "SKIP", "No token available")
        return
    
    try:
        headers = {**HEADERS, "Authorization": f"Bearer {token}"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "user" in data and "password" not in data["user"]:
                log_test("Auth me - Valid token", "PASS", "Returns user data without password")
            else:
                log_test("Auth me - Valid token", "FAIL", "Invalid response structure")
        else:
            log_test("Auth me - Valid token", "FAIL", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("Auth me - Valid token", "FAIL", f"Request failed: {e}")
    
    # Test with invalid token
    try:
        headers = {**HEADERS, "Authorization": "Bearer invalid_token"}
        response = requests.get(f"{BASE_URL}/auth/me", headers=headers, timeout=10)
        
        if response.status_code == 401:
            log_test("Auth me - Invalid token", "PASS", "Returns 401 for invalid token")
        else:
            log_test("Auth me - Invalid token", "FAIL", f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Auth me - Invalid token", "FAIL", f"Request failed: {e}")

def test_regression_customization_public():
    """Test GET /api/customization/public endpoint"""
    print("\n=== TESTING REGRESSION: CUSTOMIZATION PUBLIC ===")
    
    try:
        response = requests.get(f"{BASE_URL}/customization/public", headers=HEADERS, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "customization" in data:
                customization = data["customization"]
                required_sections = ["colors", "typography", "content", "images", "layout", "animation"]
                missing_sections = [section for section in required_sections if section not in customization]
                
                if not missing_sections:
                    log_test("Customization public", "PASS", "Returns 200 with valid structure")
                else:
                    log_test("Customization public", "FAIL", f"Missing sections: {missing_sections}")
            else:
                log_test("Customization public", "FAIL", "Missing customization in response")
        else:
            log_test("Customization public", "FAIL", f"Expected 200, got {response.status_code}")
    except Exception as e:
        log_test("Customization public", "FAIL", f"Request failed: {e}")

def main():
    """Run all auth hardening tests"""
    print("🔐 AUTH HARDENING BACKEND TESTING")
    print("=" * 50)
    print(f"Testing against: {BASE_URL}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test registration validation
    test_email, token = test_auth_register_validation()
    
    # Test duplicate registration
    test_auth_register_duplicate(test_email)
    
    # Test login validation and get credentials for rate limiting test
    login_email, login_password = test_auth_login_validation()
    
    # Test rate limiting
    test_auth_rate_limiting(login_email, login_password)
    
    # Test data persistence
    persist_token = test_data_persistence()
    
    # Test regression endpoints
    test_regression_auth_me(persist_token or token)
    test_regression_customization_public()
    
    print("\n" + "=" * 50)
    print("🏁 AUTH HARDENING TESTING COMPLETED")
    print(f"Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()