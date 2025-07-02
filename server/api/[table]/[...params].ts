//import mysql from 'mysql2/promise'
import { connectToDatabase, executeQuery } from '~/utils/database'

// Database connection
// const dbConfig = {
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME || 'proje_db'
// }

// Güvenlik için izin verilen tablolar
const allowedTables = [
  'users', 'products', 'orders', 'categories', 'posts','cari'
  // Diğer tablo isimlerini buraya ekleyin
]

// Tablo şemaları (opsiyonel - validation için)
const tableSchemas = {
  users: {
    id: 'number',
    name: 'string',
    email: 'string',
    created_at: 'datetime'
  },
  products: {
    id: 'number',
    name: 'string',
    price: 'number',
    category_id: 'number'
  },
  cari: {
    
  }
  // Diğer tablo şemalarını ekleyin
}

export default defineEventHandler(async (event) => {

  console.log(' params crud:', event.context.params)

  const method = getMethod(event)
  const params = getRouterParams(event)
  const query = getQuery(event)
  
  const tableName = params.table as string
  const resourceId = params.params
  
  // Güvenlik kontrolü
  if (!allowedTables.includes(tableName)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Table access not allowed'
    })
  }
  
  let connection
  
  try {
    //connection = await mysql.createConnection(dbConfig)

    //connection = await connectToDatabase()

    
    
    switch (method) {
      case 'GET':  
        return await handleGet(connection, tableName, resourceId, query)
      
      case 'POST':
        const postBody = await readBody(event)
        return await handlePost(connection, tableName, postBody)
      
      case 'PUT':
        const putBody = await readBody(event)
        return await handlePut(connection, tableName, resourceId, putBody)
      
      case 'DELETE':
        return await handleDelete(connection, tableName, resourceId)
      
      default:
        throw createError({
          statusCode: 405,
          statusMessage: 'Method not allowed'
        })
    }
  } catch (error) {
    console.error('Database error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Database operation failed'
    })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
})

// GET işlemleri
async function handleGet(connection: any, table: string, id?: string, query?: any) {
  if (id) {    
    console.log('id table:', table, ' id:', id)
    // // Tek kayıt getir
    const rows = await executeQuery(
      `SELECT * FROM ${table} WHERE id = ?`,
      [id]
    )     
    return rows[0] || null
     
  } else {

    return rows[0] || null

    // Tüm kayıtları getir (pagination ve filtering ile)
    let sql = `SELECT * FROM ${table}`
    const params: any[] = []
    const conditions: string[] = []
    
    // Filtering
    if (query.filter) {
      const filters = JSON.parse(query.filter as string)
      Object.entries(filters).forEach(([key, value]) => {
        conditions.push(`${key} = ?`)
        params.push(value)
      })
    }
    
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`
    }
    
    // Sorting
    if (query.sort) {
      sql += ` ORDER BY ${query.sort}`
      if (query.order === 'desc') {
        sql += ' DESC'
      }
    }
    
    // Pagination
    if (query.limit) {
      sql += ` LIMIT ${parseInt(query.limit as string)}`
      if (query.offset) {
        sql += ` OFFSET ${parseInt(query.offset as string)}`
      }
    }
    console.log(' table:', table, 'with id:', id)
    const rows = await executeQuery(sql, params)
    return rows
  
  }
}

// POST işlemleri
async function handlePost(connection: any, table: string, data: any) {
  const fields = Object.keys(data).join(', ')
  const placeholders = Object.keys(data).map(() => '?').join(', ')
  const values = Object.values(data)
  
  const [result] = await connection.execute(
    `INSERT INTO ${table} (${fields}) VALUES (${placeholders})`,
    values
  )
  
  // Yeni oluşturulan kaydı döndür
  const [newRecord] = await connection.execute(
    `SELECT * FROM ${table} WHERE id = ?`,
    [(result as any).insertId]
  )
  
  return newRecord[0]
}

// PUT işlemleri
async function handlePut(connection: any, table: string, id: string, data: any) {
  const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
  const values = [...Object.values(data), id]
  
  await connection.execute(
    `UPDATE ${table} SET ${fields} WHERE id = ?`,
    values
  )
  
  // Güncellenmiş kaydı döndür
  const [updatedRecord] = await connection.execute(
    `SELECT * FROM ${table} WHERE id = ?`,
    [id]
  )
  
  return updatedRecord[0]
}

// DELETE işlemleri
async function handleDelete(connection: any, table: string, id: string) {
  const [result] = await connection.execute(
    `DELETE FROM ${table} WHERE id = ?`,
    [id]
  )
  
  return { success: true, affected: (result as any).affectedRows }
}