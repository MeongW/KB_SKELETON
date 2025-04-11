<template>
  <footer class="footer">
    <span class="footer-title">&copy; M.O.A</span>
    <span class="footer-content"> - 나의 소비를 똑똑하게 관리하세요</span>
    <ul class="footer-members">
      <li v-for="member in members" :key="member.name">
        <span>{{ member.name }}</span>
        <a
          :href="member.github"
          target="_blank"
          rel="noopener noreferrer"
          class="github-link"
        >
          <i class="fa-brands fa-github"></i>
        </a>
      </li>
    </ul>
  </footer>
</template>

<script setup>
const members = [
  { name: 'dlekgus', github: 'https://github.com/dlekgus' },
  { name: '0woy', github: 'https://github.com/0woy' },
  { name: 'meentho', github: 'https://github.com/meentho' },
  { name: 'MeongW', github: 'https://github.com/MeongW' },
  { name: 'ParkPark8', github: 'https://github.com/ParkPark8' },
];
</script>

<style scoped>
.footer {
  background-color: #ffffff;
  color: #e7defc;
  padding: 0.5rem;
  text-align: start;
  border-top: 1px solid #e5e7eb;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #4bb76b;
}

.footer-content {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #c2b2f0;
}

.footer-members {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: start;
  font-size: 1rem;
}

.footer-members li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.github-link {
  color: #4318d1;
  font-size: 1.1rem;
  transition: color 0.2s ease;
}

.github-link:hover {
  color: #2c0aa8;
}
</style>
