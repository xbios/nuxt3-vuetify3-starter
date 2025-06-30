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
    const result = await executeQuery('DELETE FROM cari WHERE id = ?', [id])
    
    if ((result as any).affectedRows === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Kullanıcı bulunamadı'
      })
    }

    return {
      success: true,
      message: 'Kullanıcı başarıyla silindi'
    }
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcı silinirken hata oluştu'
    })
  }
})