<template>
  <router-view v-if="$route.name === 'search-details'" />
  <section
    v-else
    class="section"
    style="text-align: initial"
  >
    <div style="width: 60%; margin:0 auto">
      <div
        style="text-align:center;   margin:0 auto"
      >
        <div>
          <octicon
            :icon="bug"
            :scale="6"
          />
        </div>
        <div style="padding: 0.5rem">
          <h2 class="p-0 title">
            {{ $t('Virus share') }}
          </h2>
        </div>
        <div>
          <p>Analyze suspicious files, hash to detect malware and other breaches, automatically share them with the security community</p>
        </div>
      </div>
      <div class="search mt-6">
        <tabs>
          <tab title="File">
            <div style="text-align:center;   margin:0 auto">
              <div>
                <octicon
                  :icon="file"
                  :scale="3"
                />
              </div>
              <p class="my-5">
                By submitting a file to Virus share, you share the results of your submission with the cyber security community
              </p>
              <form id="fileUpload">
                <div class="file is-boxed has-name">
                  <label
                    class="file-label"
                    style="margin: 1rem auto"
                  >
                    <input
                      type="file"
                      class="file-input"
                      name="dbUpdateFile"
                      @change="onDBFileChange"
                    >
                    <span class="file-cta">
                      <span class="file-icon">
                        <octicon
                          :scale="2"
                          :icon="cloudUpload"
                        />
                      </span>
                      <span class="file-label">
                        {{ $l('components.configurationUpdate.chooseAFile','Choose a file...') }}
                      </span>
                    </span>
                    <span class="file-name">
                      {{ dbFileName ? dbFileName : $l('components.configurationUpdate.noFileChosen','No file chosen') }}
                    </span>
                  </label>
                </div>
                <button
                  class="button is-primary"
                  :disabled="loading"
                  @click.prevent="uploadFile"
                >
                  <span>{{ loading?'Processing':$t('Upload') }}</span>
                </button>
              </form>
            </div>
          </tab>
          <tab
            title="Search"
          >
            <div style="text-align:center;   margin:0 auto">
              <octicon
                :icon="search"
                :scale="3"
              />
              <p class="my-5">
                By submitting data to Virus share, you share the results of your submission with the cyber security community
              </p>
              <input
                v-model="hash"
                class="input"
                placeholder="MD5, SHA1, SHA256"
                @keyup.enter="lookup"
              >
            </div>
          </tab>
        </tabs>
      </div>
    </div>
  </section>
</template>
<script>
import { bug, file, search, cloudUpload } from 'octicons-vue'
import { Tabs, Tab } from '@cyradar/ui'
import { D } from '../global.js'

export default {
  components: { Tabs, Tab },
  data () {
    return {
      bug,
      file,
      search,
      cloudUpload,
      hash: '',
      dbFileName: '',
      fileData: null,
      item: {},
      loading: false
    }
  },
  methods: {
    lookup () {
      if (!this.hash) {
        return
      }

      this.$router.push({ name: 'search-details', params: { type: 'hash', hash: this.hash } })
    },
    onDBFileChange (event) {
      this.fileData = event.target.files[0]
      this.dbFileName = event.target.files[0].name
    },
    uploadFile () {
      this.loading = true
      let formData = new FormData()
      formData.append('file', this.fileData)
      return this.$http.post(`api/v1/lookup/file`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 600000 }).then(body => {
        if (!body || !body.data || !body.data.data) {
          return
        }
        D({
          'scanIDVTT': body.data.data.virustotal.md5,
          'scanIDOPS': body.data.data.opswat.data_id,
          'sandboxID': body.data.data.sandbox && body.data.data.sandbox.task_id ? body.data.data.sandbox.task_id : ''
        })
        this.$router.push({ name: 'search-details', params: { type: 'file', hash: body.data.data.virustotal.md5 } })
      })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
