const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '',
        component: () => import('pages/DashboardPage.vue') 
      },
      { 
        path: 'documentos',
        component: () => import('pages/DocumentosPage.vue') 
      },
      { 
        path: 'cadastros',
        component: () => import('pages/CadastrosPage.vue') 
      },

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
