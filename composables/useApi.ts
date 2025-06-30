export const useTableApi = (tableName: string) => {
  const baseUrl = `/api/${tableName}`
  
  return {
    // GET all records
    async getAll(params: Record<string, any> = {}) {
      return await $fetch(baseUrl, { params })
    },
    
    // GET single record
    async getById(id: string | number) {
      return await $fetch(`${baseUrl}/${id}`)
    },
    
    // POST new record
    async create(data: Record<string, any>) {
      return await $fetch(baseUrl, {
        method: 'POST',
        body: data
      })
    },
    
    // PUT update record
    async update(id: string | number, data: Record<string, any>) {
      return await $fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        body: data
      })
    },
    
    // DELETE record
    async delete(id: string | number) {
      return await $fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
      })
    }
  }
}