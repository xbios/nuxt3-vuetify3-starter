import { executeQuery } from '~/utils/database'

interface CreateUserBody {
  name: string
  email: string
  password: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateUserBody>(event)
  
  // Validation
  if (!body.name || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ad, email ve şifre gerekli'
    })
  }

  try {
    // Email kontrolü
    const existingUsers = await executeQuery(
      'SELECT id FROM cari WHERE email = ?', 
      [body.email]
    )
    
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Bu email ile zaten bir kullanıcı kayıtlı'
      })
    }

    // Yeni kullanıcı ekleme
    const result = await executeQuery(
      'INSERT INTO cari (name, email, password, created_at) VALUES (?, ?, ?, NOW())',
      [body.name, body.email, body.password]
    )

    return {
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: {
        id: (result as any).insertId,
        name: body.name,
        email: body.email
      }
    }
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcı oluşturulurken hata oluştu'
    })
  }
})