import AppComponent from './components/AppComponent.vue'
import { createStore } from './store'
import routes from './routes'
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const store = createStore()

new Vue({
    el: '#app',
    components: { AppComponent },
    router: (() => {
        const router = new VueRouter({ routes, mode: 'history' })

        router.beforeEach(async (to, from, next) => {
            store.commit('set', { error: null })

            next()
        })

        return router
    })(),
    store: store,
    template: '<AppComponent />',
})
