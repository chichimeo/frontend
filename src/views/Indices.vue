<template>
  <section
    class="section"
    style="text-align: initial"
  >
    <h2
      class="title mb-0"
    >
      {{ $t("indices") }}
      <div class="level">
        <div class="level-left subtitle">
          {{ $t("subtitle.indices") }}
        </div>

        <div class="level-right">
          <button
            class="button is-primary"
            @click.prevent="create"
          >
            <octicon :icon="plus" /> <span>{{ $t('newIndex') }}</span>
          </button>
        </div>
      </div>
    </h2>
    <box>
      <data-table
        ref="table"
        :items="items"
        sort-by="_id"
      >
        <data-column
          field="name"
          :label="$t('name')"
          width="15%"
        />
        <data-column
          field="description"
          :label="$t('description')"
        />
        <data-column
          field="srcType"
          :label="$t('sourceType')"
          width="15%"
        />
        <data-column
          field="dstType"
          :label="$t('destinationType')"
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
                class="button is-text"
                @click.prevent="edit(props.item)"
              >
                <octicon :icon="pencil" /> <span>{{ $t('edit') }}</span>
              </button>
              <button
                class="button is-text"
                @click.prevent="destroy(props.item)"
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
        <div slot="header">
          {{ $t("newIndex") }}
        </div>
        <form @submit.prevent="create">
          <template>
            <div>
              <div class="field">
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
              <div class="field">
                <label class="label">{{ $t("description") }}</label>
                <div class="control">
                  <input
                    v-model="item.description"
                    class="input"
                    type="text"
                  >
                </div>
              </div>
              <div class="field">
                <label class="label">{{ $t("sourceType") }}</label>
                <v-select
                  v-model="item.srcType"
                  :options="sources"
                  :clearable="false"
                >
                  <template #search="{attributes, events}">
                    <input
                      class="vs__search"
                      :required="!item.srcType"
                      v-bind="attributes"
                      v-on="events"
                    >
                  </template>
                </v-select>
              </div>
              <div class="field">
                <label class="label">{{ $t("destinationType") }}</label>
                <v-select
                  v-model="item.dstType"
                  :options="destinations"
                  :clearable="false"
                >
                  <template #search="{attributes, events}">
                    <input
                      class="vs__search"
                      :required="!item.dstType"
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
import { plus, x, pencil, clock } from 'octicons-vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'
export default {
  components: { DataTable, DataColumn, vSelect, Modal },
  data () {
    return {
      modal: false,
      item: {},
      sources: ['is', 'edr', 'atd'],
      destinations: ['event-log']
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
    }
  },
  methods: {
    items () {
      return {
        items: [{
          name: 'is',
          description: 'is',
          srcType: 'is',
          dstType: 'event-log'
        }],
        total: 1
      }
    },
    create () {
      this.modal = !this.modal
      this.item = {
        dstType: 'event-log'
      }
    },
    edit (props) {
      this.modal = !this.modal
      this.item = props
    },
    submit () {
      this.closeModal()
    },
    destroy () {}
  }
}
</script>
