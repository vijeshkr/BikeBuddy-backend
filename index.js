const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = 3200 || process.env.PORT;
dotenv.config();
const { app, server } = require('./config/socket');
const connectDB = require('./config/db');
const router = require('./router/index');
const cookieParser = require('cookie-parser');
const multer = require('multer')


// Middlewares
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/images', express.static('images'));

// Multer configuration for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {

        cb(null, Date.now() + file.originalname);
    }
})

const upload = multer({ storage: storage })

// Route for handling uploads
app.post('/api/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    res.status(200).json(file.filename)
});

// Router set
app.use('/api', router);

// When server is connected to database then run the server
connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});