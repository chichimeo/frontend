
// import { note } from 'octicons-vue'
export default [
  {
    path: '/',
    name: 'search',
    component: () => import('./views/Search.vue'),
    meta: {
      title: 'Home'
    },
    children: [
      {
        path: ':type/:hash',
        name: 'search-details',
        component: () => import('./views/DetailSearch.vue'),
        meta: {
          title: 'Search Details',
          show: false
        }
      }
    ]
  }
  // {
  //   path: '/search',
  //   name: 'search',
  //   component: () => import('./views/Search.vue')
  // children: [
  //   {
  //     path: ':id',
  //     name: 'reports-details',
  //     component: () => import(/* webpackChunkName: "reports" */ './views/ReportsDetails.vue'),
  //     meta: {
  //       title: 'Reports Details',
  //       show: false
  //     }
  //   }
  // ]
  // }
]
