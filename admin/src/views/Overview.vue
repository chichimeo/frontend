<template>
  <section class="section">
    <div
      class="columns"
      style="margin: 0;"
    >
      <div
        class="column"
        style="padding-left: 0; padding-top: 0;"
      >
        <box class="widget widget--green">
          <div
            style="cursor: pointer;"
            @click="$router.push({ name: 'malwares' })"
          >
            <div class=" has-text-centered">
              <p class="heading">
                {{ $l('malwareToday','Malware New') }}
              </p>
              <p class="title">
                {{ count.newMalware }}
              </p>
            </div>
          </div>
        </box>
      </div>
      <div
        class="column"
        style="padding-top: 0;"
      >
        <box class="widget widget--blue">
          <div
            style="cursor: pointer;"
            @click="$router.push({ name: 'engines' })"
          >
            <div class="has-text-centered">
              <p class="heading">
                {{ $l('totalMalware','Total Malware') }}
              </p>
              <p class="title">
                {{ count.total }}
              </p>
            </div>
          </div>
        </box>
      </div>
      <div
        class="column"
        style="padding-top: 0;"
      >
        <box class="widget widget--pink">
          <div
            style="cursor: pointer;"
            @click="$router.push({ name: 'engines'})"
          >
            <div class="has-text-centered">
              <p class="heading">
                {{ $l('engineEnabled','Engine enabled') }}
              </p>
              <p class="title">
                {{ engines.enabled }}
              </p>
            </div>
          </div>
        </box>
      </div>
      <div
        class="column"
        style="padding-right: 0; padding-top: 0;"
      >
        <box class="widget widget--purple">
          <div
            style="cursor: pointer;"
            @click="$router.push({ name: 'engines' })"
          >
            <div class="has-text-centered">
              <p class="heading">
                {{ $l('totalEngine','Detected Engines') }}
              </p>
              <p class="title">
                {{ engines.total }}
              </p>
            </div>
          </div>
        </box>
      </div>
    </div>
    <box>
      <tabs :theme="$_ui_theme_tabs">
        <tab :title="$l('recentThreatEvents','Recent Malwares in My Database')">
          <line-chart
            canvas-height="270px"
            :picker="true"
            :data="redData"
            :timestamp="redDataFetchedAt"
            unit="day"
            @toggled="toggleCategory"
          >
            <div slot="right">
              <date-picker
                :value.sync="dateRange"
                range
              />
              <div class="container has-text-centered">
                <div style="display: flex; padding: 0 1rem;">
                  <div>
                    <octicon
                      :icon="bug"
                      :scale="2.5"
                    />
                  </div>
                  <div style="padding: 0.5rem">
                    <h5 class="p-0 title">
                      {{ $t('Virus Share') }}
                    </h5>
                  </div>
                </div>
              </div>
              <div class="container has-text-centered">
                <p class="title is-size-1">
                  {{ count.event }}
                </p>
              </div>
              <div class="container has-text-centered">
                <p class="heading is-size-5">
                  {{ $l('detectedThreats','Detected Threats') }}
                </p>
              </div>
            </div>
          </line-chart>
        </tab>
      </tabs>
    </box>

    <div class="columns">
      <div class="column is-half">
        <box style="margin: 0; height: 100%;">
          <tabs :theme="$_ui_theme_tabs">
            <tab :title="$l('sourcesInMyDB','Sources in My Database')">
              <bar-chart
                :data="clientData"
                :timestamp="clientDataFetchedAt"
                :legend-title="$l('overview.clients','Clients')"
                @limited="clientDataFetchedAt = new Date()"
              />
            </tab>
          </tabs>
        </box>
      </div>

      <div class="column is-half">
        <box style="margin: 0; height: 100%;">
          <tabs :theme="$_ui_theme_tabs">
            <tab :title="$l('engines','Engines')">
              <doughnut-chart
                :data="categoryData"
                :timestamp="categoryDataFetchedAt"
              />
            </tab>
          </tabs>
        </box>
      </div>
    </div>
    <!-- <div>
      <div>
        <octicon
          :icon="bug"
          :scale="2"
        />
      </div>
      <div style="padding: 0.5rem">
        <h5 class="p-0 title">
          {{ $t('Virus share') }}
        </h5>
      </div>
    </div> -->
  </section>
</template>
<script>
import DoughnutChart from '../components/DoughnutChart'
import LineChart from '../components/LineChart'
import BarChart from '../components/BarChart'
import { Colors } from '../utils'
import { subDays } from 'date-fns'
import { DatePicker, Tabs, Tab } from '@cyradar/ui'
import { bug } from 'octicons-vue'

const today = new Date()
const daysAgo7 = subDays(today, 7)
export default {
  components: { DoughnutChart, LineChart, BarChart, DatePicker, Tabs, Tab },
  data () {
    return {
      bug,
      redRawData: {},
      redDataFetchedAt: null,
      categories: [],
      groupData: {},
      groupDataFetchedAt: null,
      clientData: {},
      clientDataFetchedAt: null,
      categoryData: {},
      categoryDataFetchedAt: null,
      colors: Colors,
      dateRange: [daysAgo7, today],
      metadata: {
        startDate: daysAgo7.toISOString(),
        endDate: today.toISOString()
      },
      count: {
        newMalware: 0,
        total: 0
      },
      engines: {
        enabled: 0,
        total: 0
      }
    }
  },
  computed: {
    redData () {
      let labels = Object.keys(this.redRawData)
      let datasets = this.categories.filter(set => !set.disabled).map((category, index) => {
        category.label = category.name
        category.data = labels.map(label => {
          let count = 0

          for (let item of this.redRawData[label]) {
            item.label = 'malware'
            if (item.label === category.name) {
              count = item.data
              break
            }
          }

          return count
        })

        return category
      })
      return {
        datasets,
        labels
      }
    }
  },
  watch: {
    dateRange (val) {
      this.metadata = {
        startDate: val[0].toISOString(),
        endDate: val[1].toISOString()
      }
    },
    metadata () {
      this.fetchEventDateFrequency()
    },
    redData () {
      this.redDataFetchedAt = new Date()
    }
  },
  mounted () {
    this.fetch()
  },
  methods: {
    fetch () {
      this.fetchEventCategory()
      this.fetchEventClient()
      this.fetchEventDateFrequency()
      this.fetchNewMalware()
      this.fetchTotal()
    },
    fetchEventDateFrequency () {
      this.clientDataFetchedAt = null
      return this.$http.get(`/api/v1/overview/malware/frequency/date?startDate=${this.metadata.startDate}&endDate=${this.metadata.endDate}`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.categories = []
        // body.data.data.categories.forEach((e, i) => {
        //   let disabled = false
        //   e = 'malware'
        //   if (e === '') {
        //     e = 'others'
        //     disabled = true
        //   }
        this.categories.push({
          name: 'malware',
          disabled: false,
          backgroundColor: this.colors.default[0],
          borderColor: this.colors.default[0],
          pointBackgroundColor: this.colors.lighter[0],
          pointHoverBackgroundColor: this.colors.lighter[0],
          pointHoverBorderColor: this.colors.darker[0]
        })
        // })
        this.redRawData = body.data.data.chart
      })
    },
    fetchEventClient () {
      this.clientDataFetchedAt = null
      return this.$http.get(`/api/v1/overview/malware/bytype`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.clientData = {
          data: body.data.data.map(e => { return e.Data }),
          labels: body.data.data.map(e => {
            if (e.Label === '') {
              return 'Others'
            }
            return e.Label
          })
        }
      }).then(() => {
        this.clientDataFetchedAt = new Date()
      })
    },
    fetchEventCategory () {
      this.categoryDataFetchedAt = null
      return this.$http.get(`/api/v1/engine`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.engines.total = body.data.data.length
        this.engines.enabled = body.data.data.filter(x => x.enabled === true).length

        let x = []
        for (let i = 0; i < body.data.data.length; i++) {
          if (body.data.data[i].enabled) {
            x.push({ 'label': body.data.data[i].name, 'data': 1 })
          }
        }
        this.categoryData = {
          data: x.map(e => { return e.data }),
          labels: x.map(e => {
            if (e.label === '') {
              return 'Others'
            }
            return e.label
          })
        }

        this.categoryDataFetchedAt = new Date()
      })
    },
    toggleCategory (index) {
      if (!this.categories[index]) {
        return
      }

      let category = this.categories[index]
      category.disabled = !category.disabled

      this.categories.splice(index, 1, category)
    },
    fetchNewMalware () {
      return this.$http.get(`/api/v1/overview/malware/new`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.count.newMalware = body.data.data
      })
    },
    fetchTotal () {
      return this.$http.get(`/api/v1/overview/malware/total`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.count.total = body.data.data
      })
    }
  }
}
</script>
