import jwt from 'jsonwebtoken';
import User from '../models/User';

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No hay token, autorización denegada ❌' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || !decoded.role) {
      return res.status(403).json({ message: 'Información de usuario incompleta en el token' });
    }

    req.user = { id: decoded.id, role: decoded.role };
    console.log('Usuario autenticado:', req.user);
    next();
  } catch (error) {
    console.error('Error en la verificación del token:', error);
    res.status(401).json({ message: 'El token no es válido' });
  }
};

// Función para verificar roles específicos
export const authorize = (requiredRoles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('role');
    if (!user) {
      return res.status(403).json({ message: 'Usuario no encontrado' });
    }

    if (requiredRoles.includes(user.role.roleName)) {
      console.log('Autorización concedida para el rol:', user.role.roleName);
      next();
    } else {
      console.warn(`Rol ${user.role.roleName} no tiene acceso a esta acción.`);
      res.status(403).json({ message: 'No tienes permiso para realizar esta acción.' });
    }
  } catch (error) {
    console.error('Error de autorización:', error);
    res.status(500).json({ message: 'Error de autorización' });
  }
};



export default authMiddleware;