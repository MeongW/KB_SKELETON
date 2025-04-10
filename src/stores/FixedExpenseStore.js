// src/stores/fixedExpenseStore.js
import { defineStore } from "pinia";
import api from "@/services/api";
import { reactive, computed, ref } from "vue";

export const useFixedExpenseStore = defineStore("fixedExpense", () => {
  const BASEURI = "/subscriptions";

  const state = reactive({
    fixedExpenses: [],
    isLoading: false,
  });

  const colorPairs = [
    { boxColor: "#fcecec", dotColor: "#e74c3c" },
    { boxColor: "#f1f9fa", dotColor: "#52a8c9" },
    { boxColor: "#fff7ec", dotColor: "#f2992e" },
    { boxColor: "#f1f9f3", dotColor: "#64c364" },
  ];
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const fetchExpenses = async () => {
    state.isLoading = true;
    try {
      const res = await api.get(BASEURI, {
        params: { userId },
      });

      state.fixedExpenses = res.data;
    } catch (err) {
      alert("조회 실패: " + err);
    } finally {
      state.isLoading = false;
    }
  };

  const addExpense = async (expense, callback) => {
    try {
      const res = await api.post(BASEURI, expense);
      if (res.status === 201) {
        state.fixedExpenses.push(res.data);
        callback?.();
      }
    } catch (err) {
      alert("추가 실패: " + err);
    }
  };
  const updateExpense = async (id, updatedData, callback) => {
    try {
      const res = await api.put(`${BASEURI}/${id}`, updatedData);
      if (res.status === 200) {
        // 기존 리스트도 업데이트
        const index = state.fixedExpenses.findIndex((e) => e.id === id);
        if (index !== -1) {
          state.fixedExpenses[index] = res.data;
        }
        callback?.();
      }
    } catch (err) {
      alert("수정 실패: " + err);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await api.delete(`${BASEURI}/${id}`);
      const index = state.fixedExpenses.findIndex((e) => e.id === id);
      if (index !== -1) state.fixedExpenses.splice(index, 1);
    } catch (err) {
      alert("삭제 실패: " + err);
    }
  };

  const totalAmount = computed(() =>
    state.fixedExpenses.reduce((sum, e) => sum + Number(e.price || 0), 0)
  );

  const isAddModalOpen = ref(false);
  const selectedItem = ref(null); // 선택된 아이템 저장
  const openAddModal = (item = null) => {
    isAddModalOpen.value = true;
    selectedItem.value = item; // 아이템 젅달 받으면 설정..?
  };

  const closeAddModal = () => {
    isAddModalOpen.value = false;
    selectedItem.value = null;
  };

  return {
    fixedExpenses: computed(() => state.fixedExpenses),
    isLoading: computed(() => state.isLoading),
    colorPairs,
    fetchExpenses,
    addExpense,
    deleteExpense,
    totalAmount,
    isAddModalOpen,
    openAddModal,
    closeAddModal,
    updateExpense,
    selectedItem,
  };
});
