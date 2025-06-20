import { createRouter, createWebHistory } from 'vue-router'
import store from '../../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { requiresGuest: true } // 仅允许未登录用户访问
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../views/MainView.vue'),
    meta: { requiresAuth: true } // 需要登录
  },
  // 新增：TeamDetail 路由规则
  {
    path: '/team/:tid',
    name: 'TeamDetail',
    component: () => import('../views/TeamDetail.vue'),
    props: true // 将动态参数 tid 自动传递给组件
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 统一的路由守卫
router.beforeEach((to, from, next) => {
  const user = store.state.user;
  const isAuthenticated = user.isLoggedIn;

  // 已登录但访问登录/注册页
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/main'); // 或 '/'
    return;
  }

  // 需要登录但未登录
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } });
    return;
  }

  next();
});

export default router