# Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

Vercel is the best platform for Next.js applications and offers a generous free tier.

### Prerequisites
- GitHub account
- Vercel account (free)
- PostgreSQL database (Neon, Supabase, or Railway - all have free tiers)
- Auth0 account (free)

---

## Step 1: Set Up Database (Neon - Free PostgreSQL)

### Option A: Neon (Recommended)

1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub (free)
3. Create a new project
4. Copy the connection string (starts with `postgresql://`)
5. Save it for later as `DATABASE_URL`

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string (URI format)
5. Save as `DATABASE_URL`

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the connection string from variables
4. Save as `DATABASE_URL`

---

## Step 2: Set Up Auth0

1. Go to [auth0.com](https://auth0.com) and sign in
2. Create a new application:
   - Type: **Regular Web Application**
   - Name: "Law & Verdict" (or your app name)

3. Configure Application Settings:
   
   **Allowed Callback URLs:**
   ```
   http://localhost:3000/auth/callback,
   https://your-app-name.vercel.app/auth/callback
   ```

   **Allowed Logout URLs:**
   ```
   http://localhost:3000,
   https://your-app-name.vercel.app
   ```

   **Allowed Web Origins:**
   ```
   http://localhost:3000,
   https://your-app-name.vercel.app
   ```

4. Save the following from your Auth0 app:
   - Domain (e.g., `dev-xxx.us.auth0.com`)
   - Client ID
   - Client Secret

---

## Step 3: Push Code to GitHub

1. Initialize git repository (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit with N-device session management"
   ```

2. Create a new repository on GitHub

3. Push your code:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 4: Deploy to Vercel

### Via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

6. Add Environment Variables (click "Environment Variables"):

   ```env
   AUTH0_DOMAIN=your-domain.us.auth0.com
   AUTH0_CLIENT_ID=your-client-id
   AUTH0_CLIENT_SECRET=your-client-secret
   AUTH0_SECRET=your-secret-key-min-32-chars
   APP_BASE_URL=https://your-app-name.vercel.app
   AUTH0_SCOPE=openid profile email
   DATABASE_URL=postgresql://...
   ```

   **Generate AUTH0_SECRET:**
   ```bash
   openssl rand -base64 32
   ```
   Or use: https://generate-secret.vercel.app/32

7. Click "Deploy"

8. Wait for deployment (2-3 minutes)

9. Get your deployment URL: `https://your-app-name.vercel.app`

---

## Step 5: Run Database Migrations

After deployment, you need to set up the database schema:

### Option A: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Link to your project:
   ```bash
   vercel link
   ```

4. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

5. Run Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

### Option B: Using Prisma Studio

1. Install dependencies locally:
   ```bash
   npm install
   ```

2. Create `.env.local` with your production `DATABASE_URL`

3. Run migration:
   ```bash
   npx prisma migrate deploy
   ```

4. Verify with Prisma Studio:
   ```bash
   npx prisma studio
   ```

---

## Step 6: Update Auth0 URLs

Now that you have your Vercel URL:

1. Go back to Auth0 Dashboard
2. Go to your application settings
3. Update the URLs with your actual Vercel URL:
   
   **Allowed Callback URLs:**
   ```
   https://your-actual-app-name.vercel.app/auth/callback
   ```

   **Allowed Logout URLs:**
   ```
   https://your-actual-app-name.vercel.app
   ```

   **Allowed Web Origins:**
   ```
   https://your-actual-app-name.vercel.app
   ```

4. Save changes

---

## Step 7: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `APP_BASE_URL` to your actual Vercel URL:
   ```
   APP_BASE_URL=https://your-actual-app-name.vercel.app
   ```
3. Redeploy (or it will auto-redeploy on next git push)

---

## Step 8: Test Production Deployment

1. Visit your Vercel URL
2. Test the application:
   - ✅ Home page loads
   - ✅ Sign in works
   - ✅ Profile completion works
   - ✅ Dashboard displays correctly
   - ✅ 3-device limit works
   - ✅ Force logout works
   - ✅ Graceful logout page shows

---

## 🔧 Troubleshooting

### Issue: "Application error" after deployment

**Solution**: Check Vercel logs:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on latest deployment
3. Click "Runtime Logs"
4. Look for errors

### Issue: Database connection error

**Solution**: 
- Verify `DATABASE_URL` is correct in Vercel env vars
- Make sure you ran `npx prisma migrate deploy`
- Check database is accessible from internet

### Issue: Auth0 redirect error

**Solution**:
- Double-check callback URLs in Auth0
- Ensure `APP_BASE_URL` matches your Vercel URL
- Clear browser cookies and try again

### Issue: "Module not found" error

**Solution**:
```bash
# Ensure all dependencies are in package.json
npm install
git add package.json package-lock.json
git commit -m "Update dependencies"
git push
```

---

## 📊 Vercel Dashboard Features

After deployment, you can use:

- **Analytics**: Track page views and performance
- **Logs**: Real-time server logs
- **Deployments**: View deployment history
- **Domains**: Add custom domain (optional)
- **Environment Variables**: Manage secrets

---

## 🌐 Custom Domain (Optional)

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In Vercel Dashboard → Your Project → Settings → Domains
3. Add your custom domain
4. Follow Vercel's DNS instructions
5. Update Auth0 URLs to include custom domain

---

## 🔄 Continuous Deployment

Vercel automatically redeploys when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push

# Vercel auto-deploys in ~2 minutes
```

---

## 💰 Free Tier Limits

All these services have generous free tiers:

**Vercel:**
- Unlimited deployments
- 100 GB bandwidth/month
- Edge functions
- Analytics

**Neon (PostgreSQL):**
- 1 project free
- 512 MB storage
- 1 GB data transfer/month

**Auth0:**
- 7,000 free active users
- Unlimited logins
- Social login

**Cost: $0/month** for this project! ✅

---

## ✅ Deployment Checklist

Before going live:

- [ ] Database created and migrations run
- [ ] Auth0 configured with correct URLs
- [ ] All environment variables set in Vercel
- [ ] Code pushed to GitHub
- [ ] Vercel deployment successful
- [ ] Production URL works
- [ ] Sign in/sign out works
- [ ] Session management works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Dark mode works

---

## 🔗 Quick Links

After deployment, save these:

- **App URL**: https://your-app-name.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/yourusername/repo-name
- **Database Dashboard**: (Neon/Supabase/Railway)
- **Auth0 Dashboard**: https://manage.auth0.com

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

Share your links:
- **Live App**: https://your-app-name.vercel.app
- **GitHub Code**: https://github.com/yourusername/repo-name

---

## 📝 Post-Deployment

### Monitor Your App

1. **Vercel Analytics**: Track visitors
2. **Error Monitoring**: Check runtime logs
3. **Database Usage**: Monitor Neon/Supabase dashboard

### Updates

To update your app:
```bash
# Make changes
git add .
git commit -m "Description"
git push

# Auto-deploys to production
```

### Rollback

If something breaks:
1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → Promote to Production

---

## 🔒 Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use environment variables for secrets
- ✅ Keep Auth0 secret secure
- ✅ Regularly update dependencies
- ✅ Monitor for unusual activity

---

**That's it! Your N-device session management app is live!** 🚀
