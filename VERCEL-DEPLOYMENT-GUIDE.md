# 🚀 Quant-NEX Medical Application - Vercel Deployment Guide

## 📋 Overview

This guide provides step-by-step instructions for deploying the Quant-NEX medical application to Vercel with Supabase database integration and Sentry error monitoring.

## 🔧 Prerequisites

### ✅ Completed Setup
- [x] Supabase database configured with medical tables
- [x] Environment variables configured in `.env.local`
- [x] Application tested locally
- [x] GitHub repository ready

### 📦 Required Accounts
- **GitHub Account**: For code repository
- **Vercel Account**: For deployment (free tier available)
- **Supabase Account**: Already configured
- **Sentry Account**: For error monitoring (optional)

## 🧪 **Step 1: Pre-Deployment Testing**

Run the local deployment test to ensure everything is ready:

```bash
# Test your local setup
node test-local-deployment.js

# If any tests fail, fix them before proceeding
# Expected: Success rate > 90%
```

## 📤 **Step 2: Prepare GitHub Repository**

### 2.1 Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "feat: Configure Quant-NEX medical app for Vercel deployment"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/quant-nex.git

# Push to GitHub
git push -u origin main
```

### 2.2 Verify Repository Structure

Ensure your repository contains:
- ✅ `vercel.json` - Vercel configuration
- ✅ `next.config.js` - Next.js configuration with Supabase domains
- ✅ `.env.production` - Production environment template
- ✅ `package.json` - Dependencies
- ✅ All application files

## 🚀 **Step 3: Deploy to Vercel**

### 3.1 Connect GitHub to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**:
   - Select your `quant-nex` repository
   - Click "Import"

### 3.2 Configure Project Settings

1. **Framework Preset**: Next.js (should auto-detect)
2. **Root Directory**: `.` (leave as default)
3. **Build Command**: `npm run build` (should auto-detect)
4. **Output Directory**: `.next` (should auto-detect)
5. **Install Command**: `npm install` (should auto-detect)

### 3.3 Configure Environment Variables

**CRITICAL**: Add these environment variables in Vercel dashboard:

#### **Go to**: Project Settings → Environment Variables

Add each of these variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tyrvzdkuruzpojowctjo.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cnZ6ZGt1cnV6cG9qb3djdGpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxMjM1ODUsImV4cCI6MjA2MjY5OTU4NX0._-d60z0kj7jzBc_PvU635OdlWjxKmlvfUWMNT8MCeYE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5cnZ6ZGt1cnV6cG9qb3djdGpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzEyMzU4NSwiZXhwIjoyMDYyNjk5NTg1fQ.gUM4hwtMfdvT-Llbv-jAmbza7eQ9URJGMd-FQDDFZjo

# Database URLs
DATABASE_URL=postgresql://postgres.tyrvzdkuruzpojowctjo:Abhijeet@1234#@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.tyrvzdkuruzpojowctjo:Abhijeet@1234#@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-super-secret-nextauth-key-change-this-in-production-2024-vercel

# Application Configuration
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# Optional: Sentry (Error Monitoring)
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn-here
SENTRY_DSN=your-sentry-dsn-here
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=quant-nex
```

#### **Important Notes**:
- Set **Environment** to: `Production`, `Preview`, and `Development`
- **Replace** `your-app-name` with your actual Vercel app name
- **Generate a strong** `NEXTAUTH_SECRET` (32+ characters)

### 3.4 Deploy

1. **Click "Deploy"**
2. **Wait for build** (usually 2-5 minutes)
3. **Check build logs** for any errors

## ✅ **Step 4: Post-Deployment Verification**

### 4.1 Test Deployment

Once deployed, test these URLs:

```bash
# Replace 'your-app-name' with your actual Vercel URL
https://your-app-name.vercel.app/
https://your-app-name.vercel.app/api/health
https://your-app-name.vercel.app/login
```

### 4.2 Verify Database Connection

1. **Go to**: `https://your-app-name.vercel.app/api/health`
2. **Check response**: Should show database status as "healthy"
3. **Test login**: Try logging in with test credentials

### 4.3 Test Medical Application Features

1. **Login** with test account:
   - Email: `dr.sharma@quantnex.com`
   - Password: `doctor123`

2. **Test core features**:
   - Patient list loading
   - Appointment scheduling
   - Medical records access
   - Dashboard functionality

## 🔧 **Step 5: Configure Custom Domain (Optional)**

### 5.1 Add Custom Domain

1. **Go to**: Project Settings → Domains
2. **Add your domain**: `quantnex.com`
3. **Configure DNS** as instructed by Vercel
4. **Update environment variables**:
   - Change `NEXTAUTH_URL` to your custom domain
   - Update `ALLOWED_ORIGINS`

## 🔍 **Step 6: Monitoring and Maintenance**

### 6.1 Set Up Monitoring

1. **Vercel Analytics**: Automatically enabled
2. **Sentry Error Monitoring**: Configure if not already done
3. **Supabase Monitoring**: Check database performance

### 6.2 Regular Maintenance

- **Monitor error rates** in Sentry
- **Check database performance** in Supabase
- **Review Vercel function logs**
- **Update dependencies** regularly

## 🚨 **Troubleshooting**

### Common Issues

#### **Build Failures**
```bash
# Check build logs in Vercel dashboard
# Common fixes:
1. Verify all environment variables are set
2. Check for TypeScript errors
3. Ensure all dependencies are in package.json
```

#### **Database Connection Issues**
```bash
# Verify in Vercel function logs:
1. Check DATABASE_URL format
2. Verify Supabase is accessible
3. Test connection from Supabase dashboard
```

#### **Authentication Issues**
```bash
# Check:
1. NEXTAUTH_URL matches your Vercel URL
2. NEXTAUTH_SECRET is set and strong
3. Supabase auth settings are correct
```

#### **Environment Variable Issues**
```bash
# Ensure:
1. All variables are set in Vercel dashboard
2. No trailing spaces in values
3. Special characters are properly encoded
```

## 📞 **Support**

### Getting Help

1. **Vercel Documentation**: https://vercel.com/docs
2. **Supabase Documentation**: https://supabase.com/docs
3. **Next.js Documentation**: https://nextjs.org/docs

### Emergency Procedures

#### **Rollback Deployment**
1. Go to Vercel dashboard
2. Navigate to Deployments
3. Click "Promote to Production" on previous working deployment

#### **Database Issues**
1. Check Supabase dashboard for outages
2. Verify connection strings
3. Check RLS policies if access issues

## 🎉 **Success Checklist**

After successful deployment, you should have:

- ✅ **Application accessible** at Vercel URL
- ✅ **Database connected** and responsive
- ✅ **Authentication working** with test accounts
- ✅ **Medical features functional** (patients, appointments, records)
- ✅ **Error monitoring active** (if Sentry configured)
- ✅ **Security headers** properly configured
- ✅ **HIPAA compliance** features active

## 🔄 **Continuous Deployment**

Your Vercel deployment is now configured for automatic deployments:

- **Push to `main` branch** → Automatic production deployment
- **Push to other branches** → Preview deployments
- **Pull requests** → Preview deployments with unique URLs

---

**🏥 Your Quant-NEX Medical Application is now live on Vercel!**

**Production URL**: `https://your-app-name.vercel.app`
**Admin Panel**: `https://your-app-name.vercel.app/admin`
**API Health**: `https://your-app-name.vercel.app/api/health`
