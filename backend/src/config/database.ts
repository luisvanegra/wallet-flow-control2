import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la conexión a MySQL Railway
const dbConfig = {
  host: process.env.DB_HOST || 'yamanote.proxy.rlwy.net',
  port: parseInt(process.env.DB_PORT || '41495'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'moneytraker_db',
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Crear pool de conexiones
export const pool = mysql.createPool(dbConfig);

export const connectDatabase = async () => {
  try {
    console.log('🔄 Conectando a la base de datos MySQL...');
    console.log('📝 Configuración de conexión:', {
      host: dbConfig.host,
      port: dbConfig.port,
      database: dbConfig.database,
      user: dbConfig.user
    });
    
    // Verificar la conexión
    await pool.query('SELECT 1');
    console.log('✅ Conexión exitosa a la base de datos MySQL Railway');
    console.log('📊 Base de datos respondiendo correctamente');
    
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    console.error('🔍 Detalles del error:', {
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage
    });
    throw error;
  }
};

export const query = async (sql: string, params: any[] = []): Promise<any> => {
  try {
    // --- Iniciar Logging de Depuración ---
    console.log('DEBUG_DB_QUERY: SQL ->', sql);
    console.log('DEBUG_DB_QUERY: Params ->', params);
    // --- Fin Logging de Depuración ---
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('❌ Error ejecutando query:', error);
    throw error;
  }
};

// Cerrar pool al terminar la aplicación
process.on('SIGINT', async () => {
  await pool.end();
  console.log('🔌 Pool de conexiones cerrado');
  process.exit(0);
});
