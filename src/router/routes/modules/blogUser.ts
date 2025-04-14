import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/blogUser',
  name: 'blogUser',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.blogUser',
    requiresAuth: true,
    icon: 'icon-dashboard',
    order: 3,
  },
  children: [
    {
      path: '/list',
      name: '/博客用户列表',
      component: () => import('@/views/blog/user/index.vue'),
      meta: {
        locale: '博客用户列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
