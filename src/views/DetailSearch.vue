<template>
  <section
    class="section"
    style="text-align: initial"
  >
    <div
      style="margin:0 auto"
    >
      <div style="display: flex">
        <octicon
          :icon="bug"
          :scale="2.5"
        />
        <input
          v-model="hash"
          class="input ml-2"
          @keyup.enter="lookup(hash)"
        >
        <button
          class="button"
          @click.prevent="lookup(hash)"
        >
          <octicon
            :icon="search"
            :scale="1"
          />
        </button>
        <button
          class="button"
          @click.prevent="$router.push({name: 'search'})"
        >
          <octicon
            :icon="arrowSmallLeft"
            :scale="2"
          />
          <span style="ml-2">
            Go Search</span>
        </button>
      </div>
    </div>
    <div v-if="isLoading">
      <loading
        :active="isLoading"
        overlay
      />
    </div>
    <div
      v-else-if="noMatch"
      class="my-6"
      style="text-align: center"
    >
      <octicon
        :icon="circleSlash"
        :scale="6"
      />
      <br>
      <div class="my-3">
        <label class="title">No matches found</label>
      </div>
      <button
        class="button is-primary my-6"
        @click.prevent="$router.push({ name: 'search' })"
      >
        Try a new search
      </button>
    </div>
    <div
      v-else
      class="my-6"
    >
      <div
        v-if="engines.ENGINE_MALWARE"
        class="mydb columns"
      >
        <div class="column is-1">
          <chart
            ref="chartMyDB"
            :chart-data="chartMyDB"
            :options="opt"
          />
          <div v-if="loading.mydb">
            <span class="padding: 0 auto">Processing</span>
          </div>
          <div
            v-else-if=" !my_db || !my_db.id"
            style="text-align: center"
          >
            <span class="padding: 0 auto">Not found</span>
          </div>
          <div
            v-else
            style="text-align: center"
          >
            <span style="text-align: center">Threat</span>
          </div>
        </div>
        <div class="column">
          <box>
            <div slot="header">
              My Database
            </div>
            <template v-if="my_db && my_db.id">
              <div class="field columns">
                <label class="label column is-1">Source</label>
                <p class="column">
                  {{ my_db.source }}
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">MD5</label>
                <p class="column">
                  {{ my_db.md5 }}
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">SHA1</label>
                <p class="column">
                  {{ my_db.sha1 }}
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">SHA256</label>
                <p class="column">
                  {{ my_db.sha256 }}
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">Detected</label>
                <p class="column">
                  {{ my_db.date }}
                </p>
              </div>
            </template>
          </box>
        </div>
      </div>
      <div
        v-if="engines.ENGINE_AI"
        class="mydb columns"
      >
        <div class="column is-1">
          <chart
            ref="chartAI"
            :chart-data="chartAI"
            :options="opt"
          />
          <div v-if="loading.ai">
            <span class="padding: 0 auto">Processing</span>
          </div>
          <div
            v-else-if=" aiResult === '0'"
            style="text-align: center"
          >
            <span class="padding: 0 auto">Clean</span>
          </div>
          <div
            v-else-if=" aiResult === '-1'"
            style="text-align: center"
          >
            <span style="text-align: center">Not found</span>
          </div>
          <div
            v-else-if=" aiResult === '1'"
            style="text-align: center"
          >
            <span style="text-align: center">Threat</span>
          </div>
          <div
            v-else
            style="text-align: center"
          >
            <span class="padding: 0 auto">Processing </span>
          </div>
        </div>
        <div class="column">
          <box>
            <div slot="header">
              AI Engine
            </div>
            <template>
              <div
                v-if=" aiResult === '0'"
                style="text-align: center"
              >
                <span class="padding: 0 auto">This file is clean</span>
              </div>
              <div
                v-else-if=" aiResult === '-1'"
                style="text-align: center"
              >
                <span style="text-align: center">This file is not found</span>
              </div>
              <div
                v-else-if=" aiResult === '1'"
                style="text-align: center"
              >
                <span style="text-align: center">This file is suspicious</span>
              </div>

              <div
                v-else
                style="text-align: center"
              >
                <span class="padding: 0 auto">This file isprocessing</span>
              </div>
            </template>
          </box>
        </div>
      </div>
      <div
        v-if="engines.ENGINE_SANDBOX"
        class="mydb columns"
      >
        <div class="column is-1">
          <chart
            ref="chartSandbox"
            :chart-data="chartSandbox"
            :options="opt"
          />
          <div v-if="loading.sandbox">
            <span class="padding: 0 auto">Processing</span>
          </div>
          <div
            v-else-if=" !sandbox || !sandbox.id"
            style="text-align: center"
          >
            <span class="padding: 0 auto">Not found</span>
          </div>
          <div
            v-else-if="sandbox.score < 8"
            style="text-align: center"
          >
            <span class="padding: 0 auto">Clean</span>
          </div>
          <div
            v-else
            style="text-align: center"
          >
            <span style="text-align: center">Threat</span>
          </div>
        </div>
        <div class="column">
          <box>
            <div slot="header">
              Sandbox
            </div>
            <template v-if="sandbox && sandbox.id">
              <div class="field columns">
                <label class="label column is-1">Source</label>
                <p class="column">
                  Sandbox
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">MD5</label>
                <p class="column">
                  {{ sandbox.file.md5 }}
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">SHA256</label>
                <p class="column">
                  {{ sandbox.file.sha256 }}
                </p>
              </div>
              <div class="field columns">
                <label class="label column is-1">Score</label>
                <p class="column">
                  {{ sandbox.score }} / 10
                </p>
              </div>
            </template>
          </box>
        </div>
      </div>
      <div
        v-if="engines.ENGINE_VTT"
        class="mydb columns"
      >
        <div class="column is-1">
          <chart
            v-if="chartVTT"
            ref="chartVTT"
            :chart-data="chartVTT"
            :options="opt"
          />
          <div v-if="loading.vtt">
            <span class="padding: 0 auto">Processing</span>
          </div>
          <div
            v-else-if="!virustotal || !virustotal.total"
            style="text-align: center"
          >
            <span style="text-align: center">Not found </span>
          </div>
          <div
            v-else-if="virustotal.positives === 0"
            style="text-align: center"
          >
            <span style="text-align: center">Clean </span>
            <span style="text-align: center"> {{ virustotal.positives }}/{{ virustotal.total }}</span>
          </div>
          <div
            v-else
            style="text-align: center"
          >
            <span style="text-align: center"> {{ virustotal.positives }}/{{ virustotal.total }}</span>
          </div>
        </div>
        <div class="column">
          <box>
            <div slot="header">
              Virustotal
            </div>
            <template>
              <div
                style="max-height: 300px;overflow-y: auto; overflow-x: hidden;"
              >
                <table
                  class="table table-striped table-bordered"
                  style="width:100%"
                >
                  <thead style="height:45px">
                    <tr class="columns">
                      <th class="column is-3">
                        Engine
                      </th>
                      <th class="column is-3">
                        Detect
                      </th>
                      <th class="column is-3">
                        Last Update
                      </th>
                      <th class="column is-3">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, name) in tableVTT"
                      :key="name"
                      class="columns"
                    >
                      <td class="column is-3">
                        {{ name }}
                      </td>
                      <td class="column is-3">
                        <octicon
                          :icon="issueClosed"
                          :scale="1"
                        />
                        {{ value.detected ? 'Detected': 'Undetected' }}
                      </td>
                      <td class="column is-3">
                        {{ formatTime(value.update) }}
                      </td>
                      <td
                        class="column is-3"
                        :class="value.detected && value.result?'has-text-danger':'has-text-black'"
                      >
                        <octicon
                          :icon="issueClosed"
                          :scale="1"
                        />
                        {{ value.detected && value.result ? value.result: 'Undetected' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </box>
        </div>
      </div>
      <div
        v-if="engines.ENGINE_OPSWAT"
        class="mydb columns"
      >
        <div class="column is-1">
          <chart
            v-if="chartOPS"
            ref="chartOPS"
            :chart-data="chartOPS"
            :options="opt"
          />
          <div v-if="loading.ops">
            <loading
              :active="loading.ops"
              overlay
            />
            <span class="padding: 0 auto">Processing</span>
          </div>
          <div
            v-else-if="!opswat || !opswat.scan_results || !opswat.scan_results.total_avs "
            style="text-align: center"
          >
            <span style="text-align: center">Not found </span>
          </div>
          <div
            v-else-if=" opswat.scan_results.total_detected_avs === 0"
            style="text-align: center"
          >
            <span style="text-align: center">Clean </span>
            <span style="text-align: center"> {{ opswat.scan_results.total_detected_avs }}/{{ opswat.scan_results.total_avs }}</span>
          </div>
          <div
            v-else
            style="text-align: center"
          >
            <span style="text-align: center"> {{ opswat.scan_results.total_detected_avs }}/{{ opswat.scan_results.total_avs }}</span>
          </div>
        </div>
        <div class="column">
          <box>
            <div slot="header">
              Metadefender opswat
            </div>
            <template>
              <div
                style="max-height: 300px;overflow-y: auto; overflow-x: hidden;"
              >
                <table
                  class="table table-striped table-bordered"
                  style="width:100%;"
                >
                  <thead style="height:45px">
                    <tr class="columns">
                      <th class="column is-3">
                        Engine
                      </th>
                      <th class="column is-3">
                        Detect
                      </th>
                      <th class="column is-3">
                        Last Update
                      </th>
                      <th class="column is-3">
                        Result
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(value, name) in tableOPS"
                      :key="name"
                      class="columns"
                    >
                      <td class="column is-3">
                        {{ name }}
                      </td>
                      <td class="column is-3">
                        <octicon
                          :icon="issueClosed"
                          :scale="1"
                        />
                        {{ value.scan_result_i ? 'Detected': 'Undetected' }}
                      </td>
                      <td class="column is-3">
                        {{ format(new Date(value.def_time), 'dd/MM/yyyy HH:mm:ss') }}
                      </td>
                      <td
                        class="column is-3"
                        :class="value.scan_result_i && value.threat_found?'has-text-danger':'has-text-black'"
                      >
                        <octicon
                          :icon="issueClosed"
                          :scale="1"
                        />
                        {{ value.scan_result_i && value.threat_found ? value.threat_found: 'Undetected' }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </template>
          </box>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { bug, arrowSmallLeft, search, issueClosed, circleSlash } from 'octicons-vue'
import Chart from '../components/Chart.vue'
import Loading from '@/components/Loading'
import format from 'date-fns/format'
import { B } from '../global.js'

export default {
  components: { Chart, Loading },
  data () {
    return {
      bug,
      arrowSmallLeft,
      search,
      issueClosed,
      circleSlash,
      hash: '',
      // item: {
      my_db: {},
      virustotal: {},
      opswat: {},
      sandbox: {},
      // },
      opt: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: false
        },
        cutout: 0.1,
        legend: {
          display: false
        }
      },
      isLoading: true,
      verbose_msg: 0,
      interval: null,
      interval1: null,
      interval2: null,
      interval3: null,
      loading: {
        mydb: false,
        vtt: false,
        sandbox: false,
        ops: false,
        ai: false
      },
      aiResult: -2,
      engines: {}
    }
  },
  computed: {
    chartClean () {
      return {
        datasets: [
          {
            backgroundColor: '#22b573',
            data: [1]
          }
        ]
      }
    },
    chartMyDB () {
      if (!this.my_db || !this.my_db.id) {
        return {
          labels: [ 'Clean' ],
          datasets: [
            {
              backgroundColor: '#22b573',
              data: [1]
            }
          ]
        }
      }

      return {
        labels: [ 'Threat' ],
        datasets: [
          {
            backgroundColor: ['#ff1f4a'],
            data: [1]
          }
        ]
      }
    },
    chartAI () {
      if (this.aiResult === '0') {
        return {
          labels: [ 'Clean' ],
          datasets: [
            {
              backgroundColor: '#22b573',
              data: [1]
            }
          ]
        }
      }

      if (this.aiResult === '1') {
        return {
          labels: [ 'Threat' ],
          datasets: [
            {
              backgroundColor: ['#ff1f4a'],
              data: [1]
            }
          ]
        }
      }
      return {}
    },
    chartVTT () {
      if (!this.virustotal || !this.virustotal.total || this.virustotal.positives === 0) {
        return {
          labels: [ 'Clean' ],
          datasets: [
            {
              backgroundColor: '#22b573',
              data: [1]
            }
          ]
        }
      }
      return {
        labels: [ 'Threat', 'Clean' ],
        datasets: [
          {
            backgroundColor: ['#ff1f4a', '#767171'],
            data: [this.virustotal.positives, this.virustotal.total - this.virustotal.positives]
          }
        ]
      }
    },
    chartOPS () {
      if (!this.opswat || !this.opswat.scan_results || !this.opswat.scan_results.total_avs || this.opswat.scan_results.total_detected_avs === 0) {
        return {
          labels: [ 'Clean' ],
          datasets: [
            {
              backgroundColor: '#22b573',
              data: [1]
            }
          ]
        }
      }
      return {
        labels: [ 'Threat', 'Clean' ],
        datasets: [
          {
            backgroundColor: ['#ff1f4a', '#767171'],
            data: [this.opswat.scan_results.total_detected_avs, this.opswat.scan_results.total_avs - this.opswat.scan_results.total_detected_avs]
          }
        ]
      }
    },
    tableVTT () {
      return this.virustotal && this.virustotal.scans ? this.virustotal.scans : {}
    },
    tableOPS () {
      return this.opswat && this.opswat.scan_results && this.opswat.scan_results.scan_details ? this.opswat.scan_results.scan_details : {}
    },
    chartSandbox () {
      if (!this.sandbox || !this.sandbox.id || this.sandbox.score < 8) {
        return {
          labels: [ 'Clean' ],
          datasets: [
            {
              backgroundColor: '#22b573',
              data: [1]
            }
          ]
        }
      }

      return {
        labels: [ 'Threat' ],
        datasets: [
          {
            backgroundColor: ['#ff1f4a', '#767171'],
            data: [1]
          }
        ]
      }
    },
    noMatch () {
      if (this.isLoading || this.loading.my_db || this.loading.vtt || this.loading.opswat || this.loading.ai || this.loading.sandbox) {
        return false
      }
      if (this.$route.params.type === 'hash' && !this.virustotal.scan_id && !this.my_db.source && !this.opswat.data_id && !this.sandbox.id) {
        return true
      }

      if (this.$route.params.type === 'file' && !this.virustotal.scan_id && !this.my_db.source && !this.opswat.data_id && !this.sandbox.id && this.aiResult === '-2') {
        return true
      }
      return false
    }
  },
  created () {
  },
  mounted () {
    if (!this.$route || !this.$route.params.hash || !this.$route.params.type) {
      this.$router.push({ name: 'search' })
    }

    this.hash = this.$route.params.hash
    this.isLoading = true
    this.getEngines().finally(() => {
      if (this.$route.params.type === 'hash') {
        this.lookup(this.hash)
      }

      if (this.$route.params.type === 'file') {
        var self = this
        this.loading = {
          mydb: true,
          vtt: true,
          sandbox: true,
          ops: true
        }
        if (this.engines.ENGINE_MALWARE) {
          this.lookupHashLocal(this.$route.params.hash)
        }

        if (this.engines.ENGINE_OPSWAT) {
          this.interval = setInterval(() => {
            self.scanOPS(B.scanIDOPS)
          }, 10000)
        }

        if (this.engines.ENGINE_VTT) {
          this.interval1 = setInterval(() => {
            self.lookupFileVTT(B.scanIDVTT)
          }, 10000)
        }

        if (this.engines.ENGINE_SANDBOX) {
          this.interval2 = setInterval(() => {
            self.scanSandbox(B.sandboxID)
          }, 10000)
        }

        if (this.engines.ENGINE_AI) {
          this.interval3 = setInterval(() => {
            self.scanAI(this.$route.params.hash)
          }, 10000)
        }
      }
    })
  },
  destroyed () {
    clearInterval(this.interval)
    clearInterval(this.interval1)
    clearInterval(this.interval2)
    clearInterval(this.interval3)
  },
  methods: {
    getEngines () {
      return this.$http.get(`/api/v1/engine`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        this.engines = Object.assign({}, ...body.data.data.map(s => ({ [s.name]: s.enabled })))
      })
    },
    format,
    lookup (hash) {
      this.isLoading = true
      this.loading = {
        my_db: true,
        ai: true,
        sandbox: true,
        vtt: true,
        opswat: true
      }
      return this.$http.get(`api/v1/lookup/hash/${hash}`).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }

        // this.item = {
        this.my_db = body.data.data.my_db ? body.data.data.my_db : {}
        this.opswat = body.data.data.opswat ? body.data.data.opswat : {}
        this.virustotal = body.data.data.virustotal ? body.data.data.virustotal : {}
        this.sandbox = body.data.data.sandbox && body.data.data.sandbox.info ? body.data.data.sandbox.info : {}
        this.sandbox.file = body.data.data.sandbox && body.data.data.sandbox.target.file ? body.data.data.sandbox.target.file : {}

        if (!body.data.data.aiEngine || !body.data.data.aiEngine.status) {
          return
        }
        switch (body.data.data.aiEngine.status) {
          case 'not found': {
            this.aiResult = '-1'
            return
          }
          case 'reported': {
            this.aiResult = body.data.data.aiEngine.classification
          }
        }
        // }
      }).finally(() => {
        this.updateDatabase()
        this.isLoading = false
        this.loading = {
          my_db: false,
          ai: false,
          sandbox: false,
          vtt: false,
          opswat: false
        }
      })
    },
    updateDatabase () {
      if (!this.my_db) {
        return
      }
      if (this.sandbox.score >= 8 || this.virustotal.positives > 0 || this.opswat.scan_results.total_detected_avs > 0 || this.aiResult === '1') {
        let content = {}
        content.md5 = this.hash
        if (this.virustotal.positives > 0) {
          content.sha1 = this.virustotal.sha1.toLowerCase()
          content.sha256 = this.virustotal.sha256.toLowerCase()
        }
        if (this.opswat.scan_results.total_detected_avs > 0) {
          content.sha1 = this.opswat.file_info.sha1.toLowerCase()
          content.sha256 = this.opswat.file_info.sha256.toLowerCase()
        }
        return this.$http.post(`/api/v1/malware/info`, content).then(body => {
        })
      }
    },
    formatTime (time) {
      let pair = Array.from(time)
      pair.splice(4, 0, '/')
      pair.splice(7, 0, '/')
      return pair.join('')
    },
    lookupFileVTT (id) {
      return this.$http.get(`api/v1/scan/vtt/${id}`).then(body => {
        console.log('body.data', body.data)
        if (!body || !body.data || !body.data.data || body.data.data.response_code === -2) {
          this.virustotal = {}
          return
        }
        this.virustotal = body.data.data
        if (!body.data.data.response_code) {
          return
        }
        clearInterval(this.interval1)
        this.isLoading = false
        this.loading.vtt = false
      })
    },
    lookupHashLocal (hash) {
      return this.$http.get(`api/v1/scan/local/${hash}`).then(body => {
        if (!body || !body.data || !body.data.data) {
          this.opswat = {}
          return
        }
        this.mydb = body.data.data
        this.isLoading = false
        this.loading.mydb = false
      })
    },
    scanOPS (id) {
      return this.$http.get(`api/v1/scan/opswat/${id}`).then(body => {
        if (!body || !body.data || !body.data.data) {
          this.opswat = {}
          return
        }
        this.opswat = body.data.data
        if (body.data.data.process_info.progress_percentage !== 100) {
          return
        }
        clearInterval(this.interval)
        this.isLoading = false
        this.loading.ops = false
      })
    },
    scanSandbox (id) {
      return this.$http.get(`api/v1/scan/sandbox/${id}`).then(body => {
        if (!body || !body.data) {
          this.sandbox = {}
          return
        }
        if (!body.data.data || !body.data.data.info) {
          return
        }
        this.sandbox = body.data.data.info
        this.sandbox.file = body.data.data.target && body.data.data.target.file ? body.data.data.target.file : {}
        this.loading.sandbox = false
        clearInterval(this.interval2)
        this.isLoading = false
      })
    },
    scanAI (hash) {
      return this.$http.get(`api/v1/scan/aiengine/${hash}`).then(body => {
        console.log(body)
        if (!body || !body.data) {
          this.aiResult = {}
          return
        }

        this.loading.ai = false
        clearInterval(this.interval3)
        this.isLoading = false
        let result = body.data.data.status
        switch (result) {
          case 'not found': {
            this.aiResult = -1
            break
          }
          case 'reported': {
            console.log(body.data.data.classification)
            this.aiResult = body.data.data.classification
            break
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
canvas {
  width: 100px;
}
</style>
