export default {
  addMessage (context, data) {
    context.commit('addMessage', data.amount)
  }
}
