<template>
  <section
    class="section"
    style="text-align: initial"
  >
    <h2
      class="title mb-0"
    >
      {{ $t("engines") }}
      <div class="level">
        <div class="level-left subtitle">
          {{ $t("subtitle.engine") }}
        </div>

        <!-- <div class="level-right">
          <button
            class="button is-primary"
            @click.prevent="create"
          >
            <octicon :icon="plus" /> <span>{{ $t('newEngine') }}</span>
          </button>
        </div> -->
      </div>
    </h2>
    <box>
      <data-table
        ref="table"
        :items="items"
        :theme="$_ui_theme_tables"
        sort-by="_id"
      >
        <data-column
          field="name"
          :label="$t('name')"
          :sortable="false"
        />
        <data-column
          field="url"
          :label="$t('url')"
          :sortable="false"
        >
          <template slot-scope="{ value }">
            <div
              style="display: flex"
            >
              <pre style="width: 100%"> {{ value }}</pre>
              <span
                style="margin: auto; padding: 0.5rem"
                @click="copyToken(value)"
              >
                <octicon
                  :icon="clippy"
                />
              </span>
            </div>
          </template>
        </data-column>
        <data-column
          field="key"
          :label="$t('key')"
          :sortable="false"
        >
          <template slot-scope="{ value }">
            <div
              style="display: flex"
            >
              <pre style="width: 100%"> {{ value }}</pre>
              <span
                v-if="value"
                style="margin: auto; padding: 0.5rem"
                @click="copyToken(value)"
              >
                <octicon
                  :icon="clippy"
                />
              </span>
            </div>
          </template>
        </data-column>
        <data-column
          field="enabled"
          :label="$t('status')"
          :sortable="false"
          width="15%"
        >
          <template slot-scope="{ value }">
            <span
              v-if="value"
              class="tag is-success is-light"
            >{{ $t('enabled') }}</span>
            <span
              v-else
              class="tag is-warning is-light"
            >{{ $t('disabled') }}</span>
          </template>
        </data-column>
        <data-column
          :label="$t('actions')"
          class="has-text-centered"
          :sortable="false"
          width="20%"
        >
          <template slot-scope="props">
            <div class="has-text-centered">
              <button
                :disabled="B.scopes['update:engines'] ? false : true"
                class="button is-text"
                @click.prevent="toggleItemStatus(props.item.name)"
              >
                <octicon :icon="sync" /> <span>{{ !props.item.enabled ? $t('enabled') : $t('disabled') }}</span>
              </button>
              <button
                :disabled="B.scopes['update:engines']? false : true"
                class="button is-text"
                @click.prevent="edit(props.item)"
              >
                <octicon :icon="pencil" /> <span>{{ $t('edit') }}</span>
              </button>
              <button
                :disabled="B.scopes['delete:engines']? false : true"
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
          {{ $t('editEngine') }}
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
                    disabled
                    required
                  >
                </div>
              </div>
              <div
                class="field"
              >
                <label class="label">{{ $t("url") }}</label>
                <div class="control">
                  <input
                    v-model="item.url"
                    class="input"
                    type="text"
                  >
                </div>
              </div>
              <div
                class="field"
              >
                <label class="label">{{ $t("key") }}</label>
                <div class="control">
                  <input
                    v-model="item.key"
                    class="input"
                    type="text"
                  >
                </div>
              </div>
              <div class="field">
                <label class="label">{{ $t('status') }}</label>
                <input
                  id="enabled"
                  v-model="item.enabled"
                  type="checkbox"
                  name="enabled"
                  class="switch"
                >
                <label for="enabled">{{ item.enabled ? $t('enabled') : $t('disabled') }}</label>
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
import { plus, x, pencil, clock, clippy, sync } from 'octicons-vue'
import clipboard from '@/clipboard.js'
import alertify from 'alertify.js'
import { B } from '../global.js'

export default {
  components: { DataTable, DataColumn, Modal },
  data () {
    return {
      modal: false,
      item: {},
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
    sync () {
      return sync
    }
  },
  methods: {
    items () {
      return this.$http.get(`/api/v1/engine`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        return {
          items: body.data.data,
          total: body.data.data.length
        }
      })
    },
    create () {
      this.modal = !this.modal
      return this.$http.post(`/api/v1/engine/${this.item.name}`, this.item).then(body => {
        if (!body || !body.data) {
          return
        }
        this.$store.dispatch('NOTIFY', {
          type: 'success',
          text: body.data.message
        })
        this.$refs.table.reloadItem()
      })
    },
    edit (props) {
      this.modal = !this.modal
      this.item = props
    },
    destroy (id) {
      alertify.confirm(this.$t('messageDelete'), () => {
        return this.$http.delete(`/api/v1/engine/${id}`).then(body => {
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
    toggleItemStatus (id) {
      return this.$http.patch(`/api/v1/engine/status/${id}`).then(body => {
        if (!body || !body.data) {
          return
        }
        this.$store.dispatch('NOTIFY', {
          type: 'success',
          text: body.data.message
        })
        this.$refs.table.loadItems()
      })
    }
  }
}
</script>
<style lang='scss'>
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
