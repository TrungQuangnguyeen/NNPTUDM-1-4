#!/bin/bash

# ============================================
# Messaging API - Quick Setup & Test Script
# ============================================

echo "🚀 Starting Messaging API Setup..."
echo ""

# 1. Check Node.js
echo "✓ Checking Node.js..."
node -v
npm -v
echo ""

# 2. Create uploads folder
echo "✓ Creating uploads folder..."
mkdir -p uploads
echo ""

# 3. Install dependencies
echo "✓ Installing dependencies..."
npm install
echo ""

echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "📝 Next Steps:"
echo ""
echo "1. Start MongoDB (if not running):"
echo "   mongod"
echo ""
echo "2. In a new terminal, start the server:"
echo "   npm start"
echo ""
echo "3. In another terminal, seed test data:"
echo "   node scripts/seedTestData.js"
echo ""
echo "4. Copy User IDs from output and use in Postman"
echo ""
echo "5. Import collection in Postman:"
echo "   File > Import > Messaging_API_Postman.json"
echo ""
echo "6. Update headers with User IDs and test!"
echo ""
echo "📚 Documentation:"
echo "   - README_MESSAGING_API.md"
echo "   - MESSAGING_API_GUIDE.md"
echo "   - POSTMAN_SCREENSHOT_GUIDE.md"
echo "   - IMPLEMENTATION_CHECKLIST.md"
echo ""
echo "================================================"
