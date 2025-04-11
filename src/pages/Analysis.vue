<template>
  <div class="container py-4">
    <!-- 기간 선택 -->
    <selectPeriod />

    <!-- 요약 및 점수 -->
    <div class="row g-4">
      <!-- 수입 지출 카드 -->
      <div class="col-12 col-md-8">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title text-muted">수입 지출 통계</h5>

            <!-- 총 수입, 지출 등 -->
            <div class="row">
              <analysisCard
                :diffData="store.periodStat.diffIncome"
                :data="store.periodStat.income"
                :prevData="store.periodStat.prevIncome"
                :title="'수입'"
              />

              <analysisCard
                :diffData="store.periodStat.diffExpense"
                :data="store.periodStat.expense"
                :prevData="store.periodStat.prevExpense"
                :title="'지출'"
              />

              <div class="col-12 col-md-3 mb-3">
                <small class="text-muted">합계</small>
                <div
                  class="h5"
                  :class="
                    store.periodStat.income - store.periodStat.expense > 0
                      ? 'text-success'
                      : 'text-danger'
                  "
                >
                  <AnimatedNumber
                    :value="store.periodStat.income - store.periodStat.expense"
                  />원
                </div>
              </div>

              <div class="col-12 col-md-3">
                <small class="text-muted">최다 지출 카테고리</small>
                <div class="h5">
                  {{ store.periodStat.topCategory || '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 소비 점수 -->
      <scoreCircle :expense="periodStat.expense" :income="periodStat.income" />
    </div>

    <!-- 차트 -->
    <div class="row mt-4 g-4">
      <div class="col-12 col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h6 class="card-title">카테고리별 지출</h6>
            <canvas ref="categoryChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-8">
        <div class="card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="card-title mb-0">기간별 통계 차트</h6>
              <span class="text-muted" id="chart-period-label"
                >데이터 없음</span
              >
            </div>
            <canvas ref="weeklyChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useAnalysisStore } from '@/stores/analysisStore';
import { renderCategoryChart, renderWeeklyChart } from '@/services/useChart.js';
import AnimatedNumber from '@/components/AnimatedNumber.vue';
import selectPeriod from '@/components/analysis/selectPeriod.vue';
import analysisCard from '@/components/analysis/analysisCard.vue';
import scoreCircle from '@/components/analysis/scoreCircle.vue';

const categoryChart = ref(null);
const weeklyChart = ref(null);

// ✅ Pinia 스토어 가져오기
const store = useAnalysisStore();
const { periodStat, filters } = store;

onMounted(async () => {
  await store.fetchUserTransactions();
  store.period = 1;
  renderCategoryChart(categoryChart.value, periodStat);

  renderWeeklyChart(
    weeklyChart.value,
    filters.curIncomeFilter,
    filters.curExpenseFilter,
    store.period
  );
});
watch(
  () => store.period,
  () => {
    if (categoryChart.value) {
      renderCategoryChart(categoryChart.value, store.periodStat);
    }
    if (weeklyChart.value) {
      renderWeeklyChart(
        weeklyChart.value,
        filters.curIncomeFilter,
        filters.curExpenseFilter,
        store.period
      );
    }
  }
);
</script>

<style scoped>
canvas {
  width: 100% !important;
  height: 400px !important;
}
</style>
