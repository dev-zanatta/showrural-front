const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '',
        name: 'DashboardPage',
        meta: { title: 'Licenças monitoradas' },
        component: () => import('pages/DashboardPage.vue') 
      },
      { 
        path: 'documentos',
        name: 'DocumentosPage',
        meta: { title: 'Licenças' },
        component: () => import('pages/DocumentosPage.vue') 
      },
      { 
        path: 'cadastros',
        name: 'CadastrosPage',
        meta: { title: 'Modalidades' },
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
