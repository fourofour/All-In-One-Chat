export default {
  addMessage (context, data) {
    context.commit('addMessage', data.amount)
  },
  addUsers (context, data) {
    context.commit('addUsers', data.amount)
  },
  removeUsers (context, data) {
    context.commit('removeUsers', data.amount)
  }
}
