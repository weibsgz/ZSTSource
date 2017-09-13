// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import { Pagination, Button ,Dialog, } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import axios from 'axios';
import echarts from 'echarts'

Vue.config.productionTip = false
/* 使用axios进行配置，ajax请求 */
//axios.defaults.baseURL = 'http://result.eolinker.com/KRz5gHg929871cdf1876adcb01479a8bf638e4086dd8b2c?uri=';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// axios.defaults.timeout = 30000;
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts

// Vue.use(Pagination)
// Vue.use(Button)
// Vue.use(Dialog)
Vue.use(ElementUI);

import './assets/css/index.sass'
import {ERR_OK, STATUS} from 'api/config'
/* eslint-disable no-new */


// axios.interceptors.request.use(function (config) {
//   // console.log("调用后台成功：",response)
//   // let mockulr='http://mock.eolinker.com/KRz5gHg929871cdf1876adcb01479a8bf638e4086dd8b2c?uri=';
//   // config.url=config.url.replace(config.baseURL,mockulr)
//   return config;

// }, function (error) {
//   console.log('请求错误时做些事')
//   // 对响应错误做点什么
//   //  router.push({path: '/notFound'});
//   return Promise.reject(error);
// });

// 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//   if (response.data[STATUS] == ERR_OK) {
//     return response;
//   } else { //接口返回但是没数据
//     console.log('接口返回但是没数据')

//     //return response;
//     return Promise.reject(response);
//   }
// },function(error){
//     console.log('服务器错误')
//   return Promise.reject(error);
// });

//添加请求拦截器
// axios.interceptors.request.use(function(config){
//     //在发送请求之前做某事
//     return config;
// },function(error){
//     //请求错误时做些事
//     alert('3');
//     return Promise.reject(error);
// });

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})


