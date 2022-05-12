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
                {{ $l('newMalware','New Malware') }}
              </p>
              <p class="title">
                {{ count }}
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
                {{ $l('totalMalwares','Total Malwares') }}
              </p>
              <p class="title">
                {{ count }}
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
        <tab :title="$l('components.overview.recentThreatEvents','Recent Malwares in My Database')">
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
                      {{ $t('Virus share') }}
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
                  {{ $l('components.overview.detectedThreats','Detected Threats') }}
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
            <tab :title="$l('components.overview.topInfectedClients','Sources in My Database')">
              <bar-chart
                :data="clientData"
                :timestamp="clientDataFetchedAt"
                :legend-title="$l('components.overview.clients','Clients')"
                @limited="clientDataFetchedAt = new Date()"
              />
            </tab>
          </tabs>
        </box>
      </div>

      <div class="column is-half">
        <box style="margin: 0; height: 100%;">
          <tabs :theme="$_ui_theme_tabs">
            <tab :title="$l('components.overview.category','Category')">
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
      count: 199,
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
            if (item.label === '') {
              item.label = 'others'
            }
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
      this.fetch()
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
    },
    fetchEventDateFrequency () {
      let data = {
        categories: [
          'file malware',
          'malicious process',
          'malicious task scheduler',
          'malicious wmi',
          'file malware-warning',
          'malicious services',
          'malicious key autorun',
          'smb-attack-blocked'
        ],
        chart: {
          '20220428': [
            {
              'label': 'file malware',
              'data': 860,
              'timestamp': '20220428'
            },
            {
              'label': 'malicious process',
              'data': 93,
              'timestamp': '20220428'
            },
            {
              'label': 'malicious task scheduler',
              'data': 57,
              'timestamp': '20220428'
            },
            {
              'label': 'malicious wmi',
              'data': 40,
              'timestamp': '20220428'
            },
            {
              'label': 'malicious key autorun',
              'data': 9,
              'timestamp': '20220428'
            },
            {
              'label': 'file malware-warning',
              'data': 6,
              'timestamp': '20220428'
            },
            {
              'label': 'malicious services',
              'data': 1,
              'timestamp': '20220428'
            }
          ],
          '20220429': [
            {
              'label': 'file malware',
              'data': 204,
              'timestamp': '20220429'
            },
            {
              'label': 'malicious task scheduler',
              'data': 12,
              'timestamp': '20220429'
            },
            {
              'label': 'malicious process',
              'data': 10,
              'timestamp': '20220429'
            },
            {
              'label': 'malicious wmi',
              'data': 8,
              'timestamp': '20220429'
            },
            {
              'label': 'file malware-warning',
              'data': 2,
              'timestamp': '20220429'
            },
            {
              'label': 'malicious services',
              'data': 2,
              'timestamp': '20220429'
            }
          ],
          '20220430': [],
          '20220501': [],
          '20220502': [],
          '20220503': [],
          '20220504': [
            {
              'label': 'file malware',
              'data': 8916,
              'timestamp': '20220504'
            },
            {
              'label': 'malicious process',
              'data': 77,
              'timestamp': '20220504'
            },
            {
              'label': 'malicious task scheduler',
              'data': 25,
              'timestamp': '20220504'
            },
            {
              'label': 'malicious wmi',
              'data': 16,
              'timestamp': '20220504'
            },
            {
              'label': 'file malware-warning',
              'data': 7,
              'timestamp': '20220504'
            },
            {
              'label': 'smb-attack-blocked',
              'data': 1,
              'timestamp': '20220504'
            },
            {
              'label': 'malicious services',
              'data': 1,
              'timestamp': '20220504'
            }
          ],
          '20220505': [
            {
              'label': 'file malware',
              'data': 40692,
              'timestamp': '20220505'
            },
            {
              'label': 'malicious process',
              'data': 105,
              'timestamp': '20220505'
            },
            {
              'label': 'malicious task scheduler',
              'data': 24,
              'timestamp': '20220505'
            },
            {
              'label': 'malicious wmi',
              'data': 16,
              'timestamp': '20220505'
            },
            {
              'label': 'file malware-warning',
              'data': 6,
              'timestamp': '20220505'
            },
            {
              'label': 'malicious services',
              'data': 3,
              'timestamp': '20220505'
            }
          ]
        }
      }
      this.categories = []
      data.categories.forEach((e, i) => {
        let disabled = false
        if (e === '') {
          e = 'others'
          disabled = true
        }
        this.categories.push({
          name: e,
          disabled: disabled,
          backgroundColor: this.colors.default[i],
          borderColor: this.colors.default[i],
          pointBackgroundColor: this.colors.lighter[i],
          pointHoverBackgroundColor: this.colors.lighter[i],
          pointHoverBorderColor: this.colors.darker[i]
        })
      })
      this.redRawData = data.chart
    },
    fetchEventClient () {
      this.clientDataFetchedAt = null
      let data = [
        {
          'label': 'VirusShare',
          'data': 2335
        },
        {
          'label': 'Malshare',
          'data': 1862
        },
        {
          'label': 'Engine Virus',
          'data': 1754
        }
      ]
      this.clientData = {
        data: data.map(e => { return e.data }),
        labels: data.map(e => {
          if (e.label === '') {
            return 'Others'
          }
          return e.label
        })
      }
      this.clientDataFetchedAt = new Date()
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
    }
  }
}
</script>
