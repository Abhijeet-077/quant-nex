# 🏥 Quant-NEX Medical Application

A comprehensive medical application built with Next.js, Supabase, and advanced 3D visualizations for healthcare professionals.

## 🚀 Features

### 🏥 Medical Core Features
- **Patient Management**: Complete patient records and medical history
- **Appointment Scheduling**: Advanced scheduling system with calendar integration
- **Medical Records**: Secure, HIPAA-compliant medical record management
- **3D Medical Visualizations**: Interactive 3D models of human anatomy, brain, and tumors
- **Real-time Analytics**: Medical analytics and reporting dashboards
- **Audit Logging**: Complete audit trail for HIPAA compliance

### 🔒 Security & Compliance
- **HIPAA Compliant**: Built with healthcare data protection standards
- **Row Level Security**: Database-level security with Supabase RLS
- **Authentication**: Secure authentication with NextAuth.js
- **Rate Limiting**: API protection against abuse
- **Input Sanitization**: Comprehensive data validation and sanitization

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Dark Theme**: Professional dark theme optimized for medical environments
- **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- **PWA Support**: Progressive Web App capabilities for offline use
- **Real-time Updates**: Live data synchronization

## 🛠️ Technology Stack

### Frontend
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Three.js**: 3D medical visualizations
- **Recharts**: Medical data visualization

### Backend & Database
- **Supabase**: PostgreSQL database with real-time capabilities
- **Prisma**: Type-safe database ORM
- **NextAuth.js**: Authentication and session management
- **API Routes**: Serverless API endpoints

### Deployment & Monitoring
- **Vercel**: Serverless deployment platform
- **Sentry**: Error monitoring and performance tracking
- **GitHub Actions**: CI/CD pipeline

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/quant-nex.git
   cd quant-nex
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run database migrations**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏥 Medical Features

### Patient Management
- Complete patient profiles with medical history
- Treatment progress tracking
- Medication management
- Allergy and condition tracking

### 3D Medical Visualizations
- **Human Body Model**: Interactive 3D human anatomy
- **Brain Visualization**: Detailed brain structure with tumor mapping
- **Organ Analysis**: Damaged organ visualization and analysis
- **Treatment Planning**: 3D treatment visualization tools

### Analytics & Reporting
- Patient outcome analytics
- Treatment efficacy reports
- Survival curve analysis
- Real-time medical dashboards

## 🔒 Security Features

### HIPAA Compliance
- Encrypted data transmission
- Secure data storage
- Access logging and audit trails
- Role-based access control

### Authentication & Authorization
- Multi-factor authentication support
- Role-based permissions (Doctor, Nurse, Admin)
- Session management
- Secure password policies

## 📱 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy

3. **Environment Variables**
   Set these in your Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Health Check
```bash
curl https://your-app.vercel.app/api/health
```

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for excellent user experience
- **Bundle Size**: Optimized with code splitting and lazy loading
- **3D Performance**: Optimized 3D models with LOD (Level of Detail)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Deployment Guide](VERCEL-DEPLOYMENT-GUIDE.md)
- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/quant-nex/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/quant-nex/discussions)

## 🏥 Medical Disclaimer

This application is designed for healthcare professionals and should be used in accordance with medical best practices and local regulations. Always consult with qualified medical professionals for patient care decisions.

---

**Built with ❤️ for healthcare professionals**
