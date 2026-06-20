import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/login',
        name: 'login',
        meta: { requiresAuth: false, requiresSubscription: false },
        component: () => import('../contexts/iam/auth/presentation/views/LoginView.vue')
    },
    {
        path: '/register',
        name: 'register',
        meta: { requiresAuth: false, requiresSubscription: false },
        component: () => import('../contexts/iam/auth/presentation/views/RegisterView.vue')
    },
    {
        path: '/plan-selection',
        name: 'plan-selection',
        meta: { requiresAuth: true, requiresSubscription: false },
        component: () => import('../contexts/iam/auth/presentation/views/PlanSelectionView.vue')
    },
    {
        path: '/checkout',
        name: 'checkout',
        meta: { requiresAuth: true, requiresSubscription: false },
        component: () => import('../subscriptions-payment-management/presentation/views/SubscriptionCheckoutView.vue')
    },
    {
        path: '/subscription-confirmation',
        name: 'subscription-confirmation',
        meta: { requiresAuth: true, requiresSubscription: false },
        component: () => import('../subscriptions-payment-management/presentation/views/SubscriptionConfirmationView.vue')
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/service-monitoring/dashboard/presentation/views/DashboardView.vue')
    },
    {
        path: '/buildings',
        name: 'buildings',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/asset-management/properties/presentation/views/BuildingsView.vue')
    },
    {
        path: '/buildings/new',
        name: 'property-registration',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/asset-management/properties/presentation/views/PropertyRegistrationView.vue')
    },
    {
        path: '/buildings/:propertyCode',
        name: 'property-edit',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/asset-management/properties/presentation/views/PropertyEditView.vue'),
        props: true
    },
    {
        path: '/alerts',
        name: 'alerts',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/service-monitoring/alerts/presentation/views/AlertsCenterView.vue')
    },
    {
        path: '/alerts/:alertId/investigate',
        name: 'alert-investigate',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/service-monitoring/alerts/presentation/views/AlertInvestigateView.vue'),
        props: true
    },
    {
        path: '/reports',
        name: 'reports',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../features/analytics/reports/presentation/views/ReportsView.vue')
    },
    {
        path: '/devices',
        name: 'devices',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/asset-management/devices/presentation/views/DevicesView.vue')
    },
    {
        path: '/devices/new',
        name: 'device-registration',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/asset-management/devices/presentation/views/DeviceRegistrationView.vue')
    },
    {
        path: '/devices/:deviceId',
        name: 'device-details',
        meta: { requiresAuth: true, requiresSubscription: true },
        component: () => import('../contexts/asset-management/devices/presentation/views/DeviceDetailsView.vue'),
        props: true
    },
    {
        path: '/subscription',
        name: 'subscription',
        meta: {
            requiresAuth: true,
            requiresSubscription: true,
            title: 'Subscription Management',
            searchPlaceholder: 'Search invoices, plans, or payment methods...',
            actionLabel: 'Add Payment Method',
            actionIcon: 'credit-card'
        },
        component: () => import('../subscriptions-payment-management/presentation/views/SubscriptionPaymentManagementView.vue')
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

router.beforeEach((to, from) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token;

    if (to.meta.requiresAuth && !isAuthenticated) {
        return { name: 'login' };
    }

    if (to.meta.requiresSubscription && isAuthenticated) {
        const subscription = JSON.parse(localStorage.getItem('subscription') || 'null');
        if (!subscription || subscription.status !== 'Active') {
            if (subscription && subscription.status === 'Suspended') {
                return { name: 'login' };
            }
            return { name: 'plan-selection' };
        }
    }
});

export default router;
