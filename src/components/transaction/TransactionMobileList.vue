<template>
  <div class="mb-5">
    <div class="card border shadow-sm rounded-4 p-3 bg-white">
      <div
        v-if="Object.keys(groupedByDate).length === 0"
        class="text-center text-secondary py-5"
      >
        거래 내역이 없습니다.
      </div>

      <div v-for="(items, date) in groupedByDate" :key="date" class="mb-4">
        <div class="fw-bold text-secondary small mb-3">
          {{ formatDate(date) }}
        </div>

        <div
          v-for="item in items"
          :key="item.id"
          class="d-flex mb-3 align-items-center position-relative"
        >
          <div class="me-3">
            <div
              class="category-circle rounded-circle bg-light d-flex justify-content-center align-items-center text-secondary"
            >
              {{ item.category }}
            </div>
          </div>

          <div class="flex-grow-1">
            <div class="fw-bold">{{ item.title }}</div>
            <div class="text-muted small">{{ item.memo }}</div>
          </div>

          <div class="fw-semibold text-end me-2">
            <span :class="item.amount > 0 ? 'text-primary' : 'text-danger'">
              {{ item.amount > 0 ? "+" : ""
              }}{{ item.amount.toLocaleString() }}원
            </span>
          </div>

          <!-- 드롭다운 메뉴 -->
          <div class="transaction-dropdown position-relative">
            <button
              class="btn btn-sm border-0 bg-transparent px-2"
              @click.stop="toggleDropdown(item.id)"
            >
              ⋮
            </button>

            <ul
              v-if="openDropdownId === item.id"
              class="dropdown-menu show position-absolute end-0 mt-1"
              style="display: block"
            >
              <li>
                <button class="dropdown-item" @click="onEdit(item)">
                  수정
                </button>
              </li>
              <li>
                <button
                  class="dropdown-item text-danger"
                  @click="onDelete(item)"
                >
                  삭제
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 수정 모달 -->
    <TransactionModal
      v-if="isModalOpen"
      :transaction="selectedTransaction"
      @close="isModalOpen = false"
      @updated="refreshTransactions"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import dayjs from "dayjs";
import { useTransactionStore } from "@/stores/transaction";
import { storeToRefs } from "pinia";
import TransactionModal from "@/components/modal/TransactionModal.vue";

const transactionStore = useTransactionStore();
const { transactions } = storeToRefs(transactionStore);

const openDropdownId = ref(null);
const selectedTransaction = ref(null);
const isModalOpen = ref(false);

const groupedByDate = computed(() => {
  const grouped = {};
  transactions.value.forEach((tx) => {
    const date = tx.date;
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(tx);
  });
  return grouped;
});

const formatDate = (dateStr) => {
  const date = dayjs(dateStr);
  return `${date.format("M월 D일")} ${
    ["일", "월", "화", "수", "목", "금", "토"][date.day()]
  }요일`;
};

const handleClickOutside = (e) => {
  if (!e.target.closest(".transaction-dropdown")) {
    openDropdownId.value = null;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const toggleDropdown = (id) => {
  openDropdownId.value = openDropdownId.value === id ? null : id;
};

const onEdit = (item) => {
  selectedTransaction.value = { ...item };
  isModalOpen.value = true;
};

const onDelete = (item) => {
  if (confirm("정말 삭제하시겠습니까?")) {
    transactionStore.deleteTransactionById(item.id);
  }
};

const refreshTransactions = async () => {
  await transactionStore.fetchTransactions();
};
</script>

<style scoped>
.category-circle {
  width: 36px;
  height: 36px;
  font-size: 0.6rem;
}
@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}
</style>
