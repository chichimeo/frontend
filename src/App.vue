<template>
  <div
    id="app"
    style="margin-top: 0"
  >
    <!-- <bread-crumbs /> -->
    <router-view />
  </div>
</template>

<script>
// import BreadCrumbs from "./components/BreadCrumbs";

export default {
  name: 'App'
  // components: { BreadCrumbs }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
.stepper {
  display: flex;
  width: 100%;
  padding-bottom: 1rem;
}
.stepper-item {
  display: inline-block;
  width: 50%;
  cursor: pointer;
  border-bottom-width: 5px;
  border-bottom-style: solid;
  border-bottom-color: #8a8a8a;
  text-align: center;
  .steper-header {
    color: #8a8a8a;
    font-weight: bolder;
  }
}

.stepper-done {
  border-bottom-color: #3298dc;
  .steper-header {
    color: #3298dc;
  }
}

.stepper-active {
  border-bottom-color: #3273dc;
  .steper-header {
    color: #3273dc;
  }
}
</style>
<style src="@cyradar/ui/dist/ui.css"></style>
