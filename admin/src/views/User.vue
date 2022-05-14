<template>
  <section
    class="section"
    style="text-align: initial"
  >
    <h2
      class="title mb-0"
    >
      {{ $t("users") }}
      <div class="level">
        <div class="level-left subtitle">
          {{ $t("subtitle.user") }}
        </div>

        <div
          class="level-right"
        >
          <button
            :disabled="B.scopes['create:users'] ? false : true"
            class="button is-primary"
            @click.prevent="create"
          >
            <octicon :icon="plus" /> <span>{{ $t('newUser') }}</span>
          </button>
        </div>
      </div>
    </h2>
    <box>
      <!-- <div>
        <octicon :icon="bug" :scale="2.5" /> <div class="title">{{ $t('Virus Share') }}</div>
      </div> -->
      <div>
        <input
          v-model="filterString"
          class="input"
          type="search"
          :class="queryFailed?'is-danger':''"
          required
          placeholder="Filter records"
        >
      </div>

      <data-table
        ref="table"
        :items="items"
        :theme="$_ui_theme_tables"
        sort-by="id"
        :filter.sync="filterString"
      >
        <data-column
          field="name"
          :label="$t('name')"
          :sortable="false"
        />
        <data-column
          field="username"
          :label="$t('username')"
          :sortable="false"
        />
        <data-column
          field="group"
          :label="$l('components.user.group','Group')"
        />
        <data-column
          :label="$t('actions')"
          class="has-text-centered"
          :sortable="false"
          width="20%"
        >
          <template slot-scope="props">
            <div class="has-text-centered">
              <button
                :disable="B.scopes['update:users'] ? false : true"
                class="button is-text"
                @click.prevent="edit(props.item)"
              >
                <octicon :icon="pencil" /> <span>{{ $t('edit') }}</span>
              </button>
              <button
                :disable="B.scopes['delete:users'] ? false : true"
                class="button is-text"
                @click.prevent="destroy(props.item.username)"
              >
                <octicon :icon="x" /> <span>{{ $t('delete') }}</span>
              </button>
            </div>
          </template>
        </data-column>
      </data-table>
    </box>
    <modal :show.sync="modal">
      <box>
        <div
          slot="header"
          style="color: '#dddddf' !important"
        >
          {{ item._id ?$t('editUser'): $t("newUser") }}
        </div>
        <form @submit.prevent="submit">
          <template>
            <div>
              <div
                class="field"
              >
                <label class="label">{{ $t("name") }}</label>
                <div class="control">
                  <input
                    v-model="item.name"
                    class="input"
                    type="text"
                    required
                  >
                </div>
              </div>
              <div
                class="field"
              >
                <label class="label">{{ $t("username") }}</label>
                <div class="control">
                  <input
                    v-if="formType === 'create'"
                    v-model="item.username"
                    type="text"
                    class="input"
                    placeholder="Username"
                  >
                  <input
                    v-if="formType === 'update'"
                    v-model="item.username"
                    disabled
                    type="text"
                    class="input"
                    placeholder="Username"
                  >
                </div>
              </div>
              <div
                v-if="formType === 'update'"
                class="field"
              >
                <div v-if="item.type === 0 || !isAdmin">
                  <label class="label">{{ $l('components.user.oldPassword','Old Password') }}</label>
                  <div class="control">
                    <input
                      v-model="item.oldPassword"
                      type="password"
                      class="input"
                      placeholder="Old Password"
                    >
                  </div>
                </div>
              </div>
              <div class="field">
                <label class="label">{{ $l('components.user.password','Password') }}</label>
                <div class="control">
                  <input
                    v-model="item.password"
                    type="password"
                    class="input"
                    placeholder="Password"
                  >
                </div>
              </div>
              <div class="field">
                <label class="label">{{ $l('components.user.confirmPassword','Confirm Password') }}</label>
                <div class="control">
                  <input
                    v-model="item.confirmPassword"
                    type="password"
                    class="input"
                    placeholder="Password"
                  >
                </div>
              </div>
            </div>
            <!-- <div class="field">
              <label class="label">{{ $t('status') }}</label>
              <input
                id="enabled"
                v-model="item.enabled"
                type="checkbox"
                name="enabled"
                class="switch"
              >
              <label for="enabled">{{ item.enabled ? $t('enabled') : $t('disabled') }}</label>
            </div> -->
            <div
              class="field"
            >
              <label class="label">{{ $t("group") }}</label>
              <div class="control">
                <v-select
                  v-model="item.group"
                  label="name"
                  value="name"
                  :options="groups"
                  :reduce="group => group.name"
                  :clearable="false"
                >
                  <template #search="{attributes, events}">
                    <input
                      class="vs__search"
                      :required="!item.group"
                      v-bind="attributes"
                      v-on="events"
                    >
                  </template>
                </v-select>
              </div>
            </div>
          </template>
          <div
            slot="footer"
            class="border-top field columns mt-2"
          >
            <div class="column has-text-justified">
              <button
                type="button"
                class="button is-small is-danger is-light"
                @click.prevent="modal = !modal"
              >
                {{ $t("cancel") }}
              </button>
            </div>
            <div class="column is-narrow">
              <button
                class="button is-small is-link is-light"
                type="submit"
              >
                {{ $t("save") }}
              </button>
            </div>
          </div>
        </form>
      </box>
    </modal>
  </section>
</template>
<script>
import { DataTable, DataColumn, Modal } from '@cyradar/ui'
import { plus, x, pencil, clock, clippy, bug } from 'octicons-vue'
import alertify from 'alertify.js'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
import { B } from '../global.js'

export default {
  components: { DataTable, DataColumn, Modal, vSelect },
  data () {
    return {
      modal: false,
      item: {
        group: ''
      },
      formType: 'create',
      filter: {},
      filterString: '',
      queryFailed: false,
      groups: [],
      B,
      bug
    }
  },
  computed: {
    plus () {
      return plus
    },
    x () {
      return x
    },
    clock () {
      return clock
    },
    pencil () {
      return pencil
    },
    clippy () {
      return clippy
    }
  },
  mounted () {
    this.getGroups()
  },
  methods: {
    items (filter, order, pagination) {
      if (!filter.query.trim()) {
        this.queryFailed = false
      }

      if (filter.query !== this.convertObjectToString(this.filter)) {
        this.filter = this.converStringToObject(filter.query)
      }

      return this.$http.get('/api/v1/user', {
        params: {
          filter: this.filter ? this.filter : {},
          order: order.order,
          sort: order.order,
          page: pagination.page,
          perPage: pagination.perPage
        }
      }).then(body => {
        if (!body || !body.data) {
          return {}
        }

        return body.data.data
      })
    },
    getGroups () {
      return this.$http.get(`/api/v1/group`, {
        params: {
          filter: this.filter ? this.filter : {},
          page: 1,
          perPage: 20
        }
      }).then(body => {
        if (!body || !body.data || !body.data.data) {
          this.groups = []
          return
        }
        this.groups = body.data.data.items
      })
    },
    create () {
      this.modal = !this.modal
      this.formType = 'create'
      this.item = {
        group: ''
      }
    },
    edit (props) {
      this.modal = !this.modal
      this.formType = 'update'
      this.item = props
      this.item.password = ''
    },
    submit () {
      this.modal = !this.modal
      if (this.formType === 'create') {
        return this.$http.post(`/api/v1/user`, this.item).then(body => {
          if (!body || !body.data) {
            return
          }
          this.$refs.table.loadItems()
        })
      }
      return this.$http.patch(`/api/v1/user`, this.item).then(body => {
        if (!body || !body.data) {
          return
        }
        this.$refs.table.loadItems()
      })
    },
    destroy (id) {
      alertify.confirm(this.$t('messageDelete'), () => {
        return this.$http.delete(`/api/v1/user/${id}`).then(body => {
          if (!body || !body.data) {
            return
          }

          this.$store.dispatch('NOTIFY', {
            type: 'success',
            text: body.data.message
          })

          this.$refs.table.loadItems()
        })
      })
    },
    convertObjectToString (val) {
      if (val === {}) {
        return
      }

      let result = ''
      for (const property in val) {
        if (result) {
          result = result.concat(', ')
        }

        result = result.concat(`${property}: ${val[property]}`)
      }
      return result
    },
    converStringToObject (data) {
      if (!data.trim()) {
        this.queryFailed = false
        return {}
      }

      const regex = /([^,]+)/gm
      const regexParseKey = /([a-zA-Z0-9_ ]+):(.*)/
      let found = data.match(regex)
      let result = {}

      for (let i = 0; i < found.length; i++) {
        if (found[i].trim() === '') {
          continue
        }

        let foundKey = found[i].trim().match(regexParseKey)
        if (!foundKey || foundKey.length !== 3) {
          this.queryFailed = true
          return {}
        }

        result[foundKey[1].trim()] = foundKey[2].trim()
      }
      this.queryFailed = false
      return result
    }

  }
}
</script>
<style lang='scss'>
div[data-elm="filter"]{
  display: none !important;
}
pre {
  padding: 0.5em;
  background: none;
  color: #495057;
}
.dashboard.is-dark pre {
  color: #f2f2f2;
}
.dashboard.is-dark {
  box {
    color: '#dddddf' !important
  }
}
</style>
