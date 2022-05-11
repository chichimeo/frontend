<template>
  <section
    class="section"
    style="text-align: initial"
  >
    <div class="plan-details">
      <div class="columns">
        <div class="column is-4">
          <box>
            <h2
              class="title"
              style="font-size: 1rem"
            >
              {{ type==='create'?$t("newGroup") : $t("group") }}
            </h2>
            <div class="field">
              <label class="label">{{ $t("name") }}</label>
              <div class="control">
                <input
                  v-model="item.name"
                  class="input"
                  type="text"
                >
              </div>
            </div>
          </box>
        </div>
        <div class="column">
          <box>
            <div class="columns">
              <div class="column">
                <h2
                  class="title"
                  style="font-size: 1rem"
                >
                  {{ $t("permissions") }}
                </h2>
              </div>
              <div class="column is-narrow">
                <button
                  class="button is-primary is-small is- is-light"
                  @click.prevent="customizePermission"
                >
                  <octicon :icon="check" /><span
                    class="ml-1"
                    v-text="customizingPermission? $t('save') : $t('customize')"
                  />
                </button>
              </div>
              <div
                v-if="customizingPermission"
                class="column is-narrow"
              >
                <button
                  class="button is-small is-danger is-light"
                  @click.prevent="customizePermissionCancel"
                >
                  <octicon :icon="sync" /><span class="ml-1">{{
                    $t("cancel")
                  }}</span>
                </button>
              </div>
            </div>
            <data-table
              ref="table"
              :items="permissions"
              :theme="$_ui_theme_tables"
              sort-by="id"
            >
              <data-column
                field="feature"
                :label="$t('feature')"
                width="20%"
              />
              <data-column
                :label="$t('description')"
              >
                <template slot-scope="props">
                  <div>{{ props.item.action }} {{ props.item.feature }}</div>
                </template>
              </data-column>
              <data-column
                field="allowedActions"
                :label="$t('action')"
                :sortable="false"
              >
                <template slot-scope="props">
                  <button
                    v-if="props.item.action === 'create'"
                    class="button is-small mr-2"
                    :class="{
                      'is-info': props.item.status,
                    }"
                    :disabled="customizingPermission?false:true"
                    @click="props.item.status = !props.item.status; changeStatus(props.item)"
                  >
                    {{ $t("add") }}
                  </button>
                  <button
                    v-if="props.item.action === 'delete'"
                    class="button is-small mr-2"
                    :class="{
                      'is-info': props.item.status,
                    }"
                    :disabled="customizingPermission?false:true"
                    @click="props.item.status = !props.item.status; changeStatus(props.item)"
                  >
                    {{ $t("delete") }}
                  </button>
                  <button
                    v-if="props.item.action === 'read'"
                    class="button is-small mr-2"
                    :class="{
                      'is-info': props.item.status,
                    }"
                    :disabled="customizingPermission?false:true"
                    @click="props.item.status = !props.item.status; changeStatus(props.item)"
                  >
                    {{ $t("read") }}
                  </button>
                  <button
                    v-if="props.item.action === 'update'"
                    class="button is-small mr-2"
                    :class="{
                      'is-info': props.item.status,
                    }"
                    :disabled="customizingPermission?false:true"
                    @click="props.item.status = !props.item.status; changeStatus(props.item)"
                  >
                    {{ $t("update") }}
                  </button>
                </template>
              </data-column>
            </data-table>
          </box>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { DataTable, DataColumn } from '@cyradar/ui'
import { arrowSmallLeft, check, sync } from 'octicons-vue'
import 'vue-select/dist/vue-select.css'
export default {
  name: 'GroupDetails',
  components: { DataTable, DataColumn },
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      arrowSmallLeft,
      check,
      customizingGroup: false,
      customizingPermission: false,
      sync,
      item: {
        permissions: []
      },
      products: [],
      permissions: [],
      type: ''
    }
  },
  mounted () {
    if (this.$route.name === 'group-update') {
      this.customizingGroup = true
      this.customizingPermission = true
    }
    if (this.$route.params.groupID === '0') {
      this.type = 'create'
      this.customizingGroup = true
      this.customizingPermission = true
      return
    }
    this.type = ''

    this.getPermissions().finally(() => {
      this.loadItem()
    })
  },
  methods: {
    getPermissions () {
      return this.$http.get(`/api/v1/permission`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.permissions = body.data.data
        for (let i = 0; i < this.permissions.length; i++) {
          this.permissions[i].status = false
        }
      })
    },
    loadItem () {
      if (!this.$route || !this.$route.params || !this.$route.params.groupID) {
        return Promise.resolve()
      }

      // return this.$http
      // .get(`/api/v1/product-plans/${this.$route.params.id}`)
      // .then((body) => {
      //   if (!body || !body.data) {
      //     return
      //   }
      return this.$http.get(`/api/v1/group/${this.$route.params.groupID}`).then(body => {
        if (!body || !body.data) {
          return
        }
        this.item = body.data.data
        this.item.permissions = body.data.data.permissions ? body.data.data.permissions : []

        for (let i = 0; i < this.permissions.length; i++) {
          this.permissions[i].status = false
          for (let j = 0; j < this.item.permissions.length; j++) {
            if (this.item.permissions[j].id === this.permissions[i].id) {
              this.permissions[i].status = true
              break
            }
          }
        }
      }).finally(() => {
        this.$refs.table.loadSlots()
        this.$refs.table.reloadItems()
      })
    },
    customizePermission () {
      if (this.customizingPermission) {
        this.customizingPermission = false
        let content = {
          name: this.$route.params.groupID,
          permissions: this.permissions.filter(p => p.status === true)
        }
        this.$http
          .patch(`/api/v1/group`, content)
          .then((body) => {
            this.loadItem()
          })
        return
      }

      this.$_statePersist({
        features: this.permissions || []
      })

      this.customizingPermission = true
    },
    customizePermissionCancel () {
      if (!this.customizingPermission) {
        return
      }

      const [features] = this.$_stateRestore(['features'])
      this.permissions = features
      this.customizingPermission = false
    },
    changeStatus (item) {
      for (let i = 0; i < this.permissions.length; i++) {
        if (item.id === this.permissions[i].id) {
          this.permissions[i].status = !this.permissions[i].status
          return
        }
      }
    }
  }
}
</script>
<style lang="scss">
.plan-details {
  padding-top: 0.75em;
}
</style>
