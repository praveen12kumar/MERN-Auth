import express from 'express';
const userRoutes = express.Router();

import { protect } from '../middleware/authMiddleware.js';
import {
    authUser, 
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile} from "../controller/userController.js";


userRoutes.post('/', registerUser);

userRoutes.post('/auth', authUser);

userRoutes.post('/logout', logoutUser);

userRoutes.get('/profile', protect, getUserProfile);

userRoutes.put('/profile',protect, updateUserProfile);

export default userRoutes;


