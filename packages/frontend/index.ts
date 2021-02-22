import AppComponent from './components/AppComponent.vue'
import routes from './routes'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { store } from './store'

const app = createApp({
    components: { AppComponent },
    template: '<app-component />',
})

app.use((() => {
    const router = createRouter({ history: createWebHistory(), routes })

    router.beforeEach(async (to, from, next) => {
        store.commit('set', { error: null })

        next()
    })

    return router
})())

app.use(store)

app.mount('#app')
