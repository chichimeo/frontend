
import { dashboard, bug, link, versions, organization } from 'octicons-vue'
export default [
  {
    path: '/',
    name: 'overview',
    component: () => import('./views/Overview.vue'),
    meta: { title: 'Overview', description: 'overview', icon: dashboard }
  },
  {
    path: '/malwares',
    name: 'malwares',
    component: () => import('./views/Malwares.vue'),
    meta: { title: 'Malwares', description: 'Malwares', icon: bug }

  },
  {
    path: '/engines',
    name: 'engines',
    component: () => import('./views/Engine.vue'),
    meta: { title: 'Engines', icon: link }

  },
  {
    path: '/users',
    name: 'users',
    component: () => import('./views/User.vue'),
    meta: { title: 'Users', icon: organization, group: 'Settings' }

  },
  {
    path: '/groups',
    name: 'groups',
    component: () => import('./views/Group.vue'),
    meta: { title: 'Groups', icon: versions, group: 'Settings' },
    children: [
      {
        path: ':groupID',
        name: 'group-details',
        component: () => import(/* webpackChunkName: "dashboards" */ './views/DetailGroup.vue'),
        meta: {
          title: 'Group Details',
          show: false,
          group: 'Settings'
        }
      },
      {
        path: ':groupID',
        name: 'group-update',
        component: () => import(/* webpackChunkName: "dashboards" */ './views/DetailGroup.vue'),
        meta: {
          title: 'Group Details',
          show: false,
          group: 'Settings'
        }
      }
    ]
  }
]
