import { defineStore } from "pinia";
import { ref, watch } from "vue";
import dayjs from "dayjs";
import {
  fetchTransactionsByDateRange,
  deleteTransaction,
} from "@/services/transactionAPI";

export const useTransactionStore = defineStore("transactions", () => {
  const viewDate = ref(dayjs());
  const viewMode = ref("월간");

  const transactions = ref([]);
  const isLoading = ref(false);

  const setViewDate = (date) => {
    viewDate.value = dayjs(date);
  };

  const setViewMode = (mode) => {
    viewMode.value = mode;
  };

  const fetchTransactions = async () => {
    const userId = "1";

    const base = viewDate.value;
    let start, end;

    if (viewMode.value === "일간") {
      start = base.startOf("day");
      end = base.endOf("day");
    } else if (viewMode.value === "주간") {
      start = base.startOf("week");
      end = base.endOf("week");
    } else {
      start = base.startOf("month");
      end = base.endOf("month");
    }

    isLoading.value = true;

    try {
      const { data } = await fetchTransactionsByDateRange({
        userId,
        startDate: start.format("YYYY-MM-DD"),
        endDate: end.format("YYYY-MM-DD"),
        page: 1,
        limit: 10000,
      });
      transactions.value = data;
    } catch (err) {
      console.error("거래 내역 로딩 실패", err);
    }

    isLoading.value = false;
  };

  const deleteTransactionById = async (id) => {
    try {
      await deleteTransaction(id);
      transactions.value = transactions.value.filter((tx) => tx.id !== id);
    } catch (err) {
      console.error("삭제 실패", err);
    }
  };

  watch([viewDate, viewMode], fetchTransactions, { immediate: true });

  return {
    viewDate,
    viewMode,
    setViewDate,
    setViewMode,
    transactions,
    isLoading,
    fetchTransactions,
    deleteTransactionById,
  };
});
