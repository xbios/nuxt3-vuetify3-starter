import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kullanıcı ID gerekli'
    })
  }

  try {
    const users = await executeQuery('SELECT * FROM users WHERE id = ?', [id])
    
    if (!Array.isArray(users) || users.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Kullanıcı bulunamadı'
      })
    }

    return {
      success: true,
      data: users[0]
    }
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcı getirilirken hata oluştu'
    })
  }
})