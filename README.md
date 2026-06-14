# 🌿 AgriGuard - AI Powered Crop Disease Detection System

---

## 1) Problem Statement

The project aims to solve the problem of **delayed and inaccurate detection of crop diseases and lack of accessible agricultural advisory systems** by using AI-based image classification and a web platform.

Currently, farmers depend on manual inspection or expert consultation, which leads to **late diagnosis, crop damage, and reduced yield**, affecting farmers and agricultural productivity at large.

---

## 2) Proposed Solution

AgriGuard provides an **AI-powered web platform** where users can upload crop images and get instant disease predictions along with treatment suggestions.

- Uses deep learning (CNN-based models) for disease detection  
- Provides real-time inference results  
- Includes a marketplace for agricultural treatments and products  
- Centralized system for farmers and agricultural support  

This solution improves speed, accuracy, and accessibility compared to traditional methods.

---

## 3) Features

- 🌿 Crop disease detection using AI model  
- ⚡ Real-time image-based prediction  
- 🛒 Agricultural product marketplace  
- 🔐 User authentication (Login/Signup)  
- 👨‍💼 Admin dashboard (users, products, orders management)  
- 📦 Order and cart system  
- 📊 Structured backend APIs  

---

## 4) Tech Stack

**Frontend:** React.js, Vite, Tailwind CSS, HTML, CSS  
**Backend:** Node.js, Express / Flask / FastAPI  
**Database:** MongoDB  
**AI/ML:** PyTorch / TensorFlow (Transfer Learning CNN models)  
**API:** REST APIs for authentication, prediction, and marketplace  

---

## 5) System Architecture
![System Architecture of the Proposed System](/WorkFlow.png)

---

## 6) Installation & Setup

```bash
git clone <repo-link>
cd project-folder

# Frontend setup
cd frontend
npm install
npm run dev

# Backend setup
cd backend
npm install
node server.js
