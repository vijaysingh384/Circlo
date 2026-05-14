# 📸 Circlo - Real-Time Event Photo Sharing

Circlo is a simple, real-time photo sharing application for events. No accounts, no login required - just create an event, share a QR code, and let guests upload photos instantly.

## ✨ Features

- **🎉 Create Events** - Start an event in seconds with a custom name
- **📱 QR Code Sharing** - Share event access via QR code or join link
- **📸 Real-Time Photo Upload** - Photos appear instantly for all guests
- **👥 Live User Tracking** - See who's viewing the event in real-time
- **🗑️ Photo Management** - Hosts can delete any photo, guests can delete their own
- **📦 Bulk Download** - Download all photos or selected photos as ZIP
- **🔒 No Authentication** - No accounts or login required
- **⚡ Fast & Lightweight** - Built with modern web technologies

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **Socket.IO Client** - Real-time communication
- **React Router** - Client-side routing
- **QRCode.react** - QR code generation

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM
- **Socket.IO** - Real-time WebSocket server
- **Multer** - File upload handling
- **Archiver** - ZIP file generation

## 📁 Project Structure

```
circlo/
├── src/                      # Frontend source code
│   ├── components/           # React components
│   │   ├── EventHeader.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── QRCodeModal.tsx
│   │   ├── Toast.tsx
│   │   └── UploadSection.tsx
│   ├── hooks/                # Custom React hooks (4 hooks)
│   │   ├── useEvent.ts       # Fetch event data
│   │   ├── usePhotos.ts      # Manage photos & selection
│   │   ├── useUpload.ts      # Handle file uploads
│   │   └── useSocketEvents.ts # Real-time WebSocket events
│   ├── pages/                # Page components
│   │   ├── HomePage.tsx
│   │   ├── JoinPage.tsx
│   │   └── EventPage.tsx
│   ├── lib/                  # Core utilities
│   │   ├── api.ts           # API client
│   │   ├── tokens.ts        # Token management
│   │   └── validation.ts    # Input validation
│   ├── utils/                # Helper utilities
│   │   ├── clipboard.ts
│   │   └── download.ts
│   ├── types.ts              # TypeScript types
│   └── main.tsx              # App entry point
│
├── server/                   # Backend source code
│   ├── routes/               # API routes
│   │   ├── events.js        # Event endpoints
│   │   └── photos.js        # Photo endpoints
│   ├── models/               # Database models
│   │   ├── Event.js
│   │   └── Photo.js
│   ├── middleware/           # Express middleware
│   │   ├── upload.js        # File upload config
│   │   └── validation.js    # Request validation
│   ├── lib/                  # Server utilities
│   │   ├── database.js      # Database operations
│   │   ├── storage.js       # File storage
│   │   ├── socket.js        # Socket.IO setup
│   │   ├── zip.js           # ZIP generation
│   │   └── cleanup.js       # Auto-cleanup service
│   ├── config/               # Configuration
│   │   └── mongoose-connection.js
│   └── server.js             # Server entry point
│
└── public/                   # Static assets
    ├── uploads/              # Uploaded photos
    └── images/               # App images
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (local or MongoDB Atlas)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/circlo.git
   cd circlo
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `server/` directory:
   ```env
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/circlo
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   
   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev:all
   ```
   
   **Option 2: Run separately**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   npm run dev
   ```

6. **Open the app**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## 📖 How to Use

### Creating an Event

1. Go to the homepage
2. Enter an event name (e.g., "John's Birthday Party")
3. Enter a join code (e.g., "PARTY2024")
4. Click "Create Event"
5. You'll be redirected to the event page with a QR code

### Joining an Event

**Option 1: QR Code**
- Scan the QR code with your phone camera
- Opens the event page directly

**Option 2: Join Code**
- Go to the homepage
- Click "Join Event"
- Enter the join code
- Click "Join"

### Uploading Photos

1. Enter your name
2. Click "Choose Photos" or drag & drop
3. Select one or multiple photos (max 20 at once)
4. Photos upload automatically
5. Everyone sees the photos in real-time

### Downloading Photos

**Download All:**
- Click the "Download All" button in the header
- All photos download as a ZIP file

**Download Selected:**
- Click on photos to select them
- Click "Download Selected"
- Selected photos download as a ZIP file

### Deleting Photos

- **Hosts** can delete any photo
- **Guests** can only delete their own photos
- Click the trash icon on a photo to delete

## 🔧 Configuration

### File Upload Limits

Edit `server/middleware/validation.js`:
```javascript
const VALIDATION_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB per file
  MAX_FILES_PER_UPLOAD: 20,       // 20 files at once
  MAX_UPLOADS_PER_SESSION: 20,    // 20 total per user
};
```

### Auto-Cleanup

Photos are automatically deleted after 1 hour. To change this, edit `server/lib/cleanup.js`:
```javascript
const PHOTO_EXPIRY_MS = 60 * 60 * 1000; // 1 hour
```

### Allowed File Types

Only image files are allowed:
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)
- HEIC/HEIF (.heic, .heif)

## 🌐 API Endpoints

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/events` | Create a new event |
| GET | `/api/events/:eventId` | Get event details |
| GET | `/api/events/join/:joinCode` | Look up event by join code |
| GET | `/api/events/:eventId/download` | Download all photos as ZIP |
| POST | `/api/events/:eventId/download-selected` | Download selected photos as ZIP |

### Photos

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events/:eventId/photos` | Get all photos for an event |
| POST | `/api/events/:eventId/photos` | Upload a photo |
| DELETE | `/api/events/:eventId/photos/:photoId` | Delete a photo |

### Socket.IO Events

| Event | Description |
|-------|-------------|
| `join-event` | User joins an event room |
| `leave-event` | User leaves an event room |
| `photo-uploaded` | New photo uploaded |
| `photo-deleted` | Photo deleted |
| `upload-started` | User started uploading |
| `users-online` | Online user count update |

## 🎨 Customization

### Custom Hooks Architecture

The project uses **4 focused custom hooks** for clean separation of concerns:

1. **useEvent.ts** - Event data management
   - Fetches event details
   - Handles loading and error states
   - Simple, focused responsibility

2. **usePhotos.ts** - Photo management (consolidated)
   - Photo state management
   - Photo selection (multi-select)
   - Download functionality (all/selected)
   - Add/remove/delete operations
   - All photo-related logic in one place

3. **useUpload.ts** - File upload handling
   - File selection and validation
   - Upload progress tracking
   - Preview management
   - Error handling

4. **useSocketEvents.ts** - Real-time communication (consolidated)
   - Socket.IO connection management
   - Real-time event handlers
   - Online user tracking
   - Upload notifications
   - All WebSocket logic in one place

This consolidation keeps the codebase simple while maintaining clear responsibilities.

### Changing Colors

Edit `src/index.css` to customize the color scheme:
```css
:root {
  --primary: #6366f1;    /* Indigo */
  --background: #0a0f1e; /* Dark blue */
}
```

### Changing Event Expiry

Edit `server/lib/cleanup.js`:
```javascript
const PHOTO_EXPIRY_MS = 2 * 60 * 60 * 1000; // 2 hours
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to Vercel or Netlify

3. Set environment variable:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

### Backend (Railway/Render/Heroku)

1. Push to GitHub

2. Connect your repository to Railway/Render

3. Set environment variables:
   ```
   PORT=3001
   MONGODB_URI=your-mongodb-connection-string
   FRONTEND_URL=https://your-frontend-url.com
   ```

4. Deploy!

### MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Update `MONGODB_URI` in your `.env` file

## 🧪 Testing

```bash
# Run frontend tests
npm run test

# Run backend tests
cd server
npm run test
```

## 📝 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
```

### Backend (server/.env)
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/circlo
FRONTEND_URL=http://localhost:5173
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Built with React, TypeScript, and Node.js
- Real-time functionality powered by Socket.IO
- QR codes generated with qrcode.react
- Icons from Heroicons

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Made with ❤️ for easy event photo sharing**
