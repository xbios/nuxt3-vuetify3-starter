export abstract class BaseRepository<T = any> {
  protected connection: any
  protected tableName: string
  
  constructor(connection: any, tableName: string) {
    this.connection = connection
    this.tableName = tableName
  }
  
  async findAll(criteria: any = {}): Promise<T[]> {
    // Implementation
    return []
  }
  
  async findById(id: string | number): Promise<T | null> {
    // Implementation
    return null
  }
  
  async create(data: Partial<T>): Promise<T> {
    // Implementation
    return {} as T
  }
  
  async update(id: string | number, data: Partial<T>): Promise<T> {
    // Implementation
    return {} as T
  }
  
  async delete(id: string | number): Promise<boolean> {
    // Implementation
    return true
  }
  
  // Custom query methods
  protected async query(sql: string, params: any[] = []): Promise<any> {
    const [rows] = await this.connection.execute(sql, params)
    return rows
  }
}