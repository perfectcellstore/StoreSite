#!/bin/bash

# Database & Authentication Monitoring Script
# Run this script to verify system health and database persistence

echo "======================================"
echo "Perfect Sell - System Health Check"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check API Health Endpoint
echo "1. Checking API Health..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/health)
HEALTH_STATUS=$(echo $HEALTH_RESPONSE | jq -r '.status' 2>/dev/null)

if [ "$HEALTH_STATUS" = "healthy" ]; then
    echo -e "${GREEN}✓ API is healthy${NC}"
    USER_COUNT=$(echo $HEALTH_RESPONSE | jq -r '.database.userCount')
    ADMIN_EXISTS=$(echo $HEALTH_RESPONSE | jq -r '.database.adminAccountExists')
    echo "  - User count: $USER_COUNT"
    echo "  - Admin exists: $ADMIN_EXISTS"
else
    echo -e "${RED}✗ API health check failed${NC}"
    echo "  Response: $HEALTH_RESPONSE"
fi
echo ""

# 2. Check MongoDB Connection
echo "2. Checking MongoDB..."
MONGO_CHECK=$(mongosh perfect_sell --quiet --eval "db.runCommand({ping:1}).ok" 2>&1)
if [ "$MONGO_CHECK" = "1" ]; then
    echo -e "${GREEN}✓ MongoDB is running${NC}"
    
    # Get user count from MongoDB directly
    USER_COUNT_DB=$(mongosh perfect_sell --quiet --eval "db.users.countDocuments()" 2>&1)
    echo "  - Users in database: $USER_COUNT_DB"
    
    # Check admin user
    ADMIN_CHECK=$(mongosh perfect_sell --quiet --eval "db.users.findOne({emailLower:'perfectcellstore@gmail.com'}) ? 'exists' : 'missing'" 2>&1)
    if [ "$ADMIN_CHECK" = "exists" ]; then
        echo -e "  - Admin account: ${GREEN}EXISTS${NC}"
    else
        echo -e "  - Admin account: ${RED}MISSING${NC}"
    fi
else
    echo -e "${RED}✗ MongoDB connection failed${NC}"
    echo "  Error: $MONGO_CHECK"
fi
echo ""

# 3. Check MongoDB Data Persistence
echo "3. Checking MongoDB data directory..."
if [ -d "/data/db" ]; then
    echo -e "${GREEN}✓ Data directory exists${NC}"
    DB_SIZE=$(du -sh /data/db 2>/dev/null | cut -f1)
    echo "  - Directory: /data/db"
    echo "  - Size: $DB_SIZE"
    
    # Check if there are actual data files
    FILE_COUNT=$(find /data/db -name "*.wt" 2>/dev/null | wc -l)
    if [ "$FILE_COUNT" -gt 0 ]; then
        echo -e "  - Data files: ${GREEN}$FILE_COUNT files found${NC}"
    else
        echo -e "  - Data files: ${YELLOW}No WiredTiger files found${NC}"
    fi
else
    echo -e "${RED}✗ Data directory /data/db not found${NC}"
fi
echo ""

# 4. Check Application Logs
echo "4. Checking recent authentication logs..."
if [ -f "/var/log/supervisor/nextjs.out.log" ]; then
    echo "Recent login attempts:"
    tail -50 /var/log/supervisor/nextjs.out.log | grep -E "\[(Login|Register)\]" | tail -5
    
    echo ""
    echo "Recent database operations:"
    tail -50 /var/log/supervisor/nextjs.out.log | grep -E "\[DB\]" | tail -5
    
    # Check for errors
    ERROR_COUNT=$(tail -100 /var/log/supervisor/nextjs.out.log | grep -i "error" | wc -l)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}⚠ Found $ERROR_COUNT errors in last 100 log lines${NC}"
    else
        echo -e "${GREEN}✓ No errors in recent logs${NC}"
    fi
else
    echo -e "${YELLOW}⚠ Log file not found${NC}"
fi
echo ""

# 5. Test Admin Login
echo "5. Testing admin login..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"perfectcellstore@gmail.com","password":"DragonBall123!"}' 2>&1)

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token' 2>/dev/null)
if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Admin login successful${NC}"
    USER_ROLE=$(echo $LOGIN_RESPONSE | jq -r '.user.role' 2>/dev/null)
    echo "  - Role: $USER_ROLE"
else
    echo -e "${RED}✗ Admin login failed${NC}"
    ERROR_MSG=$(echo $LOGIN_RESPONSE | jq -r '.error' 2>/dev/null)
    echo "  - Error: $ERROR_MSG"
fi
echo ""

# 6. Check Supervisor Status
echo "6. Checking service status..."
NEXTJS_STATUS=$(sudo supervisorctl status nextjs | awk '{print $2}')
if [ "$NEXTJS_STATUS" = "RUNNING" ]; then
    echo -e "${GREEN}✓ Next.js service is running${NC}"
else
    echo -e "${RED}✗ Next.js service status: $NEXTJS_STATUS${NC}"
fi
echo ""

# Summary
echo "======================================"
echo "Summary"
echo "======================================"

ALL_GOOD=true

# Check all critical components
if [ "$HEALTH_STATUS" != "healthy" ]; then ALL_GOOD=false; fi
if [ "$MONGO_CHECK" != "1" ]; then ALL_GOOD=false; fi
if [ ! -d "/data/db" ]; then ALL_GOOD=false; fi
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then ALL_GOOD=false; fi

if [ "$ALL_GOOD" = true ]; then
    echo -e "${GREEN}✓ All systems operational${NC}"
    echo "Your authentication system is working correctly."
    echo "User accounts are persisted and login is functional."
else
    echo -e "${RED}✗ Some issues detected${NC}"
    echo "Please review the checks above for details."
    echo "Check /app/docs/AUTH_PERSISTENCE_FIX.md for troubleshooting."
fi

echo ""
echo "Last checked: $(date)"
