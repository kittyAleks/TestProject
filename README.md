# Service Request App

A React Native mobile application for creating and managing service requests.

## Features

- Create service requests with descriptions
- Upload up to 3 photos per request
- Select service categories
- View request history
- Rate service providers

## Setup

1. Install dependencies:

```bash
npm install
```

2. iOS setup:

```bash
cd ios
pod install
cd ..
```

3. Start the application:

```bash
npm start
```

## Requirements

- Node.js 14+
- React Native 0.70+
- iOS 13+ or Android 6.0+
- Firebase account for backend services

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── screens/        # Application screens
  ├── services/       # API and Firebase services
  ├── types/          # TypeScript type definitions
  └── utils/          # Utility functions
```
