const routes = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/HomePage.vue'), 
        meta: { requiresAuth: true }
      },
      { path: 'sign-in', component: () => import('@/pages/SigninPage.vue') },
      { path: 'sign-up', component: () => import('@/pages/SignupPage.vue') },
      { path: 'settings', component: () => import('@/pages/SettingPage.vue'),
        meta: { requiresAuth: true }
      },
      { path: 'premium', component: () => import('@/pages/PremiumPage.vue'),
        meta: { requiresAuth: true, roles: ['premium'] }
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
]

export default routes
