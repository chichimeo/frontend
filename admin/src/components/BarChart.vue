<template>
  <div class="bar-chart">
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
        v-bar-chart="dataLimited"
        :timestamp="timestamp"
      />
    </div>
    <div
      class="columns is-gapless"
      style="margin-bottom: 0;"
    >
      <div class="column is-four-fifths">
        <a
          :class="['button button--shadow', { active: choicesShown }]"
          role="button"
          aria-expanded="false"
          @click.prevent="choicesShown = !choicesShown"
        >{{ legendTitle }}
        </a>
      </div>
      <div class="column">
        <select
          v-model="limit"
          class="bar-chart__limit"
        >
          <option
            v-for="l in limits"
            :key="l"
            :value="l"
          >
            {{ l }}
          </option>
        </select>
      </div>
    </div>
    <ul
      v-show="choicesShown"
      class="bar-chart__choices"
    >
      <li
        v-for="(choice, index) in choicesLimited"
        :key="index"
        class="bar-chart__choice"
      >
        <a
          href="#"
          @click.prevent="toggleChoice(index)"
        ><span
          class="color"
          :style="{backgroundColor: isDisabled(index) ? '#adb5bd' : choice.backgroundColor || '#ababab'}"
        /> {{ choice.label }}</a>
      </li>
    </ul>
  </div>
</template>
<script>
import BarChart from '@/directives/BarChart'
import { Colors } from '@/utils'

export default {
  name: 'BarChart',
  directives: { BarChart },
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    timestamp: {
      type: Date,
      default: null
    },
    legendTitle: {
      type: String,
      default: ''
    }
  },
  data () {
    let limits = [10, 20, 50, 100]
    return {
      choicesShown: false,
      disabled: [],
      limit: limits[0],
      limits
    }
  },
  computed: {
    choices () {
      if (!this.data || !this.data.labels) {
        return []
      }

      return this.data.labels.map((label, index) => {
        return {
          label: label,
          backgroundColor: Colors.default[index],
          hoverBackgroundColor: Colors.lighter[index],
          hoverBorderColor: Colors.darker[index]
        }
      })
    },
    choicesLimited () {
      return this.choices.filter((label, index) => {
        return index <= this.limit
      })
    },
    dataLimited () {
      if (!this.data.labels || !this.data.data) {
        return {}
      }

      this.$emit('limited', this.limited)

      let colors = {
        backgroundColor: [],
        hoverBackgroundColor: [],
        hoverBorderColor: []
      }

      let labels = this.data.labels.filter((label, index) => {
        let accepted = index <= this.limit && !this.isDisabled(index)

        if (accepted) {
          colors.backgroundColor.push(this.choices[index].backgroundColor)
          colors.hoverBackgroundColor.push(this.choices[index].hoverBackgroundColor)
          colors.hoverBorderColor.push(this.choices[index].hoverBorderColor)
        }

        return accepted
      })

      return {
        colors: colors,
        labels: labels,
        data: this.data.data.filter((data, index) => {
          return index <= this.limit && !this.isDisabled(index)
        })
      }
    }
  },
  methods: {
    isDisabled (index) {
      return this.disabled.indexOf(index) > -1
    },
    toggleChoice (index) {
      let idx = this.disabled.indexOf(index)

      if (idx === -1) {
        this.disabled.push(index)
        return
      }

      this.disabled.splice(idx, 1)
    }
  }
}
</script>
<style lang="scss">

.bar-chart {
  position: relative;

  .bar-chart__limit {
    display: block;
    float: right;
    padding: 0.375rem 0.75rem;
    color: #495057;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
  }

  .bar-chart__choices {
    margin: .7rem 0;
    padding: 0;
    list-style: none;

    .bar-chart__choice {
      margin-bottom: 1rem;
      width: 25%;
      padding: 0 .5em;
      float: left;
      @media (min-width: 768px) {
        width: 20%;
      }

      @media (min-width: 1200px) {
        width: 33.3333%;
      }
    }

    a {
      color: #374961;
      display: inline-block;
      text-align: left;
      vertical-align: middle;
      line-height: 1em;
      width: 100%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      &:hover, &:focus {
        text-decoration: none;
      }
      .color {
        display: inline-block;
        vertical-align: bottom;
        width: 1em;
        height: 1em;
        border-radius: 3px;
      }
    }
  }
}

</style>
