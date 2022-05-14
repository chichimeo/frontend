
export default {
  state: {
    claims: undefined,
    groupList: []
  },
  mutations: {
    AUTHENTICATION_SET_CLAIMS (state, claims) {
      state.claims = claims
    },
    SET_GROUP_LIST (state, list) {
      state.groupList = list
    }
  },
  actions: {
    AUTHENTICATION_SET_CLAIMS ({ commit }, claims) {
      commit('AUTHENTICATION_SET_CLAIMS', claims)
    }
  },
  getters: {
    groupList: state => {
      return state.groupList
    },
    authenticationClaims: state => {
      return state.claims
    },
    isAdmin: state => {
      return state.claims.userType === 0
    },
    authenticationToken: state => {
      return state.authentication.token
    },
    languages: state => {
      return state.ui.languages
    },
    currentLanguage: state => {
      return state.ui.language
    },
    currentLocale: state => {
      return state.ui.language.locale
    }
  }
}
