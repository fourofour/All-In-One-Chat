import Vuex from 'vuex'
import chatModule from './modules/chat'

const app = () => {
  return new Vuex.Store({
    modules: {
      chat: chatModule
    }
  })
}

export default app