import mysql from 'mysql2/promise'

let connection: mysql.Connection | null = null

export async function connectToDatabase() {
  if (connection) {
    return connection
  }

  const config = useRuntimeConfig()
  
  try {
    connection = await mysql.createConnection({
      host: config.dbHost,
      port: parseInt(config.dbPort as string),
      user: config.dbUser,
      password: config.dbPassword,
      database: config.dbName,
      timezone: '+03:00', // Türkiye saat dilimi
      charset: 'utf8mb4'
    })
    
    console.log('MySQL veritabanına bağlandı')
    return connection
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error)
    throw error
  }
}

export async function executeQuery(query: string, params: any[] = []) {
  const db = await connectToDatabase()
  try {
    const [results] = await db.execute(query, params)
    return results
  } catch (error) {
    console.error('Query execution error:', error)
    throw error
  }
}

// Connection Pool için alternatif
export function createConnectionPool() {
  const config = useRuntimeConfig()
  
  return mysql.createPool({
    host: config.dbHost,
    port: parseInt(config.dbPort as string),
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+03:00',
    charset: 'utf8mb4'
  })
}