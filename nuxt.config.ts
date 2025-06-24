export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // Vuetify CSS'ini dahil et
  css: [
    'vuetify/lib/styles/main.sass',
    '@mdi/font/css/materialdesignicons.min.css',
  ],
  
  // Vite yapılandırması
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
    css: {
      preprocessorOptions: {
        sass: {
          additionalData: '@use "@/assets/styles/variables.scss" as *\n',
        },
      },
    },
  },
  
  // SSR yapılandırması
  ssr: false,
  
  // Build yapılandırması
  build: {
    transpile: ['vuetify'],
  },
    runtimeConfig: {
    // Private keys (only available on server-side)
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 3306,
    dbUser: process.env.DB_USER || 'root',
    dbPassword: process.env.DB_PASSWORD || '',
    dbName: process.env.DB_NAME || 'test_db',
    // Public keys (exposed to client-side)
    public: {
      apiBase: '/api'
    }
  }
})