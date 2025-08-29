import express from 'express';
import path from 'path';
import connect from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authMiddleware from './middleware/authMiddleware.js';



dotenv.config();

//Conexion a la base de datos 
connect();

const app = express();

app.use(cors());
app.use(express.json());

// Sirve archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(path.resolve(), 'uploads'))); //quitar


 //Rutas de autenticacion
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

//Rutas protegidas
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/resources', authMiddleware, resourceRoutes);




const PORT = process.env.PORT || 5000;

console.log("*******************************************************************************************************************");
console.log("Bienvenido al servidor de EduSafe\nNuestra misión es mejorar el ambiente en el que interactúan nuestros estudiantes");
console.log("*******************************************************************************************************************");
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

export default app;  