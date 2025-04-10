<template>
  <div
    class="toast-container p-3"
    :class="isMobile ? 'bottom-toast' : 'top-0 end-0 position-fixed'"
    v-if="showToast"
    style="z-index: 1055"
  >
    <div
      class="toast show text-white bg-primary border-0 w-100"
      :class="{ 'mobile-toast': isMobile }"
    >
      <div class="px-3 py-2">
        <div class="toast-body p-0">
          다가오는 고정 지출이 {{ upcomingCount }}건 있습니다.
        </div>
        <div v-if="isMobile" class="text-end mt-1">
          <a
            href="#"
            class="text-white text-decoration-underline small"
            @click.prevent="goToFixed"
          >
            자세히 보기
          </a>
        </div>
        <div v-else class="mt-1">
          <a
            href="#"
            class="text-white text-decoration-underline small"
            @click.prevent="goToFixed"
          >
            자세히 보기
          </a>
        </div>
      </div>
      <button
        type="button"
        class="btn-close btn-close-white position-absolute top-0 end-0 m-2"
        @click="showToast = false"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import api from "@/services";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useRouter } from "vue-router";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const showToast = ref(false);
const upcomingCount = ref(0);
const isMobile = ref(window.innerWidth < 768);
const router = useRouter();

const goToFixed = () => {
  router.push("/fixedExpenses");
};

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(async () => {
  window.addEventListener("resize", handleResize);

  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const { data } = await api.get("/subscriptions", {
      params: { userId },
    });

    const today = dayjs();
    const inThreeDays = today.add(3, "day");

    const count = data.filter((item) => {
      const dueDay = item.dueDate;
      const currentMonth = today.month() + 1;
      let dueDate = dayjs(
        `${today.year()}-${currentMonth}-${dueDay}`,
        "YYYY-M-D"
      );

      if (!dueDate.isValid()) return false;

      if (dueDate.isBefore(today, "day")) {
        const nextMonth = today.add(1, "month");
        dueDate = dayjs(
          `${nextMonth.year()}-${nextMonth.month() + 1}-${dueDay}`,
          "YYYY-M-D"
        );
        if (!dueDate.isValid()) return false;
      }

      return (
        dueDate.isSameOrAfter(today, "day") &&
        dueDate.isSameOrBefore(inThreeDays, "day")
      );
    }).length;

    if (count > 0) {
      upcomingCount.value = count;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 5000);
    }

    localStorage.setItem("seenFixedToast", true);
  } catch (err) {
    console.error("구독 데이터 확인 실패:", err);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.bottom-toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px);
  max-width: 460px;
}

.toast-body {
  font-size: 0.9rem;
}

a {
  font-weight: 500;
}
</style>
