import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const whiteList = ["/"];
  const isLogin = localStorage.getItem("token");
  if (whiteList.includes(to.path)) {
    next();
    return;
  }

  if (!isLogin) {
    next(`/`);
    return;
  }

  next();
});

export default router;
