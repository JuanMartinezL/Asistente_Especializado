import Pool from "pg"; 
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error al conectar a la base de datos:', err.message);
  }
  console.log('🎉🎉Conectado correctamente a la DB de Asistente personalizado🎉🎉\nGracias por ser parte de este gran proyecto🥰');
});	

export default pool;