interface Customer {
  // id: number
  // name: string
  // email: string
  // created_at: string
  // // email_verified_at?: string
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export const useCustomers = () => {
  const getCustomers = async (): Promise<Customer[]> => {
    const { data } = await $fetch<ApiResponse<Customer[]>>('/api/customers')
    return data || []
  }

  const getCustomer = async (id: number): Promise<Customer | null> => {
    try {
      const { data } = await $fetch<ApiResponse<Customer>>(`/api/customers/${id}`)
      return data || null
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error)
      return null
    }
  }

  const createCustomer = async (customerData: { name: string; email: string; password: string }) => {
    return await $fetch<ApiResponse<Customer>>('/api/customers', {
      method: 'POST',
      body: customerData
    })
  }

  const updateCustomer = async (id: number, customerData: { name?: string; email?: string }) => {
    return await $fetch<ApiResponse<any>>(`/api/customers/${id}`, {
      method: 'PUT',
      body: customerData
    })
  }

  const deleteCustomer = async (id: number) => {
    return await $fetch<ApiResponse<any>>(`/api/customers/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getCustomers,
    getCustomer,
    createCustomer,
    updateCustomer,
    deleteCustomer
  }
}