import { executeQuery } from '~/utils/database'

interface UpdateUserBody {
  name?: string
  email?: string
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<UpdateUserBody>(event)
  
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kullanıcı ID gerekli'
    })
  }

  try {
    // Kullanıcı var mı kontrol et
    const existingUsers = await executeQuery('SELECT id FROM cari WHERE id = ?', [id])
    
    if (!Array.isArray(existingUsers) || existingUsers.length === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Kullanıcı bulunamadı'
      })
    }

    // Güncelleme sorgusu oluştur
    const updateFields = []
    const updateValues = []
    
    if (body.name) {
      updateFields.push('name = ?')
      updateValues.push(body.name)
    }
    
    if (body.email) {
      updateFields.push('email = ?')
      updateValues.push(body.email)
    }
    
    if (updateFields.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Güncellenecek alan belirtilmedi'
      })
    }
    
    updateFields.push('updated_at = NOW()')
    updateValues.push(id)

    await executeQuery(
      `UPDATE cari SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    )

    return {
      success: true,
      message: 'Kullanıcı başarıyla güncellendi'
    }
  } catch (error) {
    if (error.statusCode) throw error
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Kullanıcı güncellenirken hata oluştu'
    })
  }
})