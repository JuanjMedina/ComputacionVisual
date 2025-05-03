#!/bin/bash

echo "🔧 Setting up Hierarchical Transformations Demo"
echo "==============================================="

# Install dependencies
echo "📦 Installing dependencies..."
npm install @react-three/fiber @react-three/drei three leva

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    
    # Start development server
    echo "🚀 Starting development server..."
    echo "🌐 Open your browser to the URL shown below (usually http://localhost:5173)"
    npm run dev
else
    echo "❌ Error installing dependencies. Please try again or install them manually:"
    echo "npm install @react-three/fiber @react-three/drei three leva"
fi 