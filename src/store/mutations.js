import * as types from './mutation-types'

export default {
    [types.SET_TRADE](state, target) {
        state.trade = target
    },
    [types.SET_TRADE_FLAG](state, flag) {
        state.tradeFlag = flag
    },
    [types.SET_TRADE_ONE](state, target) {
        state.tradeOne = target
    },
    [types.SET_TRADE_FLAG_ONE](state, flag) {
        state.tradeFlagOne = flag
    },
    [types.SET_TRADE_TWO](state, target) {
        state.tradeTwo = target
    },
    [types.SET_TRADE_FLAG_TWO](state, flag) {
        state.tradeFlagTwo = flag
    },
    [types.SET_AREA](state, target) {
        state.area = target
    },
    [types.SET_AREA_FLAG](state, flag) {
        state.areaFlag = flag
    },

    [types.SET_SERVE_ONE](state, target) {
        state.serveOne = target
    },
    [types.SET_SERVE_FLAG_ONE](state, flag) {
        state.serveFlagOne = flag
    },
    [types.SET_SERVE_TWO](state, target) {
        state.serveTwo = target
    },
    [types.SET_SERVE_FLAG_TWO](state, flag) {
        state.serveFlagTwo = flag
    },
}
