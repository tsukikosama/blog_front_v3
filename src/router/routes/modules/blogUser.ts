import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/bloguser',
  name: 'blogUser',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.blogUser',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 11,
  },
  children: [
    {
      path: 'userlist',
      name: 'userlist',
      component: () => import('@/views/blogUser/index.vue'),
      meta: {
        locale: 'menu.blogUser.list',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
