<template>
  <div>
    <h2>Kullanıcılar</h2>
      
    <v-data-table
        :headers="[
          { title: 'ID', key: 'id' },
          { title: 'Ad', key: 'name' },
          { title: 'Email', key: 'email' },
          { title: 'Doğrulama', key: 'email_verified_at' },
          { title: 'Kayıt Tarihi', key: 'created_at' },
          { title: 'İşlemler', key: 'actions', sortable: false }
        ]"
        :items="users"
        class="mt-8"
      >
        <template #item.created_at="{ item }">
          {{ new Date(item.created_at).toLocaleDateString('tr-TR') }}
        </template>
        <template #item.actions="{ item }">
          <v-btn color="red" @click="deleteUser(item.id)" size="small">Sil</v-btn>
        </template>
    </v-data-table>


    <div v-if="pending">Yükleniyor...</div>

    <div v-else-if="error" class="error">
      Hata: {{ error }}
    </div>

    <div v-else>
      <div v-for="user in users" :key="user.id" class="user-card">
        <pre>{{ JSON.stringify(user, null, 2) }}</pre>
        <!-- <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p>{{ user.email_verified_at }}</p> -->
        <!-- <p>Kayıt: {{ new Date(user.created_at).toLocaleDateString('tr-TR') }}</p> -->
        <!-- <v-btn @click="deleteUser(user.id)">Sil</v-btn> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getUsers, deleteUser: removeUser } = useUsers()

const { data: users, pending, error, refresh } = await useAsyncData('users', getUsers)

const deleteUser = async (id: number) => {
  
  if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) {
    return
  }
  
  try {
    await removeUser(id)
    await refresh() // Listeyi yenile
  } catch (error) {
    console.error('Silme hatası:', error)
  }
}
</script>

<style scoped>
.user-card {
  border: 1px solid #ddd;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.error {
  color: red;
  padding: 1rem;
  background: #ffeaea;
  border-radius: 4px;
}
</style>