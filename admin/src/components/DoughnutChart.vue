<template>
  <div class="doughnut-chart">
    <div
      v-if="!timestamp"
      class="chart-loader"
    >
      <svg
        viewBox="0 0 105 105"
        xmlns="http://www.w3.org/2000/svg"
        fill="#495057"
        width="40px"
      >
        <circle
          cx="12.5"
          cy="12.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="0s"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="12.5"
          cy="52.5"
          r="12.5"
          fill-opacity=".5"
        ><animate
          attributeName="fill-opacity"
          begin="100ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="52.5"
          cy="12.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="300ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="52.5"
          cy="52.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="600ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="92.5"
          cy="12.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="800ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="92.5"
          cy="52.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="400ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="12.5"
          cy="92.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="700ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="52.5"
          cy="92.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="500ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle> <circle
          cx="92.5"
          cy="92.5"
          r="12.5"
        ><animate
          attributeName="fill-opacity"
          begin="200ms"
          dur="1s"
          values="1;.2;1"
          calcMode="linear"
          repeatCount="indefinite"
        /></circle>
      </svg>
    </div>
    <div>
      <canvas
        v-doughnut-chart="computedData"
        :timestamp="timestamp"
      />
    </div>
  </div>
</template>

<script>
import DoughnutChart from '@/directives/DoughnutChart'
export default {
  name: 'DoughnutChart',
  directives: { DoughnutChart },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    timestamp: {
      type: Date,
      default: null
    }
  },
  computed: {
    computedData () {
      if (!this.data || !this.data.data || !this.data.data.length) {
        return this.data
      }

      let limit = 14
      if (this.data.data.length <= limit) {
        return this.data
      }
      let res = {
        data: this.data.data.slice(0, limit),
        labels: this.data.labels.slice(0, limit)
      }

      let otherCount = 0
      for (let i = limit; i < this.data.data.length; i++) {
        otherCount += this.data.data[i]
      }
      res.data.push(otherCount)
      res.labels.push('Other')
      return res
    }
  }
}
</script>

<style lang="scss">
.doughnut-chart {
  position: relative;
}
</style>
