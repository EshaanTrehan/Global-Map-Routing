const express = require('express');
const multer = require('multer');
const path = require('path');

// Set up storage engine with `multer`
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        // Append the original file extension
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize `multer` with the storage engine
const upload = multer({ storage: storage });

const app = express();

app.use(express.urlencoded({ extended: true })); 
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route to handle file uploads
app.post('/upload', upload.single('file'), function(req, res) {
    console.log('Uploaded: ' + req.file.path); 
    console.log('Marker Name: ' + req.body.markerName);  
    res.json({ success: true, message: "File and marker name uploaded successfully" });
});

app.listen(3001, () => {
    console.log('Server started on port 3001');
});
