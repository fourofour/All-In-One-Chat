export default {
  getMessages: state => {
    return state.messages.concat()
  },
  getUsers: state => {
    return state.users.concat()
  },
  getRooms: state => {
    return state.rooms.concat()
  },
  getActive: state => {
    return state.active.substring(0, state.active.length)
  }
}