interface User {
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

export const useUsers = () => {
  const getUsers = async (): Promise<User[]> => {
    const { data } = await $fetch<ApiResponse<User[]>>('/api/users')
    return data || []
  }

  const getUser = async (id: number): Promise<User | null> => {
    try {
      const { data } = await $fetch<ApiResponse<User>>(`/api/users/${id}`)
      return data || null
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error)
      return null
    }
  }

  const createUser = async (userData: { name: string; email: string; password: string }) => {
    return await $fetch<ApiResponse<User>>('/api/users', {
      method: 'POST',
      body: userData
    })
  }

  const updateUser = async (id: number, userData: { name?: string; email?: string }) => {
    return await $fetch<ApiResponse<any>>(`/api/users/${id}`, {
      method: 'PUT',
      body: userData
    })
  }

  const deleteUser = async (id: number) => {
    return await $fetch<ApiResponse<any>>(`/api/users/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
  }
}