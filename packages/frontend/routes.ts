import { RouteRecordRaw } from 'vue-router'
import AlertComponent from './components/AlertComponent.vue'
import HomePage from './pages/HomePage.vue'

const routes: RouteRecordRaw[] = [
    {
        name: 'index',
        path: '/:params(index)?',
        component: HomePage,
    },
    {
        name: 'not-found',
        path: '/:params(.*)*',
        component: AlertComponent,
        props: { message: 'Not Found', level: 'danger' },
    },
]

export default routes
