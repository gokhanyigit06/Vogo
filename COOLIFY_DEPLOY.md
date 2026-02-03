# 🚀 Coolify Deployment Guide

## Overview
This guide explains how to deploy Vogo Agency to Coolify with PostgreSQL.

## Prerequisites
- A Coolify instance running
- Domain pointed to your Coolify server (optional but recommended)

---

## 🗄️ Step 1: Create PostgreSQL Database

1. Open Coolify Dashboard
2. Go to **Resources** → **New Resource** → **Database** → **PostgreSQL**
3. Configure:
   - **Name**: `vogo-postgres`
   - **Database Name**: `vogo_agency`
   - **Username**: `postgres` (or custom)
   - **Password**: Generate a strong password
4. Click **Create**
5. Note the internal connection URL (something like: `postgresql://postgres:PASSWORD@vogo-postgres:5432/vogo_agency`)

---

## 🌐 Step 2: Deploy Application

### Option A: From GitHub (Recommended)

1. Push your code to GitHub
2. In Coolify, go to **Resources** → **New Resource** → **Application**
3. Select **GitHub** and connect your repository
4. Configure:
   - **Build Pack**: `Dockerfile`
   - **Port**: `3000`
   - **Domain**: Your domain or subdomain

### Option B: From Docker Image

1. Build and push your Docker image:
   ```bash
   docker build -t your-registry/vogo-agency:latest .
   docker push your-registry/vogo-agency:latest
   ```
2. In Coolify, create application from Docker image

---

## ⚙️ Step 3: Configure Environment Variables

In Coolify, add these environment variables to your application:

```env
# Database (use the internal URL from Step 1)
DATABASE_URL=postgresql://postgres:PASSWORD@vogo-postgres:5432/vogo_agency

# NextAuth.js
NEXTAUTH_SECRET=your-super-secret-key-generate-with-openssl
NEXTAUTH_URL=https://yourdomain.com
AUTH_TRUST_HOST=true

# Node Environment
NODE_ENV=production
```

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

---

## 🗃️ Step 4: Initialize Database

After deployment, run Prisma migrations:

1. Open the application terminal in Coolify (or SSH into the container)
2. Run:
   ```bash
   npx prisma db push
   ```

### Create Initial Admin User

1. Open Prisma Studio locally or use a migration script:
   ```bash
   npx prisma studio
   ```
2. Or create via SQL in PostgreSQL:
   ```sql
   INSERT INTO "User" (id, email, password, name, role)
   VALUES (
     'cuid-id-here',
     'admin@example.com',
     '$2b$10$...', -- bcrypt hashed password
     'Admin User',
     'ADMIN'
   );
   ```

To hash a password for the admin user, you can use this Node.js snippet:
```javascript
const bcrypt = require('bcryptjs');
const hashedPassword = bcrypt.hashSync('your-password', 10);
console.log(hashedPassword);
```

---

## 🔄 Step 5: Deploy and Verify

1. Click **Deploy** in Coolify
2. Wait for build completion
3. Visit your domain
4. Test login at `/login`
5. Access admin panel at `/admin`

---

## 🔧 Troubleshooting

### Database Connection Failed
- Ensure PostgreSQL container is running
- Check DATABASE_URL is using internal service name (`vogo-postgres` not `localhost`)
- Verify password doesn't contain special characters that need escaping

### Build Failed at Prisma Generate
- Make sure `prisma` folder exists with `schema.prisma`
- Check that `DATABASE_URL` is set during build (can be a dummy URL)

### 500 Error on API Routes
- Check application logs in Coolify
- Verify all environment variables are set
- Run `npx prisma db push` to sync schema

### Login Not Working
- Ensure a user exists in the database with hashed password
- Verify NEXTAUTH_SECRET matches what was used to create sessions
- Check NEXTAUTH_URL matches your actual domain

---

## 📝 Useful Commands

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Run migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio

# View logs
docker logs <container-id>
```

---

## 🔒 Security Checklist

- [ ] Use strong, unique DATABASE_URL password
- [ ] Generate cryptographically secure NEXTAUTH_SECRET
- [ ] Enable HTTPS via Coolify's SSL settings
- [ ] Set up proper firewall rules (only expose ports 80/443)
- [ ] Regularly backup database
- [ ] Keep dependencies updated

---

## 📊 Monitoring

Coolify provides built-in monitoring. Additionally:
- Enable Sentry or similar for error tracking
- Set up database backups (Coolify supports automatic backups)
- Monitor disk usage for uploads

---

## 🔄 Updating

1. Push changes to GitHub
2. Coolify auto-deploys if configured
3. Or manually click **Rebuild** in Coolify
4. Run any new migrations: `npx prisma migrate deploy`
