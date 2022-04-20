<template>
  <div>
    <ul class="breadcrumb">
      <li>
        <h1 class="title is-5 has-te">
          <router-link to="/">
            Home
          </router-link>
        </h1>
      </li>
      <template v-for="(c,i) in crumbs">
        <li :key="i">
          <h1 :class="{'title':true ,'is-5':true, 'has-text-black':disable(c.to)}">
            <router-link
              :class="{'has-text-black':disable(c.to)}"
              :to="c.to"
            >
              {{ c.text }}
            </router-link>
          </h1>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'BreadCrumbs',
  computed: {
    crumbs: function () {
      let pathArray = this.$route.path.split('/')
      pathArray.shift()
      var absolutepath = ''
      let breadcrumbs = pathArray.reduce((breadcrumbArray, path, idx) => {
        breadcrumbArray.push({
          path: path,
          to: breadcrumbArray[idx - 1]
            ? absolutepath + '/' + path
            : '/' + path,
          text: path
        })
        breadcrumbArray[idx].text = this.$router.match(breadcrumbArray[idx].to).meta.breadCrumb ? this.$router.match(breadcrumbArray[idx].to).meta.breadCrumb : breadcrumbArray[idx].path
        absolutepath = absolutepath + '/' + path
        return breadcrumbArray
      }, [])
      return breadcrumbs
    }
  },
  methods: {
    disable (path) {
      return path === this.$route.path
    }
  }
}
</script>

<style scoped>
.breadcrumb {
  display: flex;
  padding-left: 24px;
  padding-top: 24px;
}

li {
  text-decoration: none;
}
</style>
