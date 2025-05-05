// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  vite: {
    server: {
      allowedHosts: [
        'localhost',
        '*.loca.lt' ,
        'easy-parrots-double.loca.lt'
      ]
    }
  }
})