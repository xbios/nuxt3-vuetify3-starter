<template>
  <div>
    <h2>Kullanıcılar</h2>

    <div v-if="pending">Yükleniyor...</div>

    <div v-else-if="error" class="error">
      Hata: {{ error }}
    </div>

    <div v-else>
      <div v-for="user in users" :key="user.id" class="user-card">
        <h3>{{ user.name }}</h3>
        <p>{{ user.email }}</p>
        <p>{{ user.email_verified_at }}</p>
        <p>{{ user }}</p>

        <p>Kayıt: {{ new Date(user.created_at).toLocaleDateString('tr-TR') }}</p>

        <v-btn @click="deleteUser(user.id)">Sil</v-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { getUsers, deleteUser: removeUser } = useUsers()

const { data: users, pending, error, refresh } = await useAsyncData('users', getUsers)

const deleteUser = async (id: number) => {
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