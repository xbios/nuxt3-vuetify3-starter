import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const users = await executeQuery('SELECT * FROM users ORDER BY created_at DESC')
    
    return {
      success: true,
      data: users
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcılar getirilirken hata oluştu'
    })
  }
})