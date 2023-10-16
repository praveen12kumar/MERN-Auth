import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';
const PORT = process.env.PORT || 3000;

connectDB();
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/api/users', userRoutes);


// middlewares for rout not found or 
// route exist but have some error
app.use(notFound);
app.use(errorHandler);




app.listen(PORT, () => {
    console.log(`Serving is running on port: ${PORT}`);
});


// **POST /api/users                -Register a new user
// **POST /api/users/auth           -Authenticate a new user and token
// **POST /api/users/logout         -Log out
// **GET /api/users/profile         -get user Profile
// **PUT /api/users/profile        - upload profile