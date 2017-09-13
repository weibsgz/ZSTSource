import Vue from 'vue'
import Router from 'vue-router'

import Header from 'components/header/header'

// 国内园区 行业招商 产业链招商 园区政策 路由
import DomesticPark from 'pages/domestic-park/domestic-park'
// import TradeInvest from 'pages/trade-invest/trade-invest'
import Invest from 'pages/invest/invest'
import GardenPolicy from 'pages/garden-policy/garden-policy'
import GardenIntro from 'pages/garden-intro/garden-intro'
import GardenAnalysis from 'pages/garden-analysis/garden-analysis'
// 行业 和 产业链 招商列表
import MerchantsList from 'pages/merchants-list/merchants-list'

// 行业 和 产业链 更多企业
import MoreIndustry from 'pages/more-industry/more-industry'

// 我的园区
import ParkInfo from 'pages/park-info/park-info'
// 园区政策
import ParkPolicy from 'pages/park-policy/park-policy'
// 已招企业
import EnlistIndustry from 'pages/enlist-industry/enlist-industry'
// 意向招商
import IntentMerchants from 'pages/intent-merchants/intent-merchants'

import GardenSearch from 'pages/garden-search/garden-search'
import GardenEntList from 'pages/garden-ent-list/garden-ent-list'

Vue.use(Router)

const routes = [{
        path: '/',
        redirect: '/domestic-park'
    }, {
        // 国内园区
        path: '/domestic-park',
        name: 'DomesticPark',
        component: DomesticPark
    }, {
        // 行业招商
        path: '/invest/:direction',
        name: 'TradeInvest',
        component: Invest
    }, {
        // 产业链招商
        path: '/invest/:direction',
        name: 'ChainInvest',
        component: Invest
    }, {
        // 产业链招商列表
        path: '/merchants-list/:direction',
        name: 'MerchantsList',
        component: MerchantsList
    }, {
        // 更多企业
        path: '/more-industry/:direction',
        name: 'MoreIndustry',
        component: MoreIndustry
    }, {
        // 园区政策
        path: '/garden-policy',
        name: 'GardenPolicy',
        component: GardenPolicy
    },
    { //园区介绍
        path: '/garden-intro/:id',
        name: 'GardenIntro',
        component: GardenIntro
    }, { //园区分析
        path: '/garden-intro/garden-analysis/:id',
        name: 'GardenAnalysis',
        component: GardenAnalysis
    }, {
        // 我的园区
        path: '/park-info',
        name: 'ParkInfo',
        component: ParkInfo
    }, {
        // 园区政策
        path: '/park-policy',
        name: 'ParkPolicy',
        component: ParkPolicy
    }, {
        // 已招企业
        path: '/enlist-industry',
        name: 'EnlistIndustry',
        component: EnlistIndustry
    }, {
        // 意向招商
        path: '/intent-merchants',
        name: 'IntentMerchants',
        component: IntentMerchants
    }, { //查找园区
        path: '/garden-search/:gardenName',
        name: 'GardenSearch',
        component: GardenSearch
    },
    { //园区企业列表
        path: '/garden-intro/garden-ent-list/:id',
        name: 'GardenEntList',
        component: GardenEntList
    }
]

const router = new Router({
    routes,
    linkActiveClass: 'active'
});

export default router
