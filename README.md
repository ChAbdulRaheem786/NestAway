# 🏡 NestAway

NestAway is a full-stack Airbnb-style rental platform built with Node.js, Express, MongoDB, and EJS.  
It allows users to browse properties, hosts to list homes, upload images, and manage listings with secure session-based authentication.

---

## 🌐 Live Demo

(Add your deployed link here after deployment)

---

## 🚀 Features

### 👤 Authentication
- User Registration
- User Login / Logout
- Session-based authentication
- Protected host routes

### 🏠 Property Management
- Add new homes
- Upload property images (Multer)
- View property listings
- Host-only dashboard access

### 🗄 Database
- MongoDB Atlas integration
- Mongoose ODM
- Session storage in MongoDB

### 📁 File Handling
- Image upload support
- Static file serving

### 🛡 Security
- Environment variables with dotenv
- Secure session secret
- Gitignore protection for sensitive files

---

## 🛠 Tech Stack

Backend:
- Node.js
- Express.js
- MongoDB
- Mongoose

Authentication:
- express-session
- connect-mongodb-session

File Upload:
- multer

Templating:
- EJS

Environment:
- dotenv

---

## 📂 Project Structure

NestAway/
│
├── controllers/
├── models/
├── routes/
├── views/
├── public/
├── uploads/
├── utils/
│
├── app.js
├── package.json
├── .env
├── .gitignore
└── README.md

---

## ⚙️ Installation Guide

1. Clone the repository:

git clone https://github.com/your-username/nestaway.git
cd nestaway

2. Install dependencies:

npm install

3. Create a .env file in the root directory:

PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key

4. Make sure .gitignore contains:

node_modules/
.env
uploads/

---

## ▶️ Run the Application

Development mode:

npm run dev

Production mode:

npm start

Visit:

http://localhost:3000

---

## 🌍 Deployment

Recommended platforms:
- Render
- Railway
- Fly.io

Deployment Steps (Render):

1. Push code to GitHub
2. Connect repository on Render
3. Build command: npm install
4. Start command: npm start
5. Add environment variables
6. Deploy

---

## 🧠 Future Improvements

- Payment Integration (Stripe / JazzCash)
- Reviews & Ratings
- Booking Calendar
- Cloud Image Storage (Cloudinary)
- Responsive UI Improvements

---

## 👤 Author

Abdul Raheem 
Full Stack Developer  

GitHub: https://github.com/your-username  

---

## 📄 License

MIT License

---

If you found this project helpful, please give it a star ⭐ on GitHub.
EOF