#!/bin/bash

# Rebecca Backend Test Script
# Tests all backend endpoints with mock data

echo "Testing Rebecca Backend Endpoints..."
echo "===================================="
echo ""

BASE_URL="http://localhost:3000/api/rebecca"

echo "1. Testing health endpoint..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"health"}' | jq .
echo ""

echo "2. Testing email listing..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"listEmails","max":2}' | jq .
echo ""

echo "3. Testing calendar listing..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"listCalendar","max":2}' | jq .
echo ""

echo "4. Testing drive listing (ISHE)..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"listDrive","scope":"ishe","max":2}' | jq .
echo ""

echo "5. Testing drive listing (Personal)..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"listDrive","scope":"personal","max":2}' | jq .
echo ""

echo "6. Testing file upload..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"uploadFile","filename":"test.txt","scope":"ishe","base64":"dGVzdA=="}' | jq .
echo ""

echo "7. Testing task addition..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"addTask","text":"Test task from script"}' | jq .
echo ""

echo "8. Testing chat logging..."
curl -s -X POST $BASE_URL -H "Content-Type: application/json" -d '{"action":"logChat","userText":"Hello","botText":"Hi there!"}' | jq .
echo ""

echo "All tests completed!"