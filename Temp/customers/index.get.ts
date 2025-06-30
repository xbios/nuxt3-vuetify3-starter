import { executeQuery } from '~/utils/database'

export default defineEventHandler(async (event) => {
  try {
    const cari = await executeQuery('SELECT * FROM cari ORDER BY created_at DESC')
    
    return {
      success: true,
      data: cari
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcılar getirilirken hata oluştu'
    })
  }
})