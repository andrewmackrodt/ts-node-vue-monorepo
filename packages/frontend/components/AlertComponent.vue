<template>
    <p class="alert" :class="[alertClass]" role="alert">
        {{ message }}
    </p>
</template>

<script lang="ts">
    import { Prop, Vue } from 'vue-decorator'

    export default class AlertComponent extends Vue {
        @Prop({ default: 'danger' })
        public readonly level!: string

        @Prop({ default: 'Un unspecified error occurred' })
        public readonly message!: string

        public get alertClass(): string {
            return `alert-${this.level}`
        }
    }
</script>
