#!/bin/bash

# Circlo Deployment Readiness Verification Script
# Run this before deploying to Render

echo "🔍 Verifying Circlo is ready for deployment..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

echo "📦 Checking project structure..."

# Check for required files
FILES=(
    "package.json"
    "server/package.json"
    "server/server.js"
    "render.yaml"
    ".env.example"
    "server/.env.example"
    "README.md"
    "DEPLOYMENT.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file exists"
    else
        echo -e "${RED}✗${NC} $file missing"
        ((ERRORS++))
    fi
done

echo ""
echo "🔧 Checking dependencies..."

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Frontend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Frontend dependencies not installed (run: npm install)"
    ((WARNINGS++))
fi

if [ -d "server/node_modules" ]; then
    echo -e "${GREEN}✓${NC} Backend dependencies installed"
else
    echo -e "${YELLOW}⚠${NC} Backend dependencies not installed (run: cd server && npm install)"
    ((WARNINGS++))
fi

echo ""
echo "📝 Checking environment files..."

# Check .env.example files
if [ -f ".env.example" ]; then
    echo -e "${GREEN}✓${NC} Frontend .env.example exists"
else
    echo -e "${RED}✗${NC} Frontend .env.example missing"
    ((ERRORS++))
fi

if [ -f "server/.env.example" ]; then
    echo -e "${GREEN}✓${NC} Backend .env.example exists"
else
    echo -e "${RED}✗${NC} Backend .env.example missing"
    ((ERRORS++))
fi

# Check if .env files exist (should not be committed)
if [ -f ".env" ]; then
    echo -e "${YELLOW}⚠${NC} .env file exists (make sure it's in .gitignore)"
    ((WARNINGS++))
fi

if [ -f "server/.env" ]; then
    echo -e "${YELLOW}⚠${NC} server/.env file exists (make sure it's in .gitignore)"
    ((WARNINGS++))
fi

echo ""
echo "🔒 Checking .gitignore..."

if grep -q "\.env" .gitignore; then
    echo -e "${GREEN}✓${NC} .env files are ignored"
else
    echo -e "${RED}✗${NC} .env files not in .gitignore"
    ((ERRORS++))
fi

if grep -q "node_modules" .gitignore; then
    echo -e "${GREEN}✓${NC} node_modules are ignored"
else
    echo -e "${RED}✗${NC} node_modules not in .gitignore"
    ((ERRORS++))
fi

echo ""
echo "🚀 Checking deployment files..."

if [ -f "render.yaml" ]; then
    echo -e "${GREEN}✓${NC} render.yaml exists"
else
    echo -e "${RED}✗${NC} render.yaml missing"
    ((ERRORS++))
fi

if [ -f "DEPLOYMENT.md" ]; then
    echo -e "${GREEN}✓${NC} DEPLOYMENT.md exists"
else
    echo -e "${YELLOW}⚠${NC} DEPLOYMENT.md missing"
    ((WARNINGS++))
fi

echo ""
echo "🧪 Testing build process..."

# Try to build frontend
echo "Building frontend..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Frontend builds successfully"
else
    echo -e "${RED}✗${NC} Frontend build failed"
    ((ERRORS++))
fi

echo ""
echo "📊 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub"
    echo "2. Set up MongoDB Atlas"
    echo "3. Follow RENDER_QUICKSTART.md"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    echo "You can proceed with deployment, but review the warnings above."
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    if [ $WARNINGS -gt 0 ]; then
        echo -e "${YELLOW}⚠ $WARNINGS warning(s) found${NC}"
    fi
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
