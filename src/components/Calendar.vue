<template>
  <FullCalendar v-if="calendarOptions" :options="calendarOptions" />
</template>

<script setup>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import koLocale from '@fullcalendar/core/locales/ko';
import dayjs from 'dayjs';
import { ref, computed, onMounted, watch } from 'vue';
import { useTransactionStore } from '@/stores/transactionStore';
import { useUserStore } from '@/stores/userStore';

const emit = defineEmits(['day-click']); // 상위로 날짜 전달

const userStore = useUserStore();
const transactionStore = useTransactionStore();

const calendarEvents = ref([]);

const dailyTotals = computed(() => {
  const totals = {};

  for (const tx of transactionStore.transactions) {
    const date = tx.date;

    if (!totals[date]) {
      totals[date] = { income: 0, expense: 0 };
    }

    if (tx.type === 'income') {
      totals[date].income += tx.amount;
    } else if (tx.type === 'expense') {
      totals[date].expense += tx.amount;
    }
  }

  return totals;
});

const calendarOptions = ref(null); // 초기에는 null
onMounted(async () => {
  const userId = userStore.user?.id || localStorage.getItem('userId');
  if (!userId) return;

  await transactionStore.fetchByUser(userId);

  calendarOptions.value = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: koLocale,
    events: [],
    dayCellContent: (arg) => {
      const dateStr = dayjs(arg.date).format('YYYY-MM-DD');
      const totals = dailyTotals.value[dateStr];
      const day = arg.date.getDate();

      let html = `<div class="day-number">${day}</div><br/>`;
      if (totals) {
        if (totals.expense)
          html += `<div class="dayCellAmount expense">- ${totals.expense.toLocaleString()}원</div>`;
        if (totals.income)
          html += `<div class='dayCellAmount income'>+ ${totals.income.toLocaleString()}원</div>`;

        const todayTotal = totals.income - totals.expense;
        const sign = todayTotal > 0 ? '+' : '';
        const totalClass = todayTotal > 0 ? 'plus' : 'minus';
        html += `<div class='dayCellAmount tototal ${totalClass}'>${sign}${todayTotal.toLocaleString()}원</div>`;
      }

      return { html };
    },
    headerToolbar: {
      start: 'title',
      center: '',
      end: 'today prev,next',
    },
    dateClick: (info) => {
      emit('day-click', info.dateStr); // ✅ 클릭된 날짜를 상위(Home.vue)로 전달
    },
    titleFormat: { year: 'numeric', month: 'long' },
    dayCellDidMount: (arg) => {
      const day = arg.date.getDay();
      const dayNumberElement = arg.el.querySelector('.fc-daygrid-day-number');
      if (dayNumberElement) {
        dayNumberElement.innerHTML = dayNumberElement.innerHTML.replace(
          '일',
          ''
        );
        if (day === 0) {
          dayNumberElement.style.color = 'red';
        } else if (day === 6) {
          dayNumberElement.style.color = 'blue';
        } else {
          dayNumberElement.style.color = 'black';
        }
      }
    },
  };
});

watch(
  () => transactionStore.transactions, // 거래 목록의 변화를 감지
  () => {
    if (calendarOptions.value) {
      // shallow copy를 통해 반응성 유도 (FullCalendar가 내부 옵션 변경 감지하게 함)
      calendarOptions.value = { ...calendarOptions.value };
    }
  },
  { deep: true }
);
</script>

<style>
.fc-daygrid-day-frame {
  position: relative;
}
.day-number {
  position: absolute;
  top: 4px;
  right: 4px;
  font-weight: bold;
  font-size: 0.85em;
}

.dayCellAmount {
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tototal {
  font-size: 0.8em;
}

.tototal.plus {
  color: rgb(0, 185, 68);
}

.tototal.minus {
  color: rgb(255, 174, 1);
}

.dayCellAmount.expense {
  color: red;
}

.dayCellAmount.income {
  color: rgb(0, 0, 255);
}

.fc .fc-toolbar {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 10;
}

.fc .fc-scrollgrid thead {
  position: sticky;
  background-color: white;
  z-index: 9;
}

.calendar-wrapper {
  height: 100%;
  overflow-y: auto;
}

.fc .fc-col-header-cell:nth-child(1) .fc-col-header-cell-cushion {
  color: red !important;
}

.fc .fc-col-header-cell:nth-child(2) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(3) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(4) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(5) .fc-col-header-cell-cushion,
.fc .fc-col-header-cell:nth-child(6) .fc-col-header-cell-cushion {
  color: black !important;
}

.fc .fc-col-header-cell:nth-child(7) .fc-col-header-cell-cushion {
  color: blue !important;
}

.fc .fc-button {
  background-color: #4318d1 !important;
  border-color: #4318d1 !important;
  color: white !important;
}

.fc .fc-button:hover {
  background-color: #3310a3 !important;
  border-color: #3310a3 !important;
}

.fc-daygrid-day-number,
.fc-col-header-cell-cushion {
  text-decoration: none;
}

.fc .fc-daygrid-day-frame {
  height: 80px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

@media (max-width: 768px) {
  .fc-daygrid-day-frame {
    position: relative;
  }
  .day-number {
    position: absolute;
    top: 4px;
    right: 4px;
    font-weight: normal;
    font-size: 10px;
  }

  .dayCellAmount {
    font-size: 9px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
  }

  .tototal {
    font-size: 8.5px;
    font-weight: 600;
  }

  .tototal.plus {
    color: rgb(0, 185, 68);
  }

  .tototal.minus {
    color: rgb(255, 174, 1);
  }

  .calendar-wrapper {
    height: 100%;
    overflow-y: auto;
  }

  .fc .fc-col-header-cell:nth-child(1) .fc-col-header-cell-cushion {
    color: red !important;
  }

  .fc .fc-col-header-cell:nth-child(7) .fc-col-header-cell-cushion {
    color: blue !important;
  }

  .fc .fc-button {
    background-color: #4318d1 !important;
    border-color: #4318d1 !important;
    color: white !important;
  }

  .fc .fc-button:hover {
    background-color: #3310a3 !important;
    border-color: #3310a3 !important;
  }

  .fc-daygrid-day-number,
  .fc-col-header-cell-cushion {
    text-decoration: none;
  }

  .fc .fc-daygrid-day-frame {
    height: 60px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
}
</style>
