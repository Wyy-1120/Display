import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import nums from './modules/nums'
import resourceInfo from './modules/resourceInfo'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    nums,
    resourceInfo
  },
  getters
})

export default store
