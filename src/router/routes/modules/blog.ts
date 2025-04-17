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
        order: 10,
    },
    children: [
        {
            path: 'bloglist',
            name: 'bloglist',
            component: () => import('@/views/blog/index.vue'),
            meta: {
                locale: 'menu.blog.bloglist',
                requiresAuth: true,
                roles: ['*'],
            },
        },
        {
            path: 'blogedit/:id?',
            name: 'blogedit',
            component: () => import('@/views/blog/add-or-update.vue'),
            meta: {
                locale: 'menu.blog.blogedit',
                requiresAuth: true,
                roles: ['*'],
            },

        },
    ],
};

export default DASHBOARD;
