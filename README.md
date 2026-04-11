# YouTube to MP3 Downloader

A full-stack, secure, and mobile-responsive application for converting and downloading YouTube videos into high-quality MP3 files.

## Features

- **High Quality**: Uses `yt-dlp` for maximum audio fidelity.
- **Secure**: JWT-based authentication with role-based access control.
- **Metadata Integration**: Automatically extracts titles, high-res thumbnails, uploader names, and durations.
- **History Tracking**: Keep track of your downloads and re-download them anytime.
- **Admin Dashboard**: Manage users and promote admins through a dedicated interface.
- **Mobile Friendly**: Optimized for desktop, tablet, and phone screens.
- **Automatic Cleanup**: Temporary files are deleted immediately after download.

## Tech Stack

- **Frontend**: React, Vite, Lucide React, Axios.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB.
- **Streaming/Conversion**: yt-dlp.

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) (Must be in your system PATH)

## Getting Started Locally

### 1. Clone the Repository
```bash
git clone <repository-url>
cd youtube-mp3-downloader
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd ../frontend
npm install
```
Start the frontend development server:
```bash
npm run dev
```

### 4. Usage
- Open your browser to `http://localhost:5173`.
- Register a new account.
- To promote an account to Admin, run the following in the `backend` directory:
  ```bash
  node scripts/makeAdmin.js your_email@example.com
  ```

---

## License

## License
MIT
