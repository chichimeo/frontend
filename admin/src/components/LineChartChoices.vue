<template>
  <ul class="legend-choices tags is-vcentered">
    <li
      v-for="(category, index) in choices"
      :key="index"
    >
      <a
        v-show="!category.disabled || shown"
        href="#"
        class="tag has-text-weight-bold"
        :style="[{backgroundColor: category.disabled ? '#ddd' : category.backgroundColor || '#ababab'}]"
        @click.prevent="toggle(index)"
      >{{ category.name }}</a>
    </li>

    <li>
      <a
        href="#"
        class="tag has-text-weight-bold has-text-info"
        style="background-color: transparent; padding-left: 0;"
        @click.prevent="shown = !shown"
      >
        <octicon :icon="shown ? icon.chevronLeft : icon.chevronRight" />&nbsp;<span v-text="shown ? 'Collapse' : 'Expand'" /></a>
    </li>
  </ul>
</template>
<script>
import { chevronRight, chevronLeft } from 'octicons-vue'

export default {
  name: 'LineChartChoices',
  props: {
    choices: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      shown: false,
      icon: {
        chevronRight: chevronRight,
        chevronLeft: chevronLeft
      }
    }
  },
  methods: {
    toggle (index) {
      this.$emit('toggled', index)
    }
  }
}
</script>
