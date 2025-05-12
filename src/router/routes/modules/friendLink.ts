import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const DASHBOARD: AppRouteRecordRaw = {
    path: '/friendLink',
    name: 'friendLink',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.friendLink',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 10,
    },
    children: [
        {
            path: 'list',
            name: 'friendLinkList',
            component: () => import('@/views/friendLink/index.vue'),
            meta: {
                locale: 'menu.friendLink.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};
export default DASHBOARD;
