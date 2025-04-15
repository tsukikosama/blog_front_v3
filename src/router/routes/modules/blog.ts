import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/blog',
    name: 'blog',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.blog',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 4,
    },
    children: [
        {
            path: '/blogList',
            name: '/博客列表',
            component: () => import('@/views/blog/blog/index.vue'),
            meta: {
                locale: '博客列表',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};

export default DASHBOARD;
