import express from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';
import  authMiddleware,  {authorize } from '../middleware/authMiddleware.js';
import User from '../models/User.js'


const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para iniciar sesión
router.post('/login', loginUser);

// Ruta para acceder a recursos (con restricciones según el rol)
router.get('/', authMiddleware, (req, res) => {
  if (req.user.role !== 'Administrador') {
    return res.status(200).json({ message: 'Acceso a los recursos permitido' });
  } else {
    return res.status(403).json({ error: 'No tienes permiso para acceder a estos recursos' });
  }
});

// Ruta protegida de ejemplo (perfil del usuario)
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    res.json({ 
      id: user._id,
      name: user.name,
      last_name: user.last_name,
      email: user.email,
      image: user.image,
      role: user.role.roleName 
    });
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ error: 'Error al obtener el perfil del usuario' });
  }
});

// Ruta para obtener todos los usuarios (solo para administradores)
router.get('/users', authMiddleware, authorize('Administrador'), async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

export default router;