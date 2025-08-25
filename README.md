# 🚀 Trimrr – Modern Link Shortener with Analytics  

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)  
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  
[![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)  
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)  
[![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

A modern, full-stack **URL shortener** built with **React + Supabase**.  
Not just short links — Trimrr gives you **real-time analytics** like **click counts, device stats, and geolocation insights**, all inside a sleek dashboard.  


---

## ✨ Features  

### 🔑 Authentication  
- Secure login & signup with **Supabase Auth**.  
- User-specific data — links and analytics are private to each user.  

### 🔗 URL Shortening  
- Create short links instantly.  
- Support for **custom aliases** (`trimrrly.netlify.app/my-link`).  
- Auto-generated QR codes for every short link (downloadable).  

### 📊 Analytics Dashboard  
- **Total links created** and **total clicks** overview.  
- **Per-link analytics**:  
  - Click counts  
  - Device breakdown (mobile, desktop, OS, browser)  
  - Location breakdown (country, city)  
- Animated dashboard with **Framer Motion**.  

### 🗑️ Link Management  
- Delete links (immediate DB + UI sync).  
- Copy links to clipboard.  
- Download QR code directly.  

### 🎨 UI/UX  
- Built with **TailwindCSS + shadcn/ui**.  
- Smooth animations with **Framer Motion**.  
- **Dark/Light mode toggle** (planned).  

---
## Schema
![alt text](https://github.com/arunava2018/Trimrr/blob/main/src/assets/supabase-schema.png?raw=true)

## 🛠️ Tech Stack  

**Frontend:**  
- React (Vite)  
- TailwindCSS + shadcn/ui  
- Framer Motion  
- Lucide icons  

**Backend:**  
- Supabase (Postgres + Auth)
## 🚀 Getting Started
```bash
# Clone repo
git clone https://github.com/arunava2018/trimrr.git

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run dev server
npm run dev
```
## 🔧 Environment variables needed:
You need to set up the following environment variables in your `.env` file: 
```bash
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```
## 🌍 Deployment  
🔗 [Live App](https://trimrrly.netlify.app)



