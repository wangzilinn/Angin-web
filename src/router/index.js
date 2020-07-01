import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/dashboardviews/layout'
import SiteLayout from '@/siteviews/Layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/user',
    component: () => import('@/dashboardviews/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/dashboardviews/404'),
    hidden: true
  },

  {
    path: '/admin/dashboard',
    component: Layout,
    children: [{
      path: '',
      component: () => import('@/dashboardviews/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/dashboardviews/profile/index'),
        name: 'Profile',
        meta: { title: 'Profile', icon: 'user', noCache: true }
      }
    ]
  },

  {
    path: '/admin/article',
    component: Layout,
    name: '文章管理',
    meta: {
      title: '文章管理',
      icon: 'editor'
    },
    children: [
      {
        path: 'add',
        component: () => import('@/dashboardviews/article/edit'),
        name: '撰写文章',
        meta: {title: '撰写文章', icon: 'edit'}
      },
      {
        path: 'edit/:id',
        component: () => import('@/dashboardviews/article/edit'),
        name: '文章编辑',
        meta: {title: '文章编辑', noCache: true},
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/dashboardviews/article/index'),
        name: '文章列表',
        meta: {title: '文章列表', icon: 'list'}
      }
    ]
  },

  {
    path: '/admin',
    component: Layout,
    name: '博客管理',
    meta: {
      title: '博客管理',
      icon: 'menu'
    },
    children: [
      {
        path: 'category',
        component: () => import('@/dashboardviews/category/index'),
        name: '分类管理',
        meta: {title: '分类管理', icon: 'list'}
      },
      {
        path: 'tag',
        component: () => import('@/dashboardviews/tag/index'),
        name: '标签管理',
        meta: {title: '标签管理', icon: 'tags'}
      },
      {
        path: 'comment',
        component: () => import('@/dashboardviews/comment/index'),
        name: '评论管理',
        meta: {title: '评论管理', icon: 'message'}
      }
    ]
  },

  {
    path: '/admin/sys',
    component: Layout,
    name: '系统管理',
    meta: {
      title: '系统管理',
      icon: 'system'
    },
    children: [
      {
        path: 'log',
        component: () => import('@/dashboardviews/log/index'),
        name: '操作日志',
        meta: {title: '操作日志', icon: 'bug'}
      },
      {
        path: 'qiniu',
        component: () => import('@/dashboardviews/qiniu/index'),
        name: '对象储存',
        meta: {title: '对象储存', icon: 'cloud'}
      }
    ]
  },

  {
    path: '/swagger',
    component: Layout,
    redirect: '/api/human',
    children: [{
      path: 'api',
      name: 'Api文档',
      component: () => import('@/dashboardviews/swagger/index'),
      meta: { title: 'Api文档', icon: 'api' }
    }]
  },

  {
    path: 'github',
    component: Layout,
    children: [
      {
        path: 'https://github.com/TyCoding',
        meta: { title: 'Github', icon: 'link' }
      }
    ]
  },

  //--------博客前台路由-----------

  {
    path: '/',
    component: SiteLayout,
    children: [{
      path: '',
      component: () => import('@/siteviews/index/index'),
    }]
  },

  {
    path: '/page/:page',
    component: SiteLayout,
    children: [{
      path: '',
      component: () => import('@/siteviews/index/index'),
    }]
  },

  {
    path: '/article/:id',
    component: SiteLayout,
    children: [{
      path: '',
      component: () => import('@/siteviews/article/index'),
    }]
  },

  {
    path: '/archives',
    component: SiteLayout,
    children: [{
      path: '',
      component: () => import('@/siteviews/archives/index'),
    }]
  },

  {
    path: '/links',
    component: SiteLayout,
    children: [{
      path: '',
      component: () => import('@/siteviews/links/index'),
    }]
  },

  {
    path: '/about',
    component: SiteLayout,
    children: [{
      path: '',
      component: () => import('@/siteviews/about/index'),
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
