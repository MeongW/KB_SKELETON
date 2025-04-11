<template>
  <ChartSkeleton v-if="isLoading" />
  <div v-else class="card border p-4 rounded-4 shadow-sm bg-white h-100">
    <h5 class="fw-semibold mb-4">기간별 비교</h5>

    <div v-if="isEmpty" class="text-muted text-center my-5">
      최근 5{{ viewMode.value === "월간" ? "개월간" : viewMode.value }}
      거래내역이 없습니다.
    </div>
    <div v-else class="position-relative h-100">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

import { useTransactionStore } from "@/stores/transaction";
import { storeToRefs } from "pinia";
import { fetchTransactionsByDateRangeAPI } from "@/services/transactionAPI";
import ChartSkeleton from "../skeleton/ChartSkeleton.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const chartData = ref({ labels: [], datasets: [] });
const isEmpty = ref(false);
const isLoading = ref(true);

const transactionStore = useTransactionStore();
const { viewDate, viewMode, chartRefreshKey } = storeToRefs(transactionStore);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  aspectRatio: 3,
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { display: false },
      ticks: {
        maxTicksLimit: 3,
        callback: function (value) {
          if (value >= 100000000)
            return (
              (value / 100000000).toFixed(value % 100000000 === 0 ? 0 : 1) +
              "억"
            );
          else if (value >= 10000)
            return (value / 10000).toFixed(value % 10000 === 0 ? 0 : 1) + "만";
          else if (value >= 1000)
            return (value / 1000).toFixed(value % 1000 === 0 ? 0 : 1) + "천";
          else if (value >= 100)
            return (value / 100).toFixed(value % 100 === 0 ? 0 : 1) + "백";
          else return value.toLocaleString("ko-KR");
        },
      },
    },
  },
  plugins: {
    legend: {
      position: "bottom",
      labels: { boxWidth: 12, padding: 16 },
    },
  },
};

const loadChartData = async () => {
  isLoading.value = true;
  const labels = [];
  const incomeData = [];
  const expenseData = [];

  const unit =
    viewMode.value === "일간"
      ? "day"
      : viewMode.value === "주간"
      ? "week"
      : "month";
  const base = dayjs(viewDate.value).startOf(unit);

  const oldest = base.subtract(4, unit);
  const startDate = oldest.startOf(unit).format("YYYY-MM-DD");
  const endDate = base.endOf(unit).format("YYYY-MM-DD");

  try {
    const { data } = await fetchTransactionsByDateRangeAPI({
      userId: localStorage.getItem("userId"),
      startDate,
      endDate,
      page: 1,
      limit: 10000,
    });

    for (let i = 0; i < 5; i++) {
      const current = base.subtract(4 - i, unit);
      const start = current.startOf(unit);
      const end = current.endOf(unit);

      const label =
        unit === "day"
          ? current.format("M/D")
          : unit === "week"
          ? `${start.format("M/D")} ~ ${end.format("M/D")}`
          : current.format("M월");

      labels.push(label);

      const filtered = data.filter((tx) => {
        const d = dayjs(tx.date);
        return d.isSameOrAfter(start) && d.isSameOrBefore(end);
      });

      const income = filtered
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = filtered
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      incomeData.push(income);
      expenseData.push(expense);
    }

    chartData.value = {
      labels,
      datasets: [
        {
          label: "수입",
          backgroundColor: "#3B82F6",
          borderRadius: 8,
          data: incomeData,
          barThickness: 10,
          categoryPercentage: 0.6,
          barPercentage: 0.8,
        },
        {
          label: "지출",
          backgroundColor: "#EF4444",
          borderRadius: 8,
          data: expenseData,
          barThickness: 10,
          categoryPercentage: 0.6,
          barPercentage: 0.8,
        },
      ],
    };

    isEmpty.value =
      incomeData.every((v) => v === 0) && expenseData.every((v) => v === 0);
  } catch (err) {
    console.error("차트 데이터 로딩 실패", err);
    isEmpty.value = true;
  }
  isLoading.value = false;
};

watch([viewDate, viewMode, chartRefreshKey], loadChartData, {
  immediate: true,
});
</script>

<style scoped>
.card {
  height: 300px;
}

@media screen and (max-width: 1200px) {
  .card {
    height: 300px !important;
  }
}
</style>
