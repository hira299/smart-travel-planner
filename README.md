# AI Trip Planner 🌍✈️

An intelligent travel planning application that uses AI to generate personalized travel itineraries based on your destination, dates, budget, and travel style preferences.

## 🚀 Features

- **AI-Powered Itinerary Generation**: Get detailed, personalized travel plans using Google's Gemini AI
- **Customizable Preferences**: Specify destination, dates, budget, and travel style
- **Modern Web Interface**: Clean, responsive UI built with Next.js and Tailwind CSS
- **Serverless Backend**: Scalable AWS Lambda functions with DynamoDB storage
- **Real-time Processing**: Fast itinerary generation with loading states and error handling

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - Modern React with hooks

### Backend
- **AWS Lambda** - Serverless compute
- **Python 3.12** - Backend runtime
- **Google Gemini AI** - AI-powered itinerary generation
- **AWS DynamoDB** - NoSQL database for trip storage
- **Serverless Framework** - Infrastructure as code

### APIs & Services
- **Google Gemini API** - AI content generation
- **AWS API Gateway** - RESTful API endpoints
- **AWS DynamoDB** - Data persistence

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.12)
- [AWS CLI](https://aws.amazon.com/cli/) configured
- [Serverless Framework](https://www.serverless.com/) CLI
- [Google Cloud Console](https://console.cloud.google.com/) account for Gemini API

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd ai-trip-planner
```

### 2. Backend Setup

Navigate to the backend directory and set up the Python environment:
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Install Serverless Framework dependencies:
```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the backend directory:
```bash
# Backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_DEFAULT_REGION=us-east-1
```

### 4. Deploy Backend

Deploy the serverless functions to AWS:
```bash
serverless deploy
```

Note the API Gateway URL from the deployment output - you'll need this for the frontend configuration.

### 5. Frontend Setup

Navigate to the frontend directory:
```bash
cd ../frontend
npm install
```

### 6. Configure Frontend API Endpoint

Create a `.env.local` file in the frontend directory:
```bash
# Frontend/.env.local
NEXT_PUBLIC_API_URL=YOUR_API_GATEWAY_URL/trips
```

**⚠️ Security Note:** Never commit API keys or endpoints directly in your code. Always use environment variables.

### 7. Run the Application

Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📖 Usage

1. **Enter Trip Details**: Fill in your destination, travel dates, budget, and preferred travel style
2. **Generate Itinerary**: Click "Plan My Trip" to generate your personalized itinerary
3. **View Results**: The AI will create a detailed day-by-day travel plan with activities and recommendations
4. **Save & Share**: Your itinerary is automatically saved and can be shared or printed

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
- `GEMINI_API_KEY`: Your Google Gemini API key
- `AWS_ACCESS_KEY_ID`: AWS access key for deployment
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for deployment
- `AWS_DEFAULT_REGION`: AWS region (default: us-east-1)

### API Configuration

The application uses the following API endpoints:
- `POST /trips` - Generate new travel itinerary
- `POST /gems` - Find hidden gems and recommendations

## 🏗️ Project Structure

```
ai-trip-planner/
├── backend/
│   ├── handler.py          # Lambda function handlers
│   ├── requirements.txt    # Python dependencies
│   ├── serverless.yml      # Serverless configuration
│   └── package.json        # Node.js dependencies
├── frontend/
│   ├── app/
│   │   ├── page.tsx        # Main application page
│   │   ├── layout.tsx      # Root layout
│   │   ├── globals.css     # Global styles
│   │   └── components/
│   │       └── ItineraryDisplay.tsx
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.ts  # Tailwind configuration
└── README.md
```

## 🚀 Deployment

### Backend Deployment
```bash
cd backend
serverless deploy --stage production
```

### Frontend Deployment
```bash
cd frontend
npm run build
npm run start
```

For production deployment, consider using:
- **Vercel** for frontend hosting
- **AWS Amplify** for full-stack deployment
- **Netlify** for static site hosting

## 🔒 Security Considerations

- Store API keys securely using environment variables
- Implement proper CORS policies for production
- Add authentication for user-specific features
- Use HTTPS in production environments
- Regularly update dependencies for security patches

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google Gemini AI for intelligent itinerary generation
- AWS for serverless infrastructure
- Next.js team for the amazing React framework
- Tailwind CSS for the utility-first styling approach

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/ai-trip-planner/issues) page
2. Create a new issue with detailed information
3. Contact the maintainers for urgent support

---

**Happy Traveling! ✈️🌍** 