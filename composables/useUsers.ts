// composables/useUsers.ts
export interface User {
  // id: number
  // name: string
  // email: string
  // phone: string
  // department: string
  // status: 'Aktif' | 'Pasif'
  // joinDate: string
  // lastLogin?: string
  // accountType?: string
  // permissions?: string[]
}

export interface UserFormData {
  name: string
  email: string
  phone: string
  department: string
  status: 'Aktif' | 'Pasif'
}

export const useUsers = () => {
  // Mock data - replace with actual API calls
  // const mockUsers: User[] = [
  //   {
  //     id: 1,
  //     name: 'Ahmet Yılmaz Akın',
  //     email: 'ahmet.yilmaz@example.com',
  //     phone: '+90 532 123 4567',
  //     department: 'Yazılım Geliştirme',
  //     status: 'Aktif',
  //     joinDate: '15.03.2023',
  //     lastLogin: '2024-01-15T10:30:00',
  //     accountType: 'Admin',
  //     permissions: ['Admin', 'Kullanıcı', 'Editör','Guest']
  //   },
  //   {
  //     id: 2,
  //     name: 'Ayşe Kara',
  //     email: 'ayse.kara@example.com',
  //     phone: '+90 533 234 5678',
  //     department: 'İnsan Kaynakları',
  //     status: 'Aktif',
  //     joinDate: '22.05.2023',
  //     lastLogin: '2024-01-14T16:45:00',
  //     accountType: 'Standart',
  //     permissions: ['Kullanıcı']
  //   },
  //   {
  //     id: 3,
  //     name: 'Mehmet Demir',
  //     email: 'mehmet.demir@example.com',
  //     phone: '+90 534 345 6789',
  //     department: 'Muhasebe',
  //     status: 'Pasif',
  //     joinDate: '08.01.2023',
  //     lastLogin: '2023-12-20T09:15:00',
  //     accountType: 'Standart',
  //     permissions: ['Kullanıcı']
  //   },
  //   {
  //     id: 4,
  //     name: 'Fatma Çelik',
  //     email: 'fatma.celik@example.com',
  //     phone: '+90 535 456 7890',
  //     department: 'Pazarlama',
  //     status: 'Aktif',
  //     joinDate: '12.07.2023',
  //     lastLogin: '2024-01-16T14:20:00',
  //     accountType: 'Editör',
  //     permissions: ['Kullanıcı', 'Editör']
  //   },
  //   {
  //     id: 5,
  //     name: 'Ali Şahin',
  //     email: 'ali.sahin@example.com',
  //     phone: '+90 536 567 8901',
  //     department: 'Satış',
  //     status: 'Aktif',
  //     joinDate: '30.09.2023',
  //     lastLogin: '2024-01-16T11:00:00',
  //     accountType: 'Standart',
  //     permissions: ['Kullanıcı']
  //   }
  // ]

  
  // Fetch all users
  // const fetchUsers = async (): Promise<User[]> => {
  //   // Simulate API call    
  //   return new Promise((resolve) => {
  //     setTimeout(() => {
  //       resolve([...mockUsers])
  //     }, 500)
  //   })
  // }

  const fetchUsers = async (): Promise<User[]> => {
     const { data } = await $fetch<ApiResponse<User[]>>('/api/customers')
    return data || []
  }

  // Fetch single user by ID
  const fetchUser = async (id: number): Promise<User | null> => {
    try {
      const { data } = await $fetch<ApiResponse<User>>(`/api/customers/${id}`)
      return data || null
    } catch (error) {
      console.error('Kullanıcı getirme hatası:', error)
      return null
    }
    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     const user = mockUsers.find(u => u.id === id)
    //     if (user) {
    //       resolve({ ...user })
    //     } else {
    //       reject(new Error('User not found'))
    //     }
    //   }, 500)
    // })
  }

  // Create new user
  const createUser = async (userData: UserFormData): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser: User = {
          ...userData,
          id: Math.max(...mockUsers.map(u => u.id)) + 1,
          joinDate: new Date().toLocaleDateString('tr-TR'),
          lastLogin: new Date().toISOString(),
          accountType: 'Standart',
          permissions: ['Kullanıcı']
        }
        mockUsers.push(newUser)
        resolve(newUser)
      }, 500)
    })
  }

  // Update user
  const updateUser = async (id: number, userData: Partial<UserFormData>): Promise<User> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id)
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...userData }
          resolve(mockUsers[index])
        } else {
          reject(new Error('User not found'))
        }
      }, 500)
    })
  }

  // Delete user
  const deleteUser = async (id: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockUsers.findIndex(u => u.id === id)
        if (index !== -1) {
          mockUsers.splice(index, 1)
          resolve(true)
        } else {
          reject(new Error('User not found'))
        }
      }, 500)
    })
  }

  // Search users
  const searchUsers = async (query: string): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockUsers.filter(user => 
          user.name.toLowerCase().includes(query.toLowerCase()) ||
          user.email.toLowerCase().includes(query.toLowerCase()) ||
          user.department.toLowerCase().includes(query.toLowerCase())
        )
        resolve(filtered)
      }, 300)
    })
  }

  // Filter users by status
  const filterUsersByStatus = async (status: 'Aktif' | 'Pasif'): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtered = mockUsers.filter(user => user.status === status)
        resolve(filtered)
      }, 300)
    })
  }

  // Get user statistics
  const getUserStats = async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          total: mockUsers.length,
          active: mockUsers.filter(u => u.status === 'Aktif').length,
          inactive: mockUsers.filter(u => u.status === 'Pasif').length,
          departments: [...new Set(mockUsers.map(u => u.department))].length
        }
        resolve(stats)
      }, 200)
    })
  }

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    searchUsers,
    filterUsersByStatus,
    getUserStats
  }
}

// Validation rules
export const useUserValidation = () => {
  const rules = {
    required: (value: string) => !!value || 'Bu alan gereklidir',
    email: (value: string) => {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return pattern.test(value) || 'Geçerli bir e-posta adresi giriniz'
    },
    phone: (value: string) => {
      const pattern = /^(\+90|0)?[0-9]{10}$/
      return pattern.test(value.replace(/\s/g, '')) || 'Geçerli bir telefon numarası giriniz'
    },
    minLength: (min: number) => (value: string) => 
      value.length >= min || `En az ${min} karakter olmalıdır`
  }

  return { rules }
}

// Department options
export const useDepartments = () => {
  const departments = [
    'Yazılım Geliştirme',
    'İnsan Kaynakları',
    'Muhasebe',
    'Pazarlama',
    'Satış',
    'Operasyon',
    'Yönetim',
    'Destek'
  ]

  return { departments }
}