import { RouteConfig } from 'vue-router'

import AlertComponent from './components/AlertComponent.vue'
import HomePage from './pages/HomePage.vue'

const routes: RouteConfig[] = [
    {
        name: 'index',
        path: '/(index)?',
        component: HomePage,
    },
    {
        name: '404',
        path: '*',
        component: AlertComponent,
        props: { message: 'Not Found', level: 'danger' },
    },
]

export default routes
