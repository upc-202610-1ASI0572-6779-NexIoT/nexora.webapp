import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../features/auth/views/LoginView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../features/landlord-dashboard/views/DashboardView.vue')
    },
    {
        path: '/buildings',
        name: 'buildings',
        component: () => import('../features/property-buildings/views/BuildingsView.vue')
    },
    {
        path: '/alerts',
        name: 'alerts',
        component: () => import('../features/alerts-management/views/AlertsCenterView.vue')
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