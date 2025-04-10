// src/stores/transactionStore.js
import { defineStore } from "pinia";
import { ref, reactive, watch } from "vue";
import api from "@/services/api";

export const useAnalysisStore = defineStore("analysis", () => {
  const period = ref(1);
  const periodStat = reactive({
    expense: 0,
    income: 0,
    topCategory: "데이터 없음",
    prevIncome: 0,
    prevExpense: 0,
    diffExpense: "",
    diffIncome: "",
    category: {},
  });

  const filters = reactive({
    curExpenseFilter: [],
    curIncomeFilter: [],
  });
  let userTransactions = reactive([]);

  const userId = localStorage.getItem("userId");
  const BASE_URI = "/transactions";

  const fetchUserTransactions = async () => {
    try {
      const response = await api.get(`${BASE_URI}?userId=${userId}`);
      if (response.status === 200) {
        userTransactions.value = response.data;
        updatePeriodStats();
      } else {
        alert("데이터 조회 실패");
      }
    } catch (e) {
      alert("에러 발생", e);
      console.log(e);
    }
  };

  function selectPeriod(months) {
    period.value = months;
    updatePeriodStats();
  }

  function updatePeriodStats() {
    const stats = getPeriodStats(period.value, userTransactions.value);
    Object.assign(periodStat, stats);
  }

  function getFiltered(transactions, type, prevDate, curDate) {
    return transactions.filter((t) => {
      const txDate = new Date(t.date);
      return t.type === type && txDate >= prevDate && txDate <= curDate;
    });
  }

  function getPeriodStats(period, transactions) {
    const now = new Date();
    const prevDate = new Date();
    const compareDate = new Date();
    prevDate.setMonth(now.getMonth() - period);
    compareDate.setMonth(prevDate.getMonth() - period);

    filters.curExpenseFilter = getFiltered(
      transactions,
      "expense",
      prevDate,
      now
    );
    filters.curIncomeFilter = getFiltered(
      transactions,
      "income",
      prevDate,
      now
    );

    const prevExpenseFilter = getFiltered(
      transactions,
      "expense",
      compareDate,
      prevDate
    );
    const prevIncomeFilter = getFiltered(
      transactions,
      "income",
      compareDate,
      prevDate
    );

    const currentIncome = filters.curIncomeFilter.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const currentExpense = filters.curExpenseFilter.reduce(
      (sum, t) => sum + t.amount,
      0
    );
    const prevIncome = prevIncomeFilter.reduce((sum, t) => sum + t.amount, 0);
    const prevExpense = prevExpenseFilter.reduce((sum, t) => sum + t.amount, 0);

    const diffExpense = getDiffRate(prevExpense, currentExpense);
    const diffIncome = getDiffRate(prevIncome, currentIncome);
    const { categoryMap, topCategory } = getTopCategory(
      filters.curExpenseFilter
    );

    return {
      expense: currentExpense,
      income: currentIncome,
      topCategory,
      category: categoryMap,
      prevExpense,
      prevIncome,
      diffExpense,
      diffIncome,
    };
  }

  function getTopCategory(expenses) {
    let total = 0;
    const categoryMap = {};
    expenses.forEach((t) => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
      total += t.amount;
    });

    let topCategory = "데이터 없음";
    let max = 0;
    for (const [category, amount] of Object.entries(categoryMap)) {
      if (amount > max) {
        max = amount;
        topCategory = category;
      }
    }

    return { categoryMap, topCategory };
  }

  function getDiffRate(prev, cur) {
    let diffRate;
    if (prev === 0) {
      if (cur === 0) {
        diffRate = 0;
      } else {
        return "--%";
      }
    } else {
      diffRate = ((cur - prev) / Math.abs(prev)) * 100;
    }
    return (diffRate > 0 ? "+" : "") + diffRate.toFixed(1) + "%";
  }

  // ⭐ period가 바뀌면 자동으로 stats 업데이트
  watch(period, () => {
    updatePeriodStats();
  });
  return {
    period,
    periodStat,
    filters,
    fetchUserTransactions,
    selectPeriod,
  };
});
