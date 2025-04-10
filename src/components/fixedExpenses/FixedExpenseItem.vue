<template>
  <div class="d-flex justify-content-between align-items-center py-3 border-bottom position-relative">
    <!-- 좌측 아이콘/텍스트 -->
    <div class="d-flex align-items-center gap-3">
      <div :style="getBoxStyle(item.boxColor)" class="rounded-4 d-flex align-items-center justify-content-center me-3"
        style="width: 40px; height: 40px">
        <template v-if="item.icon && item.icon.class">
          <i :class="item.icon.class" :style="item.icon.style" class="fa-lg"></i>
        </template>
        <template v-else>
          <span :style="getDotStyle(item.dotColor)" class="rounded-circle"></span>
        </template>
      </div>

      <!-- 텍스트 -->
      <div>
        <div class="fw-semibold">{{ item.name }}</div>
        <div class="text-muted small">매월 {{ item.dueDate }}일</div>
      </div>
    </div>

    <!-- 우측 금액 + 메뉴 -->
    <div class="d-flex align-items-center gap-2 position-relative">
      <span class="fw-bold">{{ item.price.toLocaleString() }}원</span>

      <!-- 드롭다운 토글 -->
      <div class="dropdown-container" @click.stop="toggleMenu">
        <span style="cursor: pointer">⋮</span>

        <div v-show="showMenu" class="custom-dropdown">
          <div @click="editItem" class="dropdown-item">수정</div>
          <div @click="deleteItem" class="dropdown-item">삭제</div>
        </div>
      </div>
    </div>
  </div>
  <FixedExpenseAddModal v-model="isOpen" @added="handleAdded" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useFixedExpenseStore } from '@/stores/FixedExpenseStore';
import FixedExpenseAddModal from '../modal/FixedExpenseAddModal.vue';

const isOpen = ref(false);
const store = useFixedExpenseStore();

const handleAdded = () => {
  store.fetchExpenses(); // 새로고침해서 리스트 최신화
};

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};


const handleClickOutside = (e) => {
  if (!e.target.closest('.dropdown-container')) {
    showMenu.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const editItem = () => {
  store.openAddModal(props.item); //
  isOpen.value=true;
  console.log(props.item)  

};

const deleteItem = () => {
  if (confirm(`'${props.item.name}' 를(을) 삭제할까요?`)) {
    store.deleteExpense(props.item.id);
  }
  setTimeout(() => {
    showMenu.value = false;
  }, 0); // 다음 tick에서 닫히게 함
};

function getBoxStyle(color) {
  return {
    backgroundColor: color || '#fcecec',
  };
}

function getDotStyle(color) {
  return {
    width: '10px',
    height: '10px',
    backgroundColor: color || '#e74c3c',
  };
}
</script>

<style scoped>
.dropdown-container {
  position: relative;
}

.custom-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 6px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  min-width: 80px;
  z-index: 1000;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}
</style>
