<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ isEditMode ? '거래내역 수정' : '거래내역 추가' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <div class="modal-body">
          <div class="btn-group mb-3 w-100" role="group">
            <button
              type="button"
              class="btn"
              :class="type === '지출' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setType('지출')"
            >
              지출
            </button>
            <button
              type="button"
              class="btn"
              :class="type === '수입' ? 'btn-primary' : 'btn-outline-primary'"
              @click="setType('수입')"
            >
              수입
            </button>
          </div>

          <div class="mb-3 position-relative">
            <label class="form-label small text-muted">날짜</label>
            <input
              type="date"
              v-model="date"
              :class="[
                'form-control',
                { shake: invalidFields.includes('date') },
              ]"
            />
            <div v-if="tooltips.date" class="tooltip-message">
              {{ tooltips.date }}
            </div>
          </div>

          <div class="mb-3 position-relative">
            <label class="form-label small text-muted">금액</label>
            <input
              type="text"
              v-model="formattedAmount"
              :class="[
                'form-control amount-input pe-5',
                { shake: invalidFields.includes('amount') },
              ]"
              placeholder="금액을 입력하세요"
            />
            <div v-if="tooltips.amount" class="tooltip-message">
              {{ tooltips.amount }}
            </div>
          </div>

          <div class="amount-button-group mb-3">
            <button
              v-for="unit in [1000, 10000, 50000, 100000, 1000000]"
              :key="unit"
              type="button"
              class="btn custom-amount-btn"
              @click="addAmount(unit)"
            >
              +{{ unit.toLocaleString() }}
            </button>
          </div>

          <div class="mb-3 position-relative">
            <label class="form-label small text-muted">카테고리</label>
            <select
              v-model="category"
              :class="[
                'form-select',
                { shake: invalidFields.includes('category') },
              ]"
            >
              <option value="카테고리" disabled>카테고리</option>
              <option
                v-for="(item, index) in currentCategoryList"
                :key="index"
                :value="item"
              >
                {{ item }}
              </option>
            </select>
            <div v-if="tooltips.category" class="tooltip-message">
              {{ tooltips.category }}
            </div>
          </div>

          <div class="mb-3 position-relative">
            <label class="form-label small text-muted">제목</label>
            <input
              type="text"
              v-model="title"
              :class="[
                'form-control',
                { shake: invalidFields.includes('title') },
              ]"
              placeholder="제목을 입력하세요"
            />
            <div v-if="tooltips.title" class="tooltip-message">
              {{ tooltips.title }}
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label small text-muted">메모</label>
            <input
              type="text"
              v-model="memo"
              class="form-control"
              placeholder="메모를 입력하세요"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            취소
          </button>
          <button type="button" class="btn btn-primary" @click="save">
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { useTransactionStore as useAllStore } from '@/stores/transactionStore';
import { useTransactionStore as useFilteredStore } from '@/stores/transaction';
import { useUserStore } from '@/stores/userStore';

const route = useRoute();
const transactionStore = useAllStore();
const filteredStore = useFilteredStore();
const userStore = useUserStore();

const emit = defineEmits(['close', 'updated']);
const props = defineProps({ transaction: Object });

const isEditMode = ref(false);
const id = ref(null);
const type = ref('지출');
const date = ref('');
const amount = ref('');
const category = ref('카테고리');
const title = ref('');
const memo = ref('');

const invalidFields = ref([]);
const tooltips = ref({});

const markInvalid = (field, message) => {
  if (!invalidFields.value.includes(field)) {
    invalidFields.value.push(field);
    tooltips.value[field] = message;
    nextTick(() => {
      setTimeout(() => {
        const idx = invalidFields.value.indexOf(field);
        if (idx !== -1) invalidFields.value.splice(idx, 1);
        delete tooltips.value[field];
      }, 1500);
    });
  }
};

const formattedAmount = computed({
  get() {
    if (!amount.value) return '';
    return Number(amount.value).toLocaleString() + '원';
  },
  set(val) {
    const raw = val.replace(/[^\d]/g, '');
    amount.value = raw ? Number(raw) : '';
  },
});

const addAmount = (unit) => {
  const current = Number(amount.value) || 0;
  amount.value = current + unit;
};

const expenseCategories = [
  '식비',
  '교통비',
  '주거비',
  '문화',
  '의료비',
  '기타',
];
const incomeCategories = ['급여', '용돈', '판매수익', '이자소득', '기타'];
const currentCategoryList = computed(() =>
  type.value === '지출' ? expenseCategories : incomeCategories
);

const setType = (newType) => {
  type.value = newType;
  category.value = '카테고리';
};

const resetForm = () => {
  id.value = null;
  type.value = '지출';
  date.value = '';
  amount.value = '';
  category.value = '카테고리';
  title.value = '';
  memo.value = '';
};

watch(
  () => props.transaction,
  (tx) => {
    if (tx) {
      isEditMode.value = true;
      id.value = tx.id;
      type.value = tx.type === 'income' ? '수입' : '지출';
      date.value = tx.date;
      amount.value = tx.amount;
      category.value = tx.category;
      title.value = tx.title;
      memo.value = tx.memo;
    } else {
      isEditMode.value = false;
      resetForm();
    }
  },
  { immediate: true }
);

const save = async () => {
  let hasError = false;

  if (!date.value) {
    markInvalid('date', '날짜를 입력하세요');
    hasError = true;
  }
  if (!amount.value) {
    markInvalid('amount', '금액을 입력하세요');
    hasError = true;
  }
  if (category.value === '카테고리') {
    markInvalid('category', '카테고리를 선택하세요');
    hasError = true;
  }
  if (!title.value) {
    markInvalid('title', '제목을 입력하세요');
    hasError = true;
  }

  if (hasError) return;

  const userId = localStorage.getItem('userId') || userStore.userId;
  const transactionData = {
    type: type.value === '수입' ? 'income' : 'expense',
    date: date.value,
    amount: Number(amount.value),
    category: category.value,
    title: title.value,
    memo: memo.value,
    userId,
  };

  if (isEditMode.value) {
    await filteredStore.updateTransactionById(id.value, transactionData);
  } else {
    if (route.path === '/home') {
      console.log('home');
      await transactionStore.addTransaction(transactionData);
    } else {
      console.log('detail');

      await filteredStore.addTransaction(transactionData);
    }
  }

  emit('updated');
  emit('close');
};
</script>

<style scoped>
.amount-input {
  font-family: var(--bs-body-font-family);
  font-size: 1rem;
  padding-right: 2rem;
}
.amount-button-group {
  font-family: var(--bs-body-font-family);
  display: flex;
  justify-content: space-between;
  gap: 0.25rem;
  overflow-x: auto;
}
.custom-amount-btn {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid #4318d1;
  color: #4318d1;
  background-color: white;
  border-radius: 6px;
  flex: 1;
  min-width: auto;
}
.custom-amount-btn:hover {
  background-color: #4318d1;
  color: white;
}
.shake {
  animation: shake 0.3s ease-in-out;
}
@keyframes shake {
  0% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  50% {
    transform: translateX(5px);
  }
  75% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}
.tooltip-message {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 2px;
  background-color: #c2b2f0;
  color: #fff;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  z-index: 1;
  white-space: nowrap;
  animation: fadeout 1.5s forwards;
}

.form-control {
  font-family: var(--bs-body-font-family);
}
@keyframes fadeout {
  0% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
