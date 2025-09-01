# Polls App - Next.js Polling Application

A modern, full-featured polling application built with Next.js 15, TypeScript, and Tailwind CSS. Create polls, gather community feedback, and make data-driven decisions with an intuitive and beautiful interface.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure login and registration system
- **Poll Creation**: Intuitive form builder with dynamic option management
- **Poll Voting**: Anonymous voting system with real-time results
- **Poll Management**: View, edit, and manage your created polls
- **Dashboard**: Comprehensive overview of your polling activity

### Technical Features
- **Modern UI**: Built with Shadcn/ui components and Tailwind CSS
- **Responsive Design**: Mobile-first approach with beautiful layouts
- **TypeScript**: Full type safety throughout the application
- **Next.js 15**: Latest features including App Router and Server Components
- **Component Architecture**: Reusable, maintainable component structure

## 📁 Project Structure

```
alx_polls_app/
├── app/                          # Next.js App Router
│   ├── (auth)/                  # Authentication route group
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── (dashboard)/             # Dashboard route group
│   │   └── dashboard/           # User dashboard
│   ├── polls/                   # Polls functionality
│   │   ├── create/              # Create new poll
│   │   ├── [id]/                # Individual poll view
│   │   └── page.tsx             # Polls listing
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   │   ├── button.tsx           # Button component
│   │   ├── card.tsx             # Card components
│   │   ├── input.tsx            # Input component
│   │   └── navigation.tsx       # Navigation bar
│   ├── forms/                   # Form components
│   │   ├── login-form.tsx       # Login form
│   │   └── register-form.tsx    # Registration form
│   └── polls/                   # Poll-specific components
│       ├── poll-card.tsx        # Poll display card
│       └── create-poll-form.tsx # Poll creation form
├── lib/                         # Utility functions
│   └── utils.ts                 # Common utilities
├── types/                       # TypeScript definitions
│   └── index.ts                 # App interfaces and types
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS configuration
└── README.md                    # Project documentation
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **State Management**: React Hooks
- **Routing**: Next.js App Router

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd alx_polls_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Pages & Routes

### Public Pages
- **Home** (`/`) - Landing page with app overview
- **Polls** (`/polls`) - Browse all available polls
- **Poll Details** (`/polls/[id]`) - View individual poll and vote

### Authentication Pages
- **Login** (`/login`) - User sign in
- **Register** (`/register`) - User registration

### Protected Pages
- **Dashboard** (`/dashboard`) - User's personal dashboard
- **Create Poll** (`/polls/create`) - Create new polls

## 🎨 UI Components

### Shadcn/ui Components
- **Button**: Multiple variants (default, outline, secondary, etc.)
- **Card**: Flexible card layouts with header, content, and footer
- **Input**: Styled form inputs with focus states
- **Navigation**: Responsive navigation bar with mobile support

### Custom Components
- **PollCard**: Displays poll information with voting options
- **CreatePollForm**: Dynamic form for creating new polls
- **LoginForm/RegisterForm**: Authentication forms with validation

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS v4 with custom configuration for consistent design tokens.

### TypeScript
Full TypeScript support with strict type checking and comprehensive type definitions.

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# Add your environment variables here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚧 Development Status

### ✅ Completed
- Project structure and scaffolding
- UI components and styling
- Page layouts and routing
- Form components with validation
- Mock data and placeholder functionality

### 🔄 In Progress
- User authentication implementation
- Database integration
- Real-time voting system
- User management features

### 📋 Planned Features
- Poll analytics and insights
- Social sharing capabilities
- Advanced poll types (ranked choice, etc.)
- API endpoints for mobile apps
- Admin dashboard and moderation tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/alx_polls_app/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
