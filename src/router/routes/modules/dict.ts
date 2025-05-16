import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const DASHBOARD: AppRouteRecordRaw = {
    path: '/code',
    name: 'dict',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.dict',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 10,
    },
    children: [
        {
            path: 'list',
            name: 'dictList',
            component: () => import('@/views/code/index.vue'),
            meta: {
                locale: 'menu.dict.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};
export default DASHBOARD;
