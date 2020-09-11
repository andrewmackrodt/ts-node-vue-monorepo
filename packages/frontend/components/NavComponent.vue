<template>
    <div class="fixed-top navbar-dark bg-dark">
        <nav class="navbar navbar-expand-lg">
            <ul class="navbar-nav mr-auto mx-2">
                <li class="nav-item">
                    <router-link class="nav-link p-0" to="/">
                        <span><img class="navbar-brand"
                                   src="/assets/icons/favicon-48x48.png"
                                   alt=""
                                   :style="{
                                       'max-height': '40px',
                                       'object-fit': 'contain',
                                   }"
                        >TypeScript / Node / Vue - Monorepo Boilerplate</span>
                    </router-link>
                </li>
            </ul>
            <button class="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#menu-dropdown"
            >
                <span class="navbar-toggler-icon" />
            </button>
            <div id="menu-dropdown" class="navbar-collapse collapse">
                <div class="mr-auto" />
                <ul class="navbar-nav">
                    <li v-for="item in menu" :class="['nav-item'].concat(item.items ? ['dropdown'] : [])">
                        <router-link v-if="!item.items" class="nav-link" :to="item.href">
                            {{ item.name }}>
                        </router-link>
                        <span v-if="item.items"
                              class="nav-link dropdown-toggle"
                              role="button"
                              data-toggle="dropdown"
                        >{{ item.name }}</span>
                        <div v-if="item.items"
                             class="bg-primary dropdown-menu"
                        >
                            <router-link v-for="childItem in item.items" :key="childItem.name"
                                         class="dropdown-item"
                                         :to="childItem.href"
                            >
                                {{ childItem.name }}
                            </router-link>
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator'

    @Component
    export default class NavComponent extends Vue {
        public created() {
            $(document).on('click', () => {
                $('.navbar-collapse.show', this.$el).collapse('hide')
            })
        }

        public get menu(): object[] {
            return this.$router.options.routes!.reduce((routes, route) => {
                if (route.meta?.showInNav) {
                    routes.push({
                        name: route.meta?.title || route.name!,
                        href: this.$router.resolve(route.name!).location,
                    })
                }
                return routes
            }, [] as object[])
        }
    }
</script>

<style lang="scss" scoped>
    @import "styles/env";

    .dropdown-menu {
        background: inherit;
        border: none;
    }

    .dropdown-item {
        background-color: transparent;
        color: rgba(255, 255, 255, 0.5);

        &:hover {
            color: rgba(255, 255, 255, 0.75);
        }
    }

    @include desktop {
      .dropdown > .dropdown-menu {
        margin-top: -0.75rem;
        padding-top: 0.75rem;
      }

      .dropdown:hover > .dropdown-menu {
        display: block;
      }

      .fixed-top {
        opacity: 0.95;
      }
    }

    @include tablet {
        #menu-dropdown .nav-item {
            margin-bottom: 0.5rem;

            &:first-child {
                margin-top: 1.25rem;
            }
        }
    }

    .nav-item {
        cursor: pointer;
    }

    .nav-item.dropdown:hover {
        color: rgba(255, 255, 255, 0.75);
    }
</style>
