<template>
    <div id="app">
        <nav-component />
        <div class="container-fluid">
            <div v-if="error">
                <alert-component level="danger" :message="error" />
            </div>
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'
    import { server } from '../models/Server'

    // global styles
    import 'bootstrap/scss/bootstrap.scss'
    import 'styles/style.scss'

    // global scripts
    import 'jquery'
    import 'bootstrap'

    import AlertComponent from './AlertComponent.vue'
    import NavComponent from './NavComponent.vue'

    @Component({
        components: {
            AlertComponent,
            NavComponent,
        },
    })
    export default class AppComponent extends Vue {
        private pingIntervalId?: number

        public get error(): any {
            return this.$store.state.error
        }

        public created() {
            // establish web socket connection
            server.ping()

            // send ping event every 10s
            this.pingIntervalId = setInterval(() => server.ping(), 10000)
        }

        public destroyed() {
            if (typeof this.pingIntervalId !== 'undefined') {
                clearInterval(this.pingIntervalId)
                delete this.pingIntervalId
            }
        }
    }
</script>

<style lang="scss">
    #app {
        margin: 1.5rem 0;
    }
</style>
