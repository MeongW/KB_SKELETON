<template>
  <div class="home-layout">
    <!-- 헤더 -->
    <header>
      <slot name="header" />
    </header>

    <!-- 본문 (캘린더 + 내역) -->
    <main class="main-content card">
      <div class="calendar-area">
        <slot name="calendar" />
      </div>
      <div class="history-area">
        <slot name="this-month-history"></slot>
        <slot name="recent-history" />
      </div>
    </main>

    <!-- 하단 네비게이션 -->
    <footer>
      <slot name="footer" />
    </footer>

    <!-- 플로팅 버튼 -->
    <div class="fab">
      <slot name="fab" />
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: column;
}

header {
  padding: 1rem;
}

/* 기본은 가로로 배치 (데스크탑) */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  flex-direction: row;
}

/* calendar */
.calendar-area {
  flex: 2;
  padding: 1rem;
  overflow-y: auto;
  z-index: 0;

  /* 스크롤바 숨기기 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.calendar-area::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

/* history */
.history-area {
  flex: 1;
  padding: 1rem;
  border-left: 1px solid #eee;
  background: #ffffff;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* footer 고정 */
footer {
  /* position: fixed; */
  bottom: 0;
  width: 100%;
  background: white;
  border-top: 1px solid #ddd;
}

/* 플로팅 버튼 */
.fab {
  position: fixed;
  bottom: 80px;
  right: 20px;
}

/* 👉 반응형 처리 */
@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    display: contents;
  }

  .calendar-area {
    flex: none;
    height: auto;
    border-bottom: 1px solid #eee;
    font-size: x-small;
  }

  .history-area {
    flex: 1;
    border-left: none;
    border-top: 1px solid #eee;
    min-height: fit-content;
  }

  .fab {
    bottom: 100px;
    right: 16px;
  }
}
</style>
