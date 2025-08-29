import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
//import User from '../models/User.js';
//import Role from '../models/Role.js';

// *****Inicio de sesión de usuarios*****
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).populate('role');
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
  
      // Verifica que el rol exista antes de acceder a 'roleName'
      if (!user.role) {
        return res.status(400).json({ message: 'El usuario no tiene un rol asignado' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role.roleName },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );
  
      res.status(200).json({ 
        message: `Inicio de sesión exitoso. Bienvenido ${user.name}!`,
        token, 
        user: {
          id: user._id,
          name: user.name,
          last_name: user.last_name,
          email: user.email,
          image: user.image,
          role: user.role.roleName 
        }
      });
    } catch (error) {
      console.error('Error en el inicio de sesión', error);
      res.status(500).json({ error: error.message });
    }
  };



// *****Registro de usuarios*****
export const registerUser = async (req, res) => {
  const { name, last_name, email, password, roleName } = req.body;

  try {
    // Verificación de la contraseña
    if (!password) {
      return res.status(400).json({ message: 'La contraseña es requerida' });
    }

    // Verificación de si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Buscamos el rol en la base de datos usando el roleName proporcionado
    const role = await Role.findOne({ roleName: roleName || 'Estudiante' });
    if (!role) {
      return res.status(400).json({ message: 'Rol no válido' });
    }

    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creamos el usuario
    user = new User({
      name,
      last_name,
      email,
      password: hashedPassword,
      role: role._id,
    });

    // Guardamos el usuario en la base de datos
    await user.save();

    res.status(201).json({ message: 'Usuario registrado exitosamente', user });
  } catch (error) {
    // Muestra el error en la consola del servidor
    console.error('Error en el registro:', error);
    res.status(500).json({ error: error.message });
  }
};

