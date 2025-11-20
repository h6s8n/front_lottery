export default defineNuxtRouteMiddleware((to, from) => {
    const auth = useAuthStore()

    // Check if token exists in query params (e.g. from Bot link)
    if (to.query.token) {
        const token = to.query.token as string
        auth.setToken(token)
    }

    // If user has no token and is not going to login page, redirect to login
    if (!auth.token && to.path !== '/login') {
        return navigateTo('/login')
    }

    // If user has token and tries to access login, redirect to home
    if (auth.token && to.path === '/login') {
        return navigateTo('/')
    }
})
