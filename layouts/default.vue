<template>
    <v-app>
        <!-- ClientOnly wrapper ile hydration mismatch'ini önle -->
        <ClientOnly>
            <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
                <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg" title="John Leider"
                    subtitle="john@vuetifyjs.com" nav>
                    <template v-slot:append>
                        <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                    </template>
                </v-list-item>

                <v-divider></v-divider>

                <v-list density="compact" nav>
                    <v-list-item v-for="item in menuItems" :key="item.title" :prepend-icon="item.icon"
                        :title="item.title" :to="item.to" :value="item.value"></v-list-item>
                </v-list>
            </v-navigation-drawer>

            <template #fallback>
                <!-- SSR sırasında gösterilecek basit fallback -->
                <div class="d-flex align-center pa-4">
                    <div>Yükleniyor...</div>
                </div>
            </template>
        </ClientOnly>

        <v-app-bar>
            <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
            <v-toolbar-title>Nuxt 3 + Vuetify 3</v-toolbar-title>
            <v-spacer></v-spacer>

            <!-- Theme toggle da ClientOnly ile sar -->
            <ClientOnly>
                <v-btn icon @click="toggleTheme">
                    <v-icon>{{ isDark ? 'mdi-brightness-7' : 'mdi-brightness-4' }}</v-icon>
                </v-btn>
                <template #fallback>
                    <v-btn icon>
                        <v-icon>mdi-brightness-4</v-icon>
                    </v-btn>
                </template>
            </ClientOnly>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { useTheme } from 'vuetify'
import { ref, computed, nextTick } from 'vue'

const theme = useTheme()

// Reactive state'leri process.client ile başlat
const drawer = ref(false)
const rail = ref(false)

// Client-side'da başlangıç değerlerini ayarla
onMounted(() => {
    drawer.value = true
    rail.value = false
})

const menuItems = [
    { title: 'Ana Sayfa', icon: 'mdi-home', to: '/', value: 'home' },
    { title: 'Hakkında', icon: 'mdi-information', to: '/about', value: 'about' },
    { title: 'İletişim', icon: 'mdi-email', to: '/contact', value: 'contact' },
    { title: 'Help', icon: 'mdi-help', to: '/help', value: 'help' },
    // { title: 'Galeri', icon: 'mdi-image', to: '/gallery', value: 'gallery' }
]

const isDark = computed(() => {
    if (process.client) {
        return theme.global.name.value === 'dark'
    }
    return false
})

const toggleTheme = () => {
    if (process.client) {
        theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    }
}

const toggleDrawer = () => {
    drawer.value = !drawer.value
}
</script>