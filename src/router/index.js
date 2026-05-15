import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../iam/auth/presentation/views/LoginView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../service-monitoring/dashboard/presentation/views/DashboardView.vue')
    },
    {
        path: '/buildings',
        name: 'buildings',
        component: () => import('../asset-management/properties/presentation/views/BuildingsView.vue')
    },
    {
        path: '/alerts',
        name: 'alerts',
        component: () => import('../service-monitoring/alerts/presentation/views/AlertsCenterView.vue')
    },
    {
        path: '/devices',
        name: 'devices',
        component: () => import('../asset-management/devices/presentation/views/DevicesView.vue')
    },
    {
        path: '/devices/:deviceId',
        name: 'device-details',
        component: () => import('../asset-management/devices/presentation/views/DeviceDetailsView.vue'),
        props: true
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../iam/settings/presentation/views/SettingsView.vue')
    },
    {
        path: '/subscription',
        name: 'subscription',
        component: () => import('../subscriptions-payment-management/presentation/views/SubscriptionPaymentManagementView.vue'),
        meta: {
            title: 'Subscription Management',
            searchPlaceholder: 'Search invoices, plans, or payment methods...',
            actionLabel: 'Add Payment Method',
            actionIcon: 'credit-card'
        }
    },
    {
        path: '/',
        redirect: '/login'
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
