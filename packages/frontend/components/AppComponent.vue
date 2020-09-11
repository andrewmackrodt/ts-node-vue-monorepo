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
        public get error(): any {
            return this.$store.state.error
        }
    }
</script>

<style lang="scss">
    #app {
        margin: 1.5rem 0;
    }
</style>
