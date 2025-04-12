#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Ink-It Supabase Setup ===${NC}\n"

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    echo "Creating .env file from .env.example..."
    
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${GREEN}Created .env file${NC}"
    else
        echo -e "${RED}Error: .env.example file not found${NC}"
        exit 1
    fi
fi

# Check for Supabase CLI installation
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}Supabase CLI not found${NC}"
    echo "Would you like to install Supabase CLI? [y/N]"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Installing Supabase CLI..."
        npm install -g supabase
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}Supabase CLI installed successfully${NC}"
        else
            echo -e "${RED}Failed to install Supabase CLI${NC}"
            echo "Please install it manually: https://supabase.com/docs/guides/cli"
            echo "Then run this script again"
            exit 1
        fi
    else
        echo "Please install Supabase CLI manually and run this script again"
        echo "Installation guide: https://supabase.com/docs/guides/cli"
        exit 1
    fi
fi

# Prompt for Supabase URL and anon key
echo -e "\n${BLUE}Supabase Configuration${NC}"
echo "Please provide your Supabase project details"

read -p "Supabase URL: " supabase_url
read -p "Supabase Anon Key: " supabase_anon_key
read -p "OpenAI API Key (optional): " openai_api_key

# Update .env file
sed -i '' "s|SUPABASE_URL=.*|SUPABASE_URL=$supabase_url|g" .env
sed -i '' "s|SUPABASE_ANON_KEY=.*|SUPABASE_ANON_KEY=$supabase_anon_key|g" .env

if [ -n "$openai_api_key" ]; then
    sed -i '' "s|OPENAI_API_KEY=.*|OPENAI_API_KEY=$openai_api_key|g" .env
fi

echo -e "\n${GREEN}Updated .env file with your Supabase configuration${NC}"

# Ask if user wants to run SQL
echo -e "\n${BLUE}Database Setup${NC}"
echo "Would you like to see the SQL commands to set up your database? [y/N]"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    cat config/supabase.sql
    echo -e "\n${GREEN}Please run these SQL commands in your Supabase SQL Editor${NC}"
    echo "https://app.supabase.com/project/_/sql"
fi

echo -e "\n${BLUE}Local Storage${NC}"
echo "Images will be stored locally on the device instead of in Supabase storage."
echo "This reduces your Supabase storage usage and keeps image data on the user's device."

echo -e "\n${GREEN}Setup complete!${NC}"
echo "You can now run 'npm run dev' to start your application" 