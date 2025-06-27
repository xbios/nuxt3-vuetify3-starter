<template>
  <div>
    <!-- Page Title -->
    <Head>
      <Title>Kullanıcılar - Yönetim Paneli</Title>
    </Head>

    <v-container fluid class="gradient-bg min-h-screen pa-6">
      <v-row justify="center">
        <v-col cols="12" xl="10">
          <v-card class="card-elevation" elevation="8">
            <!-- Header -->
            <v-card-title class="table-header d-flex justify-space-between align-center pa-6">
              <div class="d-flex align-center">
                <v-icon color="primary" size="32" class="mr-3">mdi-account-group</v-icon>
                <h2 class="text-h4 font-weight-bold text-primary">Kullanıcı Listesi</h2>
              </div>
              <v-divider vertical class="mx-4" />
                <div class="d-flex align-center" style="margin-left:auto;">
                <v-btn class="ma-2" color="primary" size="small" @click="refresh2">Yenile</v-btn>
                </div>
              <v-btn 
                color="success" 
                size="small"                 
                prepend-icon="mdi-plus"
                @click="openAddDialog"
                class="px-6"
                elevation="2"
              >
                Yeni Ekle
              </v-btn>
            </v-card-title>

            <!-- DataTable -->
            <v-card-text class="pa-0">
              <v-data-table
                :headers="headers"
                :items="users"
                :search="search"
                class="elevation-0"
                :items-per-page="10"
                :loading="loading"
                loading-text="Veriler yükleniyor..."
              >
                <!-- Arama Alanı -->
                <template v-slot:top>
                  <v-toolbar flat class="px-6 py-4">
                    <v-text-field
                      v-model="search"
                      append-inner-icon="mdi-magnify"
                      label="Arama..."
                      single-line
                      hide-details
                      variant="outlined"
                      density="comfortable"
                      class="max-width-400"
                    />
                  </v-toolbar>
                </template>

                <!-- Status Column -->
                <template v-slot:item.status="{ item }">
                  <v-chip
                    :color="item.status === 'Aktif' ? 'success' : 'warning'"
                    size="small"
                    class="info-chip"
                  >
                    {{ item.status }}
                  </v-chip>
                </template>

                <!-- Actions Column -->
                <template v-slot:item.actions="{ item }">
                  <div class="d-flex align-center">
                    <v-btn
                      icon="mdi-eye"
                      size="small"
                      color="info"
                      variant="tonal"
                      class="action-btn"
                      @click="viewUser(item)"
                    >
                      <v-icon>mdi-eye</v-icon>
                      <v-tooltip activator="parent" text="Görüntüle" />
                    </v-btn>
                    
                    <v-btn
                      icon="mdi-pencil"
                      size="small"
                      color="warning"
                      variant="tonal"
                      class="action-btn"
                      @click="editUser(item)"
                    >
                      <v-icon>mdi-pencil</v-icon>
                      <v-tooltip activator="parent" text="Düzenle" />
                    </v-btn>
                    
                    <v-btn
                      icon="mdi-delete"
                      size="small"
                      color="error"
                      variant="tonal"
                      class="action-btn"
                      @click="deleteUser(item)"
                    >
                      <v-icon>mdi-delete</v-icon>
                      <v-tooltip activator="parent" text="Sil" />
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top right"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Kapat
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Silme Onayı</v-card-title>
        <v-card-text>Bu kullanıcıyı silmek istediğinizden emin misiniz?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">İptal</v-btn>
          <v-btn color="error" variant="tonal" @click="confirmDelete">Sil</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="formDialog" max-width="600">
      <v-card>
        <v-card-title class="text-h6">
          {{ editMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.name"
                  label="Ad Soyad"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.email"
                  label="E-posta"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="formData.phone"
                  label="Telefon"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.department"
                  :items="departments"
                  label="Departman"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="formData.status"
                  :items="statusOptions"
                  label="Durum"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeForm">İptal</v-btn>
          <v-btn 
            color="primary" 
            variant="tonal" 
            @click="saveUser"
            :disabled="!formValid"
          >
            {{ editMode ? 'Güncelle' : 'Kaydet' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
// Page Meta
definePageMeta({
  title: 'Kullanıcılar',
  layout: 'default'
})

// Reactive Data
const search = ref('')
const loading = ref(false)
const deleteDialog = ref(false)
const formDialog = ref(false)
const editMode = ref(false)
const formValid = ref(false)
const userToDelete = ref(null)

const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})

const formData = reactive({
  id: null,
  name: '',
  email: '',
  phone: '',
  department: '',
  status: 'Aktif'
})

// Static Data
const headers = [
  { title: 'ID', key: 'id', width: '80px' },
  { title: 'Ad Soyad', key: 'name' },
  { title: 'E-posta', key: 'email' },
  { title: 'Telefon', key: 'phone' },
  { title: 'Departman', key: 'department' },
  { title: 'Durum', key: 'status', width: '120px' },
  { title: 'İşlemler', key: 'actions', sortable: false, width: '180px' }
]

const departments = [
  'Yazılım Geliştirme',
  'İnsan Kaynakları',
  'Muhasebe',
  'Pazarlama',
  'Satış',
  'Operasyon'
]

const statusOptions = ['Aktif', 'Pasif']

const rules = {
  required: value => !!value || 'Bu alan gereklidir',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Geçerli bir e-posta adresi giriniz'
  }
}

// Users Data (normally would come from API)
// const users = ref([
//   {
//     id: 1,
//     name: 'Ahmet Yılmaz',
//     email: 'ahmet.yilmaz@example.com',
//     phone: '+90 532 123 4567',
//     department: 'Yazılım Geliştirme',
//     status: 'Aktif',
//     joinDate: '15.03.2023'
//   },
//   {
//     id: 2,
//     name: 'Ayşe Kara',
//     email: 'ayse.kara@example.com',
//     phone: '+90 533 234 5678',
//     department: 'İnsan Kaynakları',
//     status: 'Aktif',
//     joinDate: '22.05.2023'
//   },
//   {
//     id: 3,
//     name: 'Mehmet Demir',
//     email: 'mehmet.demir@example.com',
//     phone: '+90 534 345 6789',
//     department: 'Muhasebe',
//     status: 'Pasif',
//     joinDate: '08.01.2023'
//   },
//   {
//     id: 4,
//     name: 'Fatma Çelik',
//     email: 'fatma.celik@example.com',
//     phone: '+90 535 456 7890',
//     department: 'Pazarlama',
//     status: 'Aktif',
//     joinDate: '12.07.2023'
//   },
//   {
//     id: 5,
//     name: 'Ali Şahin',
//     email: 'ali.sahin@example.com',
//     phone: '+90 536 567 8901',
//     department: 'Satış',
//     status: 'Aktif',
//     joinDate: '30.09.2023'
//   }
// ])

const { fetchUsers } = useUsers()

const { data: users, pending, error, refresh } = await useAsyncData('users', fetchUsers)



const refresh2 = async () => {
  //console.log(JSON.stringify(users.value,null,2))
  await refresh()
}

// Methods
const viewUser = (user) => {  
  navigateTo(`/users/${user.id}`)
}

const editUser = (user) => {
  editMode.value = true
  Object.assign(formData, user)
  formDialog.value = true
}

const deleteUser = (user) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const confirmDelete = () => {
  if (userToDelete.value) {
    const index = users.value.findIndex(u => u.id === userToDelete.value.id)
    if (index > -1) {
      users.value.splice(index, 1)
      showSnackbar(`${userToDelete.value.name} başarıyla silindi`, 'success')
    }
  }
  deleteDialog.value = false
  userToDelete.value = null
}

const openAddDialog = () => {
  editMode.value = false
  resetForm()
  formDialog.value = true
}

const closeForm = () => {
  formDialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    id: null,
    name: '',
    email: '',
    phone: '',
    department: '',
    status: 'Aktif'
  })
}

const saveUser = () => {
  if (editMode.value) {
    // Update existing user
    const index = users.value.findIndex(u => u.id === formData.id)
    if (index > -1) {
      users.value[index] = { ...formData }
      showSnackbar('Kullanıcı başarıyla güncellendi', 'success')
    }
  } else {
    // Add new user
    const newUser = {
      ...formData,
      id: Math.max(...users.value.map(u => u.id)) + 1,
      joinDate: new Date().toLocaleDateString('tr-TR')
    }
    users.value.push(newUser)
    showSnackbar('Yeni kullanıcı başarıyla eklendi', 'success')
  }
  closeForm()
}

const showSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

// SEO
useSeoMeta({
  title: 'Kullanıcı Listesi - Yönetim Paneli',
  ogTitle: 'Kullanıcı Listesi',
  description: 'Kullanıcı yönetimi ve listesi sayfası',
  ogDescription: 'Kullanıcı yönetimi ve listesi sayfası'
})
</script>

<style scoped>
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-elevation {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border-radius: 16px !important;
}

.action-btn {
  margin: 0 2px;
}

.table-header {
  background: linear-gradient(90deg, #f8f9fa, #e9ecef);
  border-radius: 12px 12px 0 0;
}

.info-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.max-width-400 {
  max-width: 400px;
}
</style>