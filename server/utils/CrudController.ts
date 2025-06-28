// Alternative: Class-based approach için ayrı dosya
// server/utils/CrudController.ts

export class CrudController {
  private connection: any
  private tableName: string
  
  constructor(connection: any, tableName: string) {
    this.connection = connection
    this.tableName = tableName
  }
  
  async findAll(options: {
    where?: Record<string, any>
    orderBy?: string
    limit?: number
    offset?: number
  } = {}) {
    let sql = `SELECT * FROM ${this.tableName}`
    const params: any[] = []
    
    if (options.where) {
      const conditions = Object.entries(options.where)
        .map(([key, value]) => {
          params.push(value)
          return `${key} = ?`
        })
      sql += ` WHERE ${conditions.join(' AND ')}`
    }
    
    if (options.orderBy) {
      sql += ` ORDER BY ${options.orderBy}`
    }
    
    if (options.limit) {
      sql += ` LIMIT ${options.limit}`
      if (options.offset) {
        sql += ` OFFSET ${options.offset}`
      }
    }
    
    const [rows] = await this.connection.execute(sql, params)
    return rows
  }
  
  async findById(id: string | number) {
    const [rows] = await this.connection.execute(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
    return rows[0] || null
  }
  
  async create(data: Record<string, any>) {
    const fields = Object.keys(data).join(', ')
    const placeholders = Object.keys(data).map(() => '?').join(', ')
    const values = Object.values(data)
    
    const [result] = await this.connection.execute(
      `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`,
      values
    )
    
    return this.findById((result as any).insertId)
  }
  
  async update(id: string | number, data: Record<string, any>) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(data), id]
    
    await this.connection.execute(
      `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`,
      values
    )
    
    return this.findById(id)
  }
  
  async delete(id: string | number) {
    const [result] = await this.connection.execute(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    )
    
    return { success: true, affected: (result as any).affectedRows }
  }
}