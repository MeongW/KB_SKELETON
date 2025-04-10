<template>
  <nav
    class="navbar navbar-expand-lg bg-white shadow-sm px-4 py-2 navbar-container"
  >
    <div class="container-fluid">
      <router-link to="/home" class="navbar-brand">
        <img
          src="@/assets/images/logo.png"
          alt="KB가계부 로고"
          style="height: 36px"
        />
      </router-link>

      <button
        class="navbar-toggler"
        type="button"
        @click="isNavShow = !isNavShow"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div :class="['collapse navbar-collapse', { show: isNavShow }]">
        <ul class="navbar-nav ms-auto d-flex align-items-center gap-3">
          <li class="nav-item" v-for="item in navItems" :key="item.path">
            <router-link
              :to="item.path"
              class="nav-link-custom"
              :class="{ active: isActive(item.path) }"
              @click="isNavShow = false"
            >
              {{ item.label }}
            </router-link>
          </li>
          <li v-if="!isNavShow" class="nav-item ms-3">
            <img
              :src="userImage"
              alt="프로필"
              class="profile-image"
              @click="goToMypage"
            />
          </li>
          <li v-else class="nav-item">
            <router-link
              :to="'/mypage'"
              class="nav-link-custom"
              :class="{ active: isActive('/mypage') }"
              @click="isNavShow = false"
            >
              마이페이지
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";
import { storeToRefs } from "pinia";

const isNavShow = ref(false);
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const navItems = [
  { label: "홈", path: "/home" },
  { label: "내역", path: "/details" },
  { label: "고정지출", path: "/fixedExpenses" },
  { label: "통계", path: "/analysis" },
];

const isActive = (path) => route.path === path;

const user = storeToRefs(userStore).user;
const userImage = computed(() => {
  return user.value
    ? localStorage.getItem("userImage")
    : "https://velog.velcdn.com/images/chanmi125/post/18a3256c-dbaf-4f5e-952e-c694496e25ad/image.svg";
});

const goToMypage = () => {
  router.push("/mypage");
};

const handleClickOutside = (event) => {
  const clickedInside = event.target.closest(".navbar-container");
  if (isNavShow.value && !clickedInside) {
    isNavShow.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.nav-link-custom {
  font-weight: bolder;
  font-size: 0.95rem;
  color: #a892e9;
  text-decoration: none;
  transition: color 0.2s ease-in-out;
}

.nav-link-custom.active {
  color: #4318d1;
}

.nav-link-custom:hover {
  color: #7349e5;
}

.profile-image {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 50%;
  cursor: pointer;
  transition: box-shadow 0.2s ease;
  box-shadow: 0 0 0 2px #e0e0e0;
}

.profile-image:hover {
  box-shadow: 0 0 0 2px #4318d1;
}
</style>
