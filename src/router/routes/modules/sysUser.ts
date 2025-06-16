import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
    path: '/sysUser',
    name: 'sysUser',
    component: DEFAULT_LAYOUT,
    meta: {
        locale: 'menu.system',
        requiresAuth: true,
        icon: 'icon-dashboard',
        order: 1,
    },
    children: [
        {
            path: 'sysUserList',
            name: 'sysUserList',
            component: () => import('@/views/sys/sysuser/index.vue'),
            meta: {
                locale: 'menu.sysUser.list',
                requiresAuth: true,
                roles: ['*'],
            },
        },

    ],
};

export default DASHBOARD;
