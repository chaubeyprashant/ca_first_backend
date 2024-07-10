
import express from 'express'
import {register,login,getUserData,updateUser,logout,listAllUsers, paginatdUsers, deleteUser} from "../controllers/user_controller.js"
const router = express.Router();
import { authMiddleware, roleMiddleware } from '../middleware/auth_middleware.js';

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/user', authMiddleware, getUserData);
router.put('/user', authMiddleware, updateUser);
router.post('/logout', authMiddleware, logout);
router.get('/users', authMiddleware, roleMiddleware('admin'), listAllUsers);
router.get('/users/paginated', authMiddleware,paginatdUsers);
router.delete('/users/:id',authMiddleware,deleteUser)


export default router;
