<template>
    <div id="app">
        <v-header></v-header>
        <router-view></router-view>
    </div>
</template>


<script>
import VHeader from 'components/header/header'

export default {
    name: 'app',
    components: {
        VHeader
    }
}
</script>

<style lang="scss" scoped>

</style>
