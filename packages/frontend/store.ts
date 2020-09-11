/* eslint-disable @typescript-eslint/no-explicit-any */

import Vue from 'vue'
import Vuex, { Store, StoreOptions } from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
    storage: window.localStorage,
})

export function createStore<S extends any>(persistence = false): Store<S> {
    const options: StoreOptions<any> = {
        state: {
            error: null,
            user: null,
        },
        mutations: {
            merge(state: any, payload: object) {
                for (const [k, v] of Object.entries(payload)) {
                    state[k] = Object.assign(state[k] || {}, v)
                }
            },
            set(state: any, payload: any) {
                for (const [k, v] of Object.entries(payload)) {
                    state[k] = v
                }
            },
        },
        plugins: [],
    }

    if (persistence) {
        options.state = {}

        options.plugins!.push(vuexLocal.plugin)
    }

    return new Vuex.Store(options)
}

export const persistenceStore = createStore(true)
