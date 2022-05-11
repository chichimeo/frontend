import Vue from 'vue'
import Chart from 'chart.js'
import { Colors, CapitalizeFirstLetter } from '@/utils'

let DoughnutChart = (() => {
  return {
    data (data) {
      return {
        labels: data.labels.map(o => {
          return CapitalizeFirstLetter(o)
        }),
        datasets: [
          {
            label: '',
            data: data.data,
            borderWidth: 0,
            backgroundColor: Colors.default,
            hoverBackgroundColor: Colors.lighter,
            hoverBorderColor: Colors.darker,
            hoverBorderWidth: 0
          }
        ]
      }
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
        type: 'doughnut',
        data: this.data(binding.value),
        options: {
          aspectRatio: 2.5,
          maintainAspectRatio: true,
          responsive: true,
          afterInit (chart, something) {
            vnode.context.$emit('Chart:finished', chart, something)
          },
          legend: {
            position: 'right',
            labels: {
              boxWidth: 30,
              generateLabels (chart) {
                let data = chart.data
                let length = 15

                if (!data.labels.length && !data.datasets.length) {
                  return []
                }

                let getValueAtIndexOrDefault = (value, index, defaultValue) => {
                  if (value === undefined || value === null) {
                    return defaultValue
                  }

                  if (Array.isArray(value)) {
                    return index < value.length ? value[index] : defaultValue
                  }

                  return value
                }

                return data.labels.map((label, i) => {
                  var meta = chart.getDatasetMeta(0)
                  var ds = data.datasets[0]
                  var arc = meta.data[i]
                  var custom = (arc && arc.custom) || {}
                  var arcOpts = chart.options.elements.arc
                  var fill = custom.backgroundColor ? custom.backgroundColor : getValueAtIndexOrDefault(ds.backgroundColor, i, arcOpts.backgroundColor)
                  var stroke = custom.borderColor ? custom.borderColor : getValueAtIndexOrDefault(ds.borderColor, i, arcOpts.borderColor)
                  var bw = custom.borderWidth ? custom.borderWidth : getValueAtIndexOrDefault(ds.borderWidth, i, arcOpts.borderWidth)

                  return {
                    text: label.length > length ? label.substring(0, length - 3) + '...' : label,
                    fillStyle: fill,
                    strokeStyle: stroke,
                    lineWidth: bw,
                    hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                    index: i
                  }
                })
              }
            }
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

export default DoughnutChart
