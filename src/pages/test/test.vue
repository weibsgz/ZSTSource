<template>
    <div data-comp="test-component">test组件</div>
</template>

<script>
import {STATUS, ERR_OK} from 'api/config'
// import qs from 'qs'

import axios from 'axios'

const baseURL = `http://192.168.1.68:8069`
const baseURLMock = 'http://result.eolinker.com/KRz5gHg929871cdf1876adcb01479a8bf638e4086dd8b2c?uri='



export default {
    name: 'test',
    props: {
        title: {
            type: String,
            default: ''
        }
    },
    data() {
        return {

        }
    },
    mounted() {
        setTimeout(() => {
            let obj = {
                a: "11=你好啊",
                b: "22=你好啊"
            }
            console.log(qs.stringify(obj))
            // console.log(qs.parse(obj))
            // this.getMerchantsListData()
        }, 20)
    },
    methods: {
        getMerchantsListData() {
            // xhr.get('/investment/domesticPark/getParkData', {
            //     params: {
            //         page: 1,
            //         pageSize: 10,
            //         parkId: ''
            //     }
            // })
            // .then((response) => {
            //     console.log('then')
            //     console.log(response)
            // })
            // .catch((error) => {
            //     console.log('catch')
            //     console.log('vbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
            //     console.log(error);
            // });
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
