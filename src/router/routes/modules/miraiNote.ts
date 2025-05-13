import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';


const DASHBOARD: AppRouteRecordRaw = {
    path: '/miraiNote',
    name: 'miraiNote',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.miraiNote',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 10,
    },
    children: [
        {
            path: 'list',
            name: 'miraiNoteList',
            component: () => import('@/views/miraiNote/index.vue'),
            meta: {
                locale: 'menu.miraiNote.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },
    ],
};
export default DASHBOARD;
