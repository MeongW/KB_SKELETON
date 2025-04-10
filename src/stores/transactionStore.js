import { defineStore } from "pinia";
import api from "@/services/api";
import dayjs from "dayjs";
import { constrainPoint } from "@fullcalendar/core/internal";

const BASE_URL = "";

export const useTransactionStore = defineStore("transaction", {
  state: () => ({
    transactions: [],
  }),

  getters: {
    currentMonthIncome: (state) => {
      const now = new Date();
      const currentMonth = dayjs(now).format("YYYY-MM"); // 'YYYY-MM'
      const filtered = state.transactions.filter((tx) => {
        const matched =
          tx.type === "income" && tx.date.startsWith(currentMonth);
        if (matched) return matched;
      });

      return filtered.reduce((sum, tx) => sum + tx.amount, 0);
    },

    // 이번 달 지출
    currentMonthExpense: (state) => {
      const now = new Date();
      const currentMonth = dayjs(now).format("YYYY-MM"); // 'YYYY-MM'

      return state.transactions
        .filter(
          (tx) => tx.type === "expense" && tx.date.startsWith(currentMonth)
        )
        .reduce((sum, tx) => sum + tx.amount, 0);
    },

    // 최근 거래 내역

    recentTransactions: (state) => {
      return [...state.transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 3);
    },
  },

  actions: {
    async fetchByUser(userId) {
      try {
        const res = await api.get(`${BASE_URL}/transactions?userId=${userId}`);
        this.transactions = res.data;
      } catch (err) {
        console.error("거래내역 로드 실패:", err);
      }
    },

    async addTransaction(transaction) {
      try {
        const res = await api.post(`${BASE_URL}/transactions`, transaction);
        this.transactions.push(res.data); // 응답 데이터를 반영 (반응성 유지)
      } catch (err) {
        console.error("거래내역 저장 실패:", err);
      }
    },
  },
});
