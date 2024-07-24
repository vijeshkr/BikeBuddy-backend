const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const PORT = 3200 || process.env.PORT;
dotenv.config();
const app = express();
const connectDB = require('./config/db');
const router = require('./router/index');
const cookieParser = require('cookie-parser');


// Middlewares
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// Router set
app.use('/api',router);

// When server is connected to database then run the server
connectDB().then(() => {
    app.listen(PORT,() => {
        console.log(`Server is running on port ${PORT}`);
    });
});