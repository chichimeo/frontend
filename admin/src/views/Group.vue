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
            class="button is-primary"
            @click.prevent="modal = !modal"
          >
            <octicon :icon="plus" /> <span>{{ $t('newGroup') }}</span>
          </button>
        </div>
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
          field="updatedAt"
          :label="$t('updatedAt')"
          :sortable="false"
        />
        <data-column
          :label="$t('actions')"
          class="has-text-centered"
          :sortable="false"
        >
          <template slot-scope="props">
            <div class="has-text-centered">
              <router-link
                :to="{
                  name: 'group-details',
                  params: { groupID: props.item.name, edit: true },
                }"
                class="button is-text"
              >
                <octicon :icon="eye" /> <span>{{ $t('details') }}</span>
              </router-link>
              <router-link
                :to="{
                  name: 'group-update',
                  params: { groupID: props.item.name, edit: true },
                }"
                class="button is-text"
              >
                <octicon :icon="pencil" /> <span>{{ $t('edit') }}</span>
              </router-link>
              <button
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

export default {
  components: { DataTable, DataColumn, Modal },
  data () {
    return {
      modal: false,
      item: {}
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
    }
  },
  methods: {
    // items () {
    //   return {
    //     items: [{
    //       name: 'root',
    //       createdAt: '20-04-2022',
    //       updatedAt: '22-04-2022',
    //       permissions: [
    //         {
    //           id: '1',
    //           action: 'read',
    //           feature: 'overview'
    //         },
    //         {
    //           id: '2',
    //           action: 'read',
    //           feature: 'malware'
    //         },
    //         {
    //           id: '3',
    //           action: 'create',
    //           feature: 'malware'
    //         }
    //       ],
    //       _id: '1'
    //     }],
    //     total: 1
    //   }
    // },
    items (filter, order, pagination) {
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
