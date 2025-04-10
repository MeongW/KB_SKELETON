import Analysis from "@/pages/Analysis.vue";
import Details from "@/pages/Details.vue";
import FixedExpenses from "@/pages/FixedExpenses.vue";
import Home from "@/pages/Home.vue";
import Mypage from "@/pages/Mypage.vue";
import Login from "@/pages/Login.vue";
import Signup from "@/pages/Signup.vue";
import NotFound from "@/pages/NotFound.vue"; // 404 페이지 컴포넌트

import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory('/kb-skeleton/'),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup,
    },
    {
      path: "/home",
      name: "home",
      component: Home,
    },
    {
      path: "/details",
      name: "details",
      component: Details,
    },
    {
      path: "/fixedExpenses",
      name: "fixedExpenses",
      component: FixedExpenses,
    },
    {
      path: "/analysis",
      name: "analysis",
      component: Analysis,
    },
    {
      path: "/mypage",
      name: "mypage",
      component: Mypage,
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound",
      component: NotFound,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ["/", "/signup"];
  const authRequired = !publicPages.includes(to.path);
  const userId = localStorage.getItem("userId");

  if (authRequired && !userId) {
    next("/");
  } else {
    next();
  }
});

export default router;
