<template>
  <router-view v-if="$route.name === 'group-details' || $route.name === 'group-update' " />
  <section
    v-else
    class="section"
    style="text-align: initial"
  >
    <h2
      class="title mb-0"
    >
      {{ $t("groups") }}
      <div class="level">
        <div class="level-left subtitle">
          {{ $t("subtitle.group") }}
        </div>

        <div class="level-right">
          <button
            :disabled="B.scopes['create:groups'] ? false : true"
            class="button is-primary"
            @click.prevent="modal = !modal"
          >
            <octicon :icon="plus" /> <span>{{ $t('newGroup') }}</span>
          </button>
        </div>
      </div>
    </h2>
    <box>
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
        :key="currentLocale"
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
          field="permissions"
          :label="$t('permissions')"
          :sortable="false"
        >
          <template slot-scope="{ value }">
            <span

              v-for="it in value"
              :key="it"
              class="tag is-success is-light mr-1"
            >{{ it.feature }}: {{ it.action }}</span>
          </template>
        </data-column>
        <data-column
          :label="$t('actions')"
          class="has-text-centered"
          :sortable="false"
        >
          <template slot-scope="props">
            <div class="has-text-centered">
              <button
                :disabled="B.scopes['read:groups'] ? false :true"
                class="button is-text"
                @click.prevent="$router.push({
                  name: 'group-details',
                  params: { groupID: props.item.name, edit: true },
                })"
              >
                <octicon :icon="eye" /> <span>{{ $t('details') }}</span>
              </button>
              <button
                :disabled="B.scopes['update:groups'] ? false :true"
                class="button is-text"
                @click.prevent="$router.push({
                  name: 'group-update',
                  params: { groupID: props.item.name, edit: true },
                })"
              >
                <octicon :icon="pencil" /> <span>{{ $t('edit') }}</span>
              </button>
              <button
                :disabled="B.scopes['delete:groups'] ? false :true"
                class="button is-text"
                @click.prevent="destroy(props.item.name)"
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
          {{ item._id ?$t('editGroup'): $t("newGroup") }}
        </div>
        <form @submit.prevent="create">
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
import { eye, plus, x, pencil, clock, clippy } from 'octicons-vue'
import clipboard from '@/clipboard.js'
import alertify from 'alertify.js'
import { B } from '../global.js'
import { mapGetters } from 'vuex'

export default {
  components: { DataTable, DataColumn, Modal },
  data () {
    return {
      modal: false,
      item: {},
      filter: {},
      filterString: '',
      queryFailed: false,
      B
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
    },
    eye () {
      return eye
    },
    ...mapGetters([
      'currentLocale'
    ])
  },
  methods: {
    items (filter, order, pagination) {
      if (!filter.query.trim()) {
        this.queryFailed = false
      }

      if (filter.query !== this.convertObjectToString(this.filter)) {
        this.filter = this.converStringToObject(filter.query)
      }
      return this.$http.get(`/api/v1/group`, {
        params: {
          filter: this.filter ? this.filter : {},
          order: order.order,
          sort: order.order,
          page: pagination.page,
          perPage: pagination.perPage
        }
      }).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        return body.data.data
      })
    },
    create () {
      this.modal = !this.modal
      let content = {
        name: this.item.name
      }
      return this.$http.post(`/api/v1/group`, content).then(body => {
        if (!body || !body.data) {
          return
        }
        this.$router.push({
          name: 'group-details',
          params: { groupID: this.item.name, edit: true }
        })
      })
    },
    destroy (id) {
      alertify.confirm(this.$t('messageDelete'), () => {
        return this.$http.delete(`/api/v1/group/${id}`).then(body => {
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
    copyToken (text) {
      clipboard(text)
      this.$store.dispatch('NOTIFY', {
        type: 'success',
        text: this.$t('copyToClipboard')
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
