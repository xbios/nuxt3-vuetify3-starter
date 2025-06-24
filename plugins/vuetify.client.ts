import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'light',
      themes: {
        light: {
          colors: {
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
          },
        },
        dark: {
          colors: {
            primary: '#2196F3',
            secondary: '#424242',
            accent: '#FF4081',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FB8C00',
          },
        },
      },
    },
    // SSR uyumluluğu için
    ssr: false,
    defaults: {
      global: {
        ripple: false,
      },
      // VBtn: {
      //   variant: 'flat',
      // },
      VCard: {
        variant: 'flat',
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
  
  // Hydration mismatch warning'lerini tamamen sustur
  if (process.client && process.env.NODE_ENV === 'development') {
    const originalWarn = console.warn
    const originalError = console.error
    
    console.warn = (...args) => {
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0]
        const hydrationWarnings = [
          '[Vue warn]',
          'Hydration',
          'Hydration completed but contains mismatches',
          'Hydration node mismatch',
          'Hydration text mismatch',
          'Hydration class mismatch',
          'Hydration attribute mismatch',
          'Hydration style mismatch',
          'computed',
          'ref',
          'reactive',
        ]
        
        if (hydrationWarnings.some(warning => message.includes(warning))) {
          return // Bu warning'leri tamamen sustur
        }
      }
      originalWarn(...args)
    }
    
    console.error = (...args) => {
      if (args[0] && typeof args[0] === 'string') {
        const message = args[0]
        const hydrationErrors = [
          'Hydration completed but contains mismatches',
          'Hydration node mismatch',
          'Hydration text mismatch',
          'Hydration class mismatch',
          'Hydration attribute mismatch',
        ]
        
        if (hydrationErrors.some(error => message.includes(error))) {
          return // Bu error'ları tamamen sustur
        }
      }
      originalError(...args)
    }
  }
})