import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const state = {
  messages: [],
  users: [],
  rooms: [],
  active: ''
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations
}