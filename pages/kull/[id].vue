<template>
  <div>
    <!-- Page Title -->

    <Head>
      <Title>{{ user?.name || 'Kullanıcı Detayı' }} - Yönetim Paneli</Title>
    </Head>

    <v-container fluid class="gradient-bg min-h-screen pa-6">
      <v-row justify="center">
        <v-col cols="12" xl="10">
          <!-- Loading State -->
          <v-card v-if="pending" class="card-elevation text-center pa-8" elevation="8">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="text-h6 mt-4">Kullanıcı bilgileri yükleniyor...</p>
          </v-card>

          <!-- Error State -->
          <v-card v-else-if="error" class="card-elevation text-center pa-8" elevation="8">
            <v-icon color="error" size="64" class="mb-4">mdi-alert-circle</v-icon>
            <h2 class="text-h5 mb-4">Kullanıcı Bulunamadı</h2>
            <p class="text-body-1 mb-4">Aradığınız kullanıcı mevcut değil veya erişim izniniz yok.</p>
            <v-btn color="primary" @click="$router.push('/kull')">
              Kullanıcı Listesine Dön
            </v-btn>
          </v-card>

          <!-- User Detail -->
          <v-card v-else-if="user" class="card-elevation detail-card" elevation="8">
            <!-- Header -->
            <v-card-title class="table-header d-flex justify-space-between align-center pa-6">
              <div class="d-flex align-center">
                <v-btn icon="mdi-arrow-left" color="primary" variant="tonal" @click="$router.push('/kull')"
                  class="mr-4">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <h2 class="text-h4 font-weight-bold text-primary">Kullanıcı Detayı</h2>
              </div>
              <div class="d-flex gap-2">
                <div class="d-flex align-center" style="margin-left:auto;">
                  <v-btn class="px-6" color="primary" @click="refresh2">Yenile</v-btn>
                </div>
                <v-btn color="warning" prepend-icon="mdi-pencil" @click="editUser" class="px-6" elevation="2">
                  Düzenle
                </v-btn>
                <v-btn color="error" prepend-icon="mdi-delete" @click="deleteUser" class="px-6" elevation="2"
                  variant="outlined">
                  Sil
                </v-btn>
              </div>
            </v-card-title>

            <!-- Content -->
            <v-card-text class="pa-6">
              <v-row>
                <v-col cols="12" style="background-color: #f5f5f5;">
                  <!-- form -->
                  <v-card>
                    <v-card-title class="text-h6">
                      {{ editMode ? 'Kullanıcı Düzenle' : 'Yeni Kullanıcı Ekle' }}
                    </v-card-title>
                    <v-card-text>
                      <v-form ref="form" v-model="formValid">
                        <v-row>
                          <v-col cols="12" sm="6">
                            <v-text-field v-model="user.name" label="Ad Soyad" :rules="[rules.required]"
                              variant="outlined" />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field v-model="user.email" label="E-posta" type="email"
                              :rules="[rules.required, rules.email]" variant="outlined" />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-text-field v-model="user.phone" label="Telefon" :rules="[rules.required]"
                              variant="outlined" />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select v-model="user.department" :items="departments" label="Departman"
                              :rules="[rules.required]" variant="outlined" />
                          </v-col>
                          <v-col cols="12" sm="6">
                            <v-select v-model="user.status" :items="statusOptions" label="Durum"
                              :rules="[rules.required]" variant="outlined" />
                          </v-col>
                        </v-row>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn color="grey" variant="text" @click="closeForm">İptal</v-btn>
                      <v-btn color="primary" variant="tonal" @click="saveUser" :disabled="!formValid">
                        {{ editMode ? 'Güncelle' : 'Kaydet' }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                  <!-- form -->
                </v-col>
              </v-row>
              <v-row>
                <!-- Profile Section -->
                <v-col cols="12" md="4" class="text-center">
                  <v-avatar size="150" class="mb-4" color="primary">
                    <v-icon size="80" color="white">mdi-account</v-icon>
                  </v-avatar>
                  <h3 class="text-h5 font-weight-bold mb-2">{{ user.name }}</h3>
                  <v-chip :color="user.status === 'Aktif' ? 'success' : 'warning'" size="large" class="info-chip mb-4">
                    {{ user.status }}
                  </v-chip>
                  <div class="mt-4">
                    <v-btn color="primary" prepend-icon="mdi-email" :href="`mailto:${user.email}`" variant="outlined"
                      class="mb-2" block>
                      E-posta Gönder
                    </v-btn>
                    <v-btn color="success" prepend-icon="mdi-phone" :href="`tel:${user.phone}`" variant="outlined"
                      block>
                      Ara
                    </v-btn>
                  </div>
                </v-col>

                <!-- Information Section -->
                <v-col cols="12" md="8">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-card variant="tonal" color="blue-grey" class="pa-4 mb-4">
                        <div class="d-flex align-center mb-2">
                          <v-icon color="primary" class="mr-2">mdi-email</v-icon>
                          <span class="text-subtitle2 font-weight-bold">E-posta</span>
                        </div>
                        <p class="text-body-1 mb-0">{{ user.email }}</p>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-card variant="tonal" color="blue-grey" class="pa-4 mb-4">
                        <div class="d-flex align-center mb-2">
                          <v-icon color="primary" class="mr-2">mdi-phone</v-icon>
                          <span class="text-subtitle2 font-weight-bold">Telefon</span>
                        </div>
                        <p class="text-body-1 mb-0">{{ user.phone }}</p>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-card variant="tonal" color="blue-grey" class="pa-4 mb-4">
                        <div class="d-flex align-center mb-2">
                          <v-icon color="primary" class="mr-2">mdi-briefcase</v-icon>
                          <span class="text-subtitle2 font-weight-bold">Departman</span>
                        </div>
                        <p class="text-body-1 mb-0">{{ user.department }}</p>
                      </v-card>
                    </v-col>

                    <v-col cols="12" sm="6">
                      <v-card variant="tonal" color="blue-grey" class="pa-4 mb-4">
                        <div class="d-flex align-center mb-2">
                          <v-icon color="primary" class="mr-2">mdi-calendar</v-icon>
                          <span class="text-subtitle2 font-weight-bold">Kayıt Tarihi</span>
                        </div>
                        <p class="text-body-1 mb-0">{{ user.joinDate }}</p>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Additional Information Section -->
                  <v-expansion-panels class="mt-4">
                    <v-expansion-panel>
                      <v-expansion-panel-title>
                        <v-icon class="mr-2">mdi-information</v-icon>
                        Ek Bilgiler
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-row>
                          <v-col cols="12" sm="6">
                            <div class="mb-3">
                              <strong>Kullanıcı ID:</strong> {{ user.id }}
                            </div>
                            <div class="mb-3">
                              <strong>Son Giriş:</strong> {{ formatDate(user.lastLogin) }}
                            </div>
                          </v-col>
                          <v-col cols="12" sm="6">
                            <div class="mb-3">
                              <strong>Hesap Türü:</strong> {{ user.accountType || 'Standart' }}
                            </div>
                            <div class="mb-3">
                              <strong>Yetkiler:</strong>
                              <v-chip-group>
                                <v-chip v-for="permission in user.permissions || ['Kullanıcı']" :key="permission"
                                  size="small" color="info">
                                  {{ permission }}
                                </v-chip>
                              </v-chip-group>
                            </div>
                          </v-col>
                        </v-row>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" location="top right">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Kapat
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">Silme Onayı</v-card-title>
        <v-card-text>
          <strong>{{ user?.name }}</strong> kullanıcısını silmek istediğinizden emin misiniz?
          <br><br>
          <v-alert type="warning" variant="tonal">
            Bu işlem geri alınamaz!
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">İptal</v-btn>
          <v-btn color="error" variant="tonal" @click="confirmDelete">Sil</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
// Get route parameter
const route = useRoute()
const router = useRouter()
const userId = parseInt(route.params.id)

const departments = [
  'Yazılım Geliştirme',
  'İnsan Kaynakları',
  'Muhasebe',
  'Pazarlama',
  'Satış',
  'Operasyon'
]

const statusOptions = ['Aktif', 'Pasif']

// Page Meta
definePageMeta({
  title: 'Kullanıcı Detayı',
  layout: 'default'
})

// Reactive Data
const deleteDialog = ref(false)
const snackbar = reactive({
  show: false,
  message: '',
  color: 'success'
})



const userApi = useTableApi('cari')
const user = await userApi.getById(userId)


const refresh2 = async () => {
  // Kullanım örneği component'te:
  user.value = await userApi.getById(userId)
  console.log(JSON.stringify(user.value, null, 2))
  // const newUser = await userApi.create({ name: 'John', email: 'john@email.com' })
}

const rules = {
  required: value => !!value || 'Bu alan gereklidir',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Geçerli bir e-posta adresi giriniz'
  }
}

// Methods
const editUser = () => {
  // Navigate to edit page or open edit modal
  showSnackbar('Düzenleme sayfasına yönlendirileceksiniz...', 'info')
  // router.push(`/users/${userId}/edit`)
}

const deleteUser = () => {
  deleteDialog.value = true
}

const confirmDelete = () => {
  // Simulate delete API call
  showSnackbar(`${user.value.name} başarıyla silindi`, 'success')
  deleteDialog.value = false

  // Navigate back to users list after a short delay
  setTimeout(() => {
    router.push('/users')
  }, 1500)
}

const showSnackbar = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const formatDate = (dateString) => {
  if (!dateString) return 'Henüz giriş yapılmamış'
  return new Date(dateString).toLocaleString('tr-TR')
}

// SEO Meta
useSeoMeta({
  title: () => `${user.value?.name || 'Kullanıcı'} - Detay`,
  ogTitle: () => `${user.value?.name || 'Kullanıcı'} Detayı`,
  description: () => `${user.value?.name || 'Kullanıcı'} kullanıcısının detay bilgileri`,
  ogDescription: () => `${user.value?.name || 'Kullanıcı'} kullanıcısının detay bilgileri`
})

// Watch for user changes to update page title
watch(user, (newUser) => {
  if (newUser) {
    useHead({
      title: `${newUser.name} - Kullanıcı Detayı`
    })
  }
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

.table-header {
  background: linear-gradient(90deg, #f8f9fa, #e9ecef);
  border-radius: 12px 12px 0 0;
}

.detail-card {
  background: linear-gradient(145deg, #ffffff, #f8f9fa);
  border: 1px solid #e3f2fd;
}

.info-chip {
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>