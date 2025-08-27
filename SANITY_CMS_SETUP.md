# 📸 Sanity CMS Setup Guide

Your user-friendly content management system is ready! Follow these steps to get started.

## 🚀 Quick Setup

### 1. Create Your Sanity Account
1. Go to [sanity.io](https://sanity.io) and create a free account
2. Create a new project
3. Choose "Create project from scratch"
4. Name your project (e.g., "Nihar Portfolio")
5. Choose "Production" dataset

### 2. Get Your Credentials
From your Sanity dashboard, copy these values:

```bash
# Add these to your .env.local file:
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token_here
```

**To get your API token:**
1. In Sanity dashboard → API → Tokens
2. Create new token
3. Choose "Editor" permissions
4. Copy the token

### 3. Start Your CMS
```bash
npm run dev
```

Then visit: **http://localhost:3000/admin**

## 🎨 Your CMS Features

### **📊 Dashboard Layout**
- **Site Settings** → Global site info, contact details, social media
- **Page Content** → Homepage and About page content
- **Quick Actions** → Fast access to common edits
- **Help & Guide** → Built-in documentation

### **🏠 Homepage Management**
- **Hero Section** → Your name, tagline, description, background images
- **Mission Statement** → Your photography philosophy 
- **Categories** → Three main photography types (Nature, People, etc.)
- **Featured Work** → Section titles and descriptions

### **👨‍💼 About Page Management**
- **Header** → Your name and title
- **Story Section** → Your portrait, bio, skills, experience
- **Approach** → Your 3 core photography principles
- **Call to Action** → Contact encouragement section

### **⚙️ Site Settings**
- **Basic Info** → Site title, description, logo
- **Contact** → Email, phone, location, availability status
- **Social Media** → Instagram, Twitter, LinkedIn, etc.
- **Footer** → Copyright, additional links
- **SEO** → Meta images, keywords, analytics

## 🛡️ User-Friendly Features

### **Smart Validation**
- Character limits prevent overly long text
- Required fields marked clearly
- Email validation for contact fields
- Image size recommendations

### **Helpful Descriptions**
- Every field has clear instructions
- Examples provided for complex fields
- Visual icons for easy navigation
- Tooltips explain technical terms

### **Preview System**
- See exactly how content appears on site
- Real-time updates as you type
- Mobile preview available
- Draft vs. published states

### **Content Organization**
- Logical grouping matches website structure
- Collapsible sections to reduce clutter
- Quick actions for common tasks
- Search functionality

## 📱 Mobile Editing

Your CMS works perfectly on mobile devices:
- Edit content from your phone
- Upload photos directly from camera
- Quick text updates on the go
- Touch-friendly interface

## 🔄 How It Works

### **Content Flow:**
1. **Edit in CMS** → Make changes in the admin panel
2. **Auto-Save** → Changes saved automatically as you type
3. **Publish** → Click publish to make changes live
4. **Live Update** → Your website updates immediately

### **Image Management:**
- **Auto-Optimization** → Images automatically resized and compressed
- **Smart Cropping** → Focus points for perfect mobile display
- **CDN Delivery** → Super fast loading worldwide
- **Responsive** → Perfect on all devices

## 🎯 Best Practices

### **Content Guidelines:**
- **Hero Images:** Use 6 high-quality images (1200x800px recommended)
- **Text Length:** Keep descriptions under 200 characters for readability
- **Image Alt Text:** Always add descriptions for accessibility
- **Social Media:** Only add platforms you actively use

### **SEO Optimization:**
- **Meta Descriptions:** Keep under 160 characters
- **Keywords:** Use 5-10 relevant photography terms
- **Images:** Use descriptive filenames
- **Social Sharing:** Upload 1200x630px images for best results

## 🔧 Integration with Your Site

### **Current Status:**
✅ CMS fully set up and configured
✅ User-friendly interface created
✅ Content schemas match website structure
✅ Image optimization included
✅ Mobile-responsive admin panel

### **Next Steps:**
1. Add your Sanity credentials to `.env.local`
2. Visit `/admin` to start adding content
3. Replace hardcoded content with CMS data (optional)

## 🆘 Need Help?

### **Common Tasks:**
- **Change hero text:** Site Settings → Homepage → Hero Section
- **Update about info:** Page Content → About Page → Story Section
- **Add social media:** Site Settings → Social Media Links
- **Modify contact info:** Site Settings → Contact Information

### **Troubleshooting:**
- **Can't access /admin:** Check your environment variables
- **Images not showing:** Verify image upload completed
- **Changes not visible:** Clear browser cache and refresh
- **Error messages:** Check console for specific error details

## 🎊 You're All Set!

Your photography portfolio now has a professional content management system that's:
- **Easy to use** → No technical knowledge required
- **Mobile-friendly** → Edit from anywhere
- **Professional** → Image optimization and CDN included
- **Integrated** → Seamlessly works with your existing design

Visit **http://localhost:3000/admin** to start managing your content!
