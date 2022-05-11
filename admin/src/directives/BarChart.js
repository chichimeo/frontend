import Vue from 'vue'
import Chart from 'chart.js'
import { Colors } from '@/utils'

let BarChart = (() => {
  return {
    data (data) {
      let res = {
        labels: JSON.parse(JSON.stringify(data.labels)),
        datasets: [
          {
            label: '',
            data: data.data,
            backgroundColor: data.colors.backgroundColor || Colors.default,
            hoverBackgroundColor: data.colors.hoverBackgroundColor || Colors.lighter,
            hoverBorderColor: data.colors.hoverBorderColor || Colors.darker,
            hoverBorderWidth: 0
          }
        ]
      }

      if (res.labels.length < 3) {
        res.labels.push(...(new Array(3 - res.labels.length).fill('')))
      }

      return res
    },
    initChart (el, binding, vnode) {
      if (!document.body.contains(el)) {
        Vue.nextTick(() => {
          this.initChart(el, binding, vnode)
        })
        return
      }

      let attrs = vnode.data.attrs

      if (attrs.timestamp) {
        el.chartTimestamp = attrs.timestamp
      }

      if (el.chart) {
        let data = this.data(binding.value)
        el.chart.data.labels = data.labels
        el.chart.data.datasets = data.datasets

        return el.chart.update()
      }

      el.chart = new Chart(el, {
        type: 'bar',
        data: this.data(binding.value),
        options: {
          aspectRatio: 2.5,
          maintainAspectRatio: true,
          responsive: true,
          legend: {
            display: false
          },
          scales: {
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: true
              }
            }],
            xAxes: [{
              ticks: {
                callback (value) {
                  let accepted = 15
                  if (value.length <= accepted) {
                    return value
                  }

                  let position = value.lastIndexOf('.')
                  let tld = value.substr(position)
                  return `${value.substr(0, accepted - tld.length)}...${tld}`
                }
              }
            }]
          },
          tooltips: {
            enabled: true,
            mode: 'label',
            callbacks: {
              title (tooltipItems, data) {
                return ''
              },
              label (tooltipItem, data) {
                var idx = tooltipItem.index
                if (!data.datasets || !data.datasets.length) {
                  return data.labels[idx]
                }

                if (!data.datasets[tooltipItem.datasetIndex] || !data.datasets[tooltipItem.datasetIndex].data[idx]) {
                  return data.labels[idx]
                }

                return `${data.labels[idx]}: ${data.datasets[tooltipItem.datasetIndex].data[idx]}`
              }
            }
          },
          afterInit (chart, something) {
            vnode.context.$emit('Chart:finished', chart, something)
          }
        }
      })
    },

    bind (el, binding, vnode) {
      if (!binding.value.data || !binding.value.labels) {
        return
      }

      if (!binding.value.data.length || !binding.value.labels.length) {
        return
      }

      binding.def.initChart(el, binding, vnode)
    },

    unbind (el) {
      if (!el.chart) {
        return
      }

      el.chart.destroy()
    },

    update (el, binding, vnode) {
      if (!binding.value.data || !binding.value.labels) {
        return
      }

      let attrs = vnode.data.attrs

      if (attrs && attrs.timestamp && el.chartTimestamp) {
        if (attrs.timestamp === el.chartTimestamp) {
          return
        }
      }

      binding.def.initChart(el, binding, vnode)
    }
  }
})()

export default BarChart
