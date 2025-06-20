import { createStore } from 'vuex'

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || { 
      uid: null,
      nickname: null,
      sex: null,
      birthday: null,
      phone: null,
      isLoggedIn: false
    }
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = {
        ...state.user,
        ...payload,
        isLoggedIn: true
      }
      localStorage.setItem('user', JSON.stringify(state.user)); // 自动保存
    },
    CLEAR_USER(state) {
      state.user = {
        uid: null,
        nickname: null,
        sex: null,
        birthday: null,
        phone: null,
        isLoggedIn: false
      }
      localStorage.removeItem('user'); // 自动清除
    }
  },
  actions: {
    login({ commit }, user) {
      commit('SET_USER', user)
    },
    logout({ commit }) {
      commit('CLEAR_USER')
    }
  },
  getters: {
    currentUser: state => state.user,
    userId: (state) => state.userUid
  }
})