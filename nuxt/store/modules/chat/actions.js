export default {
  addMessage (context, data) {
    context.commit('addMessage', data.amount)
  },
  addUsers (context, data) {
    context.commit('addUsers', data.amount)
  },
  removeUsers (context, data) {
    context.commit('removeUsers', data.amount)
  },
  addRooms (context, data) {
    context.commit('addRooms', data.amount)
  },
  setActive (context, data) {
    context.commit('setActive', data.amount)
  }
}
