<template>
  <div class="col-12 col-md-4 d-flex justify-content-center align-items-center">
    <div class="score-circle text-center">
      <div
        class="circle"
        :style="{
          borderColor: borderColor,
          borderWidth: '10px',
          borderStyle: 'solid',
        }"
      >
        <span class="score" :class="gradeInfo.color">
          {{ gradeInfo.grade }}
        </span>
      </div>
      <div class="mt-2" :class="gradeInfo.color">
        <div class="fw-bold">{{ gradeInfo.grade }} 등급</div>
        <div class="text-muted">{{ gradeInfo.message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  expense: Number,
  income: Number,
});

const borderColor = computed(() => {
  const colorMap = {
    'text-success': '#2e7d32',
    'text-primary': '#1976d2',
    'text-warning': '#fbc02d',
    'text-danger': '#d32f2f',
  };
  return colorMap[gradeInfo.value.color] || '#ccc';
});

const gradeInfo = computed(() => {
  let val = (props.expense / props.income) * 100;
  val = Math.round(val);
  let grade = '',
    color = '';
  if (val <= 30) {
    grade = 'A';
    color = 'text-success';
  } else if (val <= 50) {
    grade = 'B';
    color = 'text-primary';
  } else if (val <= 80) {
    grade = 'C';
    color = 'text-warning';
  } else {
    grade = 'D';
    color = 'text-danger';
  }
  return {
    grade: isNaN(val) ? '--' : grade,
    message: isNaN(val) ? '데이터가 없습니다.' : `수입의 ${val}% 지출했어요!`,
    color: isNaN(val) ? 'text-muted' : color,
  };
});
</script>

<style scoped>
.score-circle .circle {
  width: 100px;
  height: 100px;
  border: 10px solid #385531;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
}
.score-circle .score {
  font-size: 1.5rem;
  color: #6f42c1;
  font-weight: bold;
}

.border-success {
  border-color: #2e7d32;
}
.border-primary {
  border-color: #1976d2;
}
.border-warning {
  border-color: #fbc02d;
}
.border-danger {
  border-color: #d32f2f;
}
</style>
