import Vue from 'vue'
import Chart from 'chart.js'

let LineChart = (() => {
  return {
    data (data) {
      return {
        labels: data.labels,
        datasets: data.datasets.map((item, index) => {
          return {
            data: item.data,
            label: item.label,
            fill: false,
            lineTension: 0,
            backgroundColor: item.backgroundColor,
            borderColor: item.borderColor,
            pointBorderWidth: 4,
            pointHoverRadius: 4,
            pointBackgroundColor: item.pointBackgroundColor,
            pointHoverBackgroundColor: item.pointHoverBackgroundColor,
            pointHoverBorderColor: item.pointHoverBorderColor,
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10
          }
        })
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

      let unit = attrs && attrs.unit ? attrs.unit : 'day'

      if (el.chart) {
        let data = this.data(binding.value)
        el.chart.data.labels = data.labels
        el.chart.data.datasets = data.datasets
        return el.chart.update()
      }

      el.chart = new Chart(el, {
        type: 'line',
        data: this.data(binding.value),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: typeof attrs['external-legend'] === 'undefined'
          },
          scales: {
            xAxes: [{
              type: 'time',
              time: {
                unit: unit,
                minUnit: unit,
                unitStepSize: 1,
                displayFormats: {
                  'day': 'DD/MM/YYYY',
                  'minute': 'HH:mm',
                  'hour': 'HH'
                }
              }
            }]
          },
          afterInit (chart, something) {
            vnode.context.$emit('Chart:finished', chart, something)
          }
        }
      })
    },

    bind (el, binding, vnode) {
      if (!binding.value.datasets || !binding.value.labels) {
        return
      }

      if (!binding.value.datasets.length || !binding.value.labels.length) {
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
      if (!binding.value.datasets || !binding.value.labels) {
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

export default LineChart
