import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const DASHBOARD: AppRouteRecordRaw = {
    path: '/type',
    name: 'type',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.type',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 10,
    },
    children: [
        {
            path: 'list',
            name: 'typeList',
            component: () => import('@/views/type/index.vue'),
            meta: {
                locale: 'menu.blog.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};
export default DASHBOARD;
