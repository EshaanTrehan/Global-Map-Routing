# Global Map Routing 🌍🚏

Explore the world with the **Global Map Routing** application. This web-based tool provides a platform to view and analyze geographical routes, supported by image and video uploads. The application combines server-side logic with client-side interactivity for a comprehensive mapping experience.

## 🚀 Features

- **Interactive Map Viewing**: Navigate through different geographical locations using an interactive map interface.
- **Media Uploads**: Users can upload images and videos related to specific locations or routes.
- **Real-Time Data Handling**: The server processes and serves media and other data in real-time.

## 📁 File Structure

- 📂 `/public` - Contains the HTML, CSS, and JavaScript files for the client-side interface.
  - `index.html` - The main HTML document.
  - `style.css` - CSS styles for the application.
  - `js/app.js` - JavaScript for interactive client-side logic.
- 📂 `/server` - Contains server-side JavaScript.
  - `server.js` - Main server script handling API requests and static files.
- 📂 `/uploads` - Directory for storing uploaded media files.

## 🔧 Setup & Execution

1. Ensure you have Node.js installed on your system.
2. Navigate to the project directory and install dependencies:
   ```bash
   npm install
3. Start the server:
   ```bash
   node server/server.js
4. Open a web browser and go to `http://localhost:3000` to access the application.

## 🧪 Testing

1. Launch the application using the above steps.
2. Try uploading different media files and see how the application handles them.
3. Interact with the map to ensure all functionalities are working as expected.

## 🧠 Technical Details

- **Client-Side Technology**: HTML, CSS, and JavaScript are used for the frontend.
- **Server-Side Technology**: Node.js is used for backend operations.
- **Data Handling**: Media files are handled and stored in the `/uploads` directory.

## 🌟 Support

For any technical issues or contributions, please open an issue on the project's GitHub repository page.
