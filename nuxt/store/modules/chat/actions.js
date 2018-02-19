export default {
  addMessage (context, data) {
    context.commit('addMessage', data.amount)
  },
  addUsers (context, data) {
    let users = context.getters['getUsers']
    let found = false

    users.forEach(function (value, index, array) {
      if (value.id === data.amount.id) {
        found = true
      }
    })

    if (!found) {
      context.commit('addUsers', data.amount)
    } else {
      context.commit('updateUsers', data.amount)
    }
  },
  setUsers (context, data) {
    let users = context.getters['getUsers']

    data.amount.forEach(function (value, index, array) {
      if (users.length > 0) {
        let found = false

        users.forEach(function (value2, index2, array2) {
          if (value.id === value2.id) {
            found = true
          }
        })

        if (!found) {
          context.commit('addUsers', value)
        } else {
          context.commit('updateUsers', data.amount)
        }
      } else {
        context.commit('addUsers', value)
      }
    })
  },
  removeUsers (context, data) {
    context.commit('removeUsers', data.amount)
  },
  addRooms (context, data) {
    let rooms = context.getters['getRooms']

    if (rooms.indexOf(value) === -1) {
      context.commit('addRooms', data.amount)
    }
  },
  setRooms (context, data) {
    let rooms = context.getters['getRooms']

    data.amount.forEach(function (value, index, array) {
      if (rooms.indexOf(value) === -1) {
        context.commit('addRooms', value)
      }
    })
  },
  setActive (context, data) {
    context.commit('setActive', data.amount)
  }
}
