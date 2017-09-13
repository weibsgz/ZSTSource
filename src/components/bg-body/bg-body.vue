<template>
    <div data-comp="bg-body-component" class="bg-body">
        <img :src="bgKind">
    </div>
</template>

<script>

export default {
    name: 'bg-body',
    props: {
        imgUrl: {
            type: String,
            default: './bg-body.jpg'
        }
    },
    computed: {
        bgKind() {
            return require('./bg-body.jpg')
            // if (this.imgUrl === './bg-body.jpg') {
            //     return require('./bg-body.jpg')
            // } else {
            //     return require('./bg-index.jpg')
            // }
        }
    }
};
</script>

<style lang="scss" scoped>
.bg-body {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: -100;
    > img {
        height: 100%;
        width: 100%;
        border: 0;
    }
}
</style>
