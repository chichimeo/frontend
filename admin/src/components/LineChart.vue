<template>
  <div class="line-chart">
    <div :class="[{ 'columns': !single }]">
      <div :class="[{ 'column is-two-thirds': !single }]">
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
        <slot name="above" />
        <div>
          <canvas
            v-line-chart="data"
            :style="{height: height}"
            external-legend
            :unit="unit"
            :timestamp="timestamp"
          />
        </div>
        <line-chart-choices
          v-if="choices && choices.length"
          :choices="choices"
          @toggled="toggleCategory"
        />
      </div>
      <div :class="[{ 'column is-one-third stats': !single }]">
        <slot name="right" />
      </div>
    </div>
  </div>
</template>
<script>
import LineChartChoices from '@/components/LineChartChoices'
import LineChart from '@/directives/LineChart'

export default {
  name: 'LineChart',
  components: { LineChartChoices },
  directives: { LineChart },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    timestamp: {
      type: Date,
      default: null
    },
    choices: {
      type: Array,
      default: () => []
    },
    unit: {
      type: String,
      default: ''
    },
    canvasHeight: {
      type: String,
      default: '300px'
    }
  },
  computed: {
    single () {
      return !this.$slots['right']
    },
    height () {
      return this.canvasHeight || '300px'
    }
  },
  methods: {
    toggleCategory (index) {
      this.$emit('toggled', index)
    }
  }
}
</script>

<style lang="scss">
.line-chart {
  position: relative;
}
</style>
