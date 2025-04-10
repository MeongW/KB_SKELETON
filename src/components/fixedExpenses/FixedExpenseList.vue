<template>
  <div class="card shadow-sm p-4">
    <!-- 상단 필터 탭 -->
    <div class="category-tabs mb-4 position-relative">
      <div
        class="tab"
        :class="{ selected: activeCategory === '구독' }"
        @click="activeCategory = '구독'"
      >
        구독
      </div>
      <div
        class="tab"
        :class="{ selected: activeCategory === '고정지출' }"
        @click="activeCategory = '고정지출'"
      >
        고정지출
      </div>

      <!-- 움직이는 세로 막대 -->
      <div
        class="vertical-bar"
        :style="{
          left: activeCategory === '구독' ? '0%' : '50%',
        }"
      />
    </div>

    <!-- 필터링된 리스트 -->
    <FixedExpenseItem v-for="s in filtered" :key="s.id" :item="s" />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FixedExpenseItem from "./FixedExpenseItem.vue";
import { useFixedExpenseStore } from "@/stores/FixedExpenseStore";

const store = useFixedExpenseStore();
const activeCategory = ref("구독");

const filtered = computed(() =>
  store.fixedExpenses.filter((item) => {
    let randomPair =
      store.colorPairs[Math.floor(Math.random() * store.colorPairs.length)];
    item.boxColor = randomPair.boxColor;
    item.dotColor = randomPair.dotColor;
    return item.category === activeCategory.value; // 필터 조건
  })
);
</script>

<style scoped>
.category-tabs {
  display: flex;
  position: relative;
  height: 48px;
  border-bottom: 2px solid #eee;
  margin-bottom: 16px;
}

.tab {
  flex: 1;
  text-align: center;
  line-height: 48px;
  cursor: pointer;
  position: relative;
  font-weight: 500;
  color: #666;
  transition: color 0.3s;
}

.tab.selected {
  color: #5e3bee;
  font-weight: 700;
}

.vertical-bar {
  position: absolute;
  bottom: 0;
  width: 50%;
  height: 3px;
  background-color: #5e3bee;
  transition: left 0.3s ease;
  border-radius: 2px;
}
</style>
