// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

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
    scopes: state => {
      console.log('state.authentication.token', state.authentication.token)
      return jwt_decode(state.authentication.token).scopes.reduce((a, v) => ({ ...a, [v]: true }), {})
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
