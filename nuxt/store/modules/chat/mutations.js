export default {
  addMessage (state, data) {
    state.messages.push(data)
  },
  addUsers (state, data) {
    state.users.push(data)
  },
  removeUsers (state, data) {
    state.users.forEach(function (currentValue, index, array) {
      if (data.id === currentValue.id) {
        state.users.splice(index, 1)
      }
    })
  },
  updateUsers (state, data) {
    state.users.forEach(function (currentValue, index, array) {
      if (data.id === currentValue.id) {
        state.users.splice(index, 1, data)
      }
    })
  },
  addRooms (state, data) {
    state.rooms.push(data)
  },
  setActive (state, data) {
    state.active = data
  }
}