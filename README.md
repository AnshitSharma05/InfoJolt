# InfoJolt

InfoJolt is a modern, full-stack blogging platform built with the **MERN** (MongoDB, Express, React, Node.js) stack. It empowers users to create, manage, and share content seamlessly, enhanced with AI-powered capabilities to ensure high-quality writing.

##  Key Features

- **Rich Text Editing:** Create and format beautiful blog posts using the Jodit React rich text editor.
- **AI-Powered Assistance:** Integrated with Google's Gemini API to provide smart grammar and spelling corrections for blog titles and descriptions.
- **Secure Authentication:** User signup, login, and protected routes using JWT (JSON Web Tokens) and HttpOnly cookies.
- **Media Management:** Seamless image uploading and management through Cloudinary.
- **Responsive & Accessible UI:** A sleek, modern interface built with Tailwind CSS and Radix UI components, ensuring a great experience across all devices.
- **Dark/Light Mode:** Full theme support with Redux Persist for saving user preferences.
- **User Dashboard:** Dedicated dashboards for users to manage their profiles, view their published blogs, and interact with comments.

##  Tech Stack

### Frontend
- **Framework:** React 19, Vite
- **State Management:** Redux Toolkit, Redux Persist
- **Styling:** Tailwind CSS, Radix UI (shadcn/ui)
- **Routing:** React Router DOM
- **Editor:** Jodit React
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, Bcrypt.js
- **Cloud Storage:** Cloudinary, Multer, DataURI
- **AI Integration:** Google Generative AI (Gemini API)

##  Installation and Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Database (Local or MongoDB Atlas)
- Cloudinary Account
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/AnshitSharma05/InfoJolt.git
cd InfoJolt
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=...
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd infojolt
npm install
```

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

