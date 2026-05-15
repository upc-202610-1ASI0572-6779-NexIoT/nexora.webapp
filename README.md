# Nexora IoT Platform - Web Application

A professional Vue 3-based IoT fleet management platform for monitoring and managing ESP32 gateway devices. This application provides real-time monitoring, device fleet management, alert systems, and comprehensive analytics.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher recommended)
- npm (comes with Node.js)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nexora-webapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 🛠️ Development Commands

### Build for Production
```bash
npm run build
```

### View Build Artifacts
```bash
npm run preview
```

### Run Tests
```bash
npm run test:unit
```

### Run Lint
```bash
npm run lint
```

## 📂 Project Structure

The project follows a clean architecture pattern with separate layers for domain, application, infrastructure, and presentation.

```
nexora-webapp/
├── src/
│   ├── assets/               # Static assets (images, fonts, etc.)
│   ├── components/           # Reusable UI components (global)
│   ├── router/               # Vue Router configuration
│   ├── shared/               # Shared utilities and constants
│   │
│   ├── iam/                  # Identity and Access Management Module
│   │   ├── auth/             # Authentication features
│   │   ├── users/            # User management features
│   │   └── settings/         # System settings features
│   │
│   ├── service-monitoring/   # Service Monitoring Module
│   │   ├── alerts/           # Alert management features
│   │   ├── dashboard/        # Dashboard features
│   │   ├── devices/          # Device management features
│   │   └── gateway/          # Gateway management features
│   │
│   └── store/                # Global Vuex store (if applicable)
├── public/                   # Publicly accessible files
├── .env                      # Environment variables
└── vite.config.js            # Vite configuration
```

## 🎨 Technology Stack

### Core Framework
- **Vue 3**: Progressive JavaScript framework for building user interfaces
- **Vite**: Next-generation frontend tooling with blazing-fast HMR

### State Management
- **Pinia**: Intuitive, type-safe state management for Vue

### Routing
- **Vue Router**: Official router for Vue.js

### Styling
- **SCSS/Sass**: CSS preprocessor for enhanced styling capabilities
- **Tailwind CSS**: Utility-first CSS framework (via PostCSS)

### HTTP Client
- **Axios**: Promise-based HTTP client for browser and Node.js

## 🤝 Contributing

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) (if available) for detailed guidelines on our code of conduct and the process for submitting pull requests.

### Code Style

We use ESLint for code quality and Prettier for consistent formatting. Ensure your code passes lint checks before submitting a PR:
```bash
npm run lint
```

## 📝 License

This project is licensed under the [MIT License](LICENSE).

## 👥 Team

This project was developed by the Nexora IoT development team.

## 📞 Support

For issues or questions, please open an issue in the repository.
