# 🛒 GaunleMart - E-Commerce Website

> Developed by **KISMAT DAHAL**

[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Image%20Storage-orange)](https://cloudinary.com/)

---

## 📖 About GaunleMart

GaunleMart is a **complete full-stack e-commerce web application** built for learning purposes. It allows users to browse products, filter by category, add items to cart, and read blog posts. Administrators can manage products, update stock status, replace images, and view dashboard analytics.

### 🎯 Purpose
This project demonstrates modern web development practices including:
- React functional components with hooks
- RESTful API design with Express.js
- Cloud database integration (MongoDB Atlas)
- Cloud image storage (Cloudinary)
- Responsive UI design

---

## ✨ Features

### 👤 User Side
| Feature | Description |
|---------|-------------|
| **Home Page** | Hero section with featured products (only in-stock items) |
| **Products Page** | Search by name + dynamic category filtering |
| **Product Detail** | Full product view with quantity selector |
| **Shopping Cart** | Add/remove items, update quantity, calculate total |
| **Blog System** | Category-filtered blog posts with detail pages |
| **Responsive Design** | Mobile, tablet, and desktop support |

### 👑 Admin Side 
| Feature | Description |
|---------|-------------|
| **Dashboard** | Stats cards, pie chart, bar chart, recent products |
| **Add Product** | Upload image to Cloudinary, form validation |
| **Manage Products** | Inline editing, image replace, stock toggle, delete |
| **Search Products** | Real-time filtering in manage table |
| **Bulk Submit** | Save all changes at once with submit button |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| React Router DOM | Navigation |
| Chart.js | Dashboard charts |
| CSS3 | Styling (no frameworks) |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | API server |
| MongoDB Atlas | Cloud database |
| Cloudinary | Image storage |
| Mongoose | ODM for MongoDB |

---

## 📁 Project Structure

GaunleMart/
├── server/ # Backend
│ ├── config/
│ │ ├── mongodb.js # MongoDB connection
│ │ └── cloudinary.js # Cloudinary config
│ ├── models/
│ │ └── Product.js # Product schema
│ ├── routes/
│ │ ├── products.js # CRUD APIs
│ │ └── upload.js # Image upload API
│ └── index.js # Server entry point
├── src/ # Frontend
│ ├── components/ # Reusable components
│ ├── pages/ # All pages
│ ├── context/ # Cart context
│ ├── images/ # Local images
│ ├── App.js # Main app
│ └── index.js # Entry point
├── public/ # Static files
├── .gitignore # Git ignore rules
├── package.json # Frontend dependencies
└── README.md # Documentation


---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free)
- Cloudinary account (free)

## 🚀 Installation & Setup

### 📋 Prerequisites
- 🟢 Node.js (v16 or higher)
- 📦 npm or yarn
- ☁️ MongoDB Atlas account (free)
- 🖼️ Cloudinary account (free)

---


## 📝 License
This project is created for learning purposes only. Not intended for commercial use.

---

## 👨‍💻 Developer
**KISMAT DAHAL**

---

## 🙏 Acknowledgments
- ☁️ MongoDB Atlas for free cloud database
- 🖼️ Cloudinary for free image storage
- ⚛️ React and Node.js communities

---

📅 Last Updated: May 2026