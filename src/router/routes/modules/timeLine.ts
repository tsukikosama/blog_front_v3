import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const DASHBOARD: AppRouteRecordRaw = {
    path: '/timeLine',
    name: 'timeLine',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.timeLine',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 10,
    },
    children: [
        {
            path: 'list',
            name: 'timeLineList',
            component: () => import('@/views/timeLine/index.vue'),
            meta: {
                locale: 'menu.timeLine.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};
export default DASHBOARD;
