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
    const cari = await executeQuery('SELECT * FROM cari WHERE id = ?', [id])

    if (!Array.isArray(cari) || cari.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Kullanıcı bulunamadı'
      })
    }

    return {
      success: true,
      data: cari[0]
    }
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcı getirilirken hata oluştu'
    })
  }
})