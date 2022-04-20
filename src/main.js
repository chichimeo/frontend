import Vue from 'vue'
import App from './App.vue'
import { UI } from '@cyradar/ui'
import './../node_modules/bulma/css/bulma.css'
import localization from './localization'
import routes from './routes'
import Vuex from 'vuex'

Vue.use(UI)
Vue.config.productionTip = false
Vue.mixin({
  data () {
    return {
      $_oldState: null
    }
  },
  computed: {
    fileDetails: {
      get () {
        return this.$store.state.fileDetails
      },
      set (value) {
        this.$store.commit('loadFileDetails', value)
      }
    }
  },
  methods: {
    $_stateClone (obj) {
      return JSON.parse(JSON.stringify(obj))
    },
    $_statePersist (state) {
      this.$_oldState = this.$_stateClone(state)
    },
    $_stateRestore (keys) {
      if (!this.$_oldState) {
        return []
      }

      return keys.map(key => {
        return this.$_oldState[key]
      })
    }
    // getDetails (value) {
    //   this.fileDetails = [{"1": 1}, {"2": 2}]
    // }
  }
}
)
const store = new Vuex.Store({
  state: {
    fileDetails: null
  },
  mutations: {
    loadFileDetails (state, fileDetails) {
      state.fileDetails = fileDetails
    }
  }
})
const ui = new UI({
  auth: false,
  routes,
  store,
  localization
})
new Vue({
  ui,
  render: h => h(App)
}).$mount('#app')
