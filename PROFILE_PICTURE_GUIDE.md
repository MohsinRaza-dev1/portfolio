# 📸 Profile Picture Setup Guide

## 🎯 **How to Update Your Profile Picture**

### **Method 1: Replace the Default Image**
1. **Go to:** `public/profile.jpg`
2. **Replace** this file with your actual profile picture
3. **Recommended size:** 400x400 pixels
4. **Format:** JPG or PNG

### **Method 2: Update Configuration**
1. **Open:** `src/config/profile.ts`
2. **Update the `profileImage` path:**
   ```typescript
   export const profileConfig = {
     name: "Mohsin Raza",
     title: "Full Stack Developer",
     profileImage: "/your-photo.jpg", // Change this
     fallbackImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
     social: {
       github: "https://github.com/yourusername",
       linkedin: "https://linkedin.com/in/yourusername",
       email: "your.email@example.com"
     }
   }
   ```

---

## 🎨 **Profile Picture Features**

### **✅ What's Included:**
- **Responsive Design** - Adapts to all screen sizes
- **Circular Frame** - Professional look
- **Animated Border** - Subtle pulse effect
- **Shadow Effect** - Depth and elegance
- **Fallback Image** - Backup if image fails
- **Smooth Animation** - Fade and scale on load

### **📱 Sizes:**
- **Mobile:** 128x128px
- **Tablet:** 160x160px
- **Desktop:** 192x192px

---

## 🔧 **Customization Options**

### **Change Animation:**
Edit `src/components/sections/hero.tsx`:
```typescript
{/* Animated border */}
<div className="absolute inset-0 rounded-full border-2 border-primary animate-pulse" />
```

### **Change Border Style:**
```typescript
<div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-primary/20 shadow-2xl">
```

---

## 📸 **Recommended Image Specs**

### **✅ Best Practices:**
- **Size:** 400x400 pixels (minimum)
- **Format:** JPG or PNG
- **Quality:** High resolution
- **Background:** Plain or professional
- **Style:** Headshot or professional photo

### **🎨 Tips:**
- Use a professional headshot
- Plain background works best
- Good lighting is important
- Face should be clearly visible
- Smile and look approachable

---

## 🚀 **After Updating**

1. **Save your changes**
2. **Refresh your browser**
3. **Check the profile picture** loads correctly
4. **Test on different screen sizes**

---

## 📞 **Need Help?**

If your profile picture doesn't show:
1. **Check file path** in `src/config/profile.ts`
2. **Verify image exists** in `public/` folder
3. **Check file format** (JPG/PNG)
4. **Refresh browser cache** (Ctrl+F5)

Your profile picture will be prominently displayed on your portfolio! 🌟
