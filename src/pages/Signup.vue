<template>
  <div
    class="vh-100 d-flex justify-content-center align-items-center"
    style="background-color: #f8f9fa"
  >
    <div class="container d-flex justify-content-center">
      <div
        class="card shadow p-4"
        style="width: 100%; max-width: 400px; border-radius: 1rem"
      >
        <!-- Header -->
        <div class="text-center mb-4">
          <img
            src="@/assets/images/logo.png"
            alt="KB가계부 로고"
            style="width: 160px; height: auto"
          />
          <p class="text-muted">나의 소비를 똑똑하게 관리하세요</p>
        </div>

        <!-- 닉네임 -->
        <div class="mb-3">
          <label class="form-label">닉네임</label>
          <input
            type="text"
            class="form-control"
            v-model="nickname"
            placeholder="닉네임을 입력하세요"
          />
        </div>

        <!-- 이메일 -->
        <div class="mb-3">
          <label class="form-label">이메일</label>
          <div class="input-group">
            <input
              type="email"
              class="form-control"
              v-model="email"
              placeholder="이메일을 입력하세요"
            />
            <span class="input-group-text">
              <i class="fa-solid fa-envelope"></i>
            </span>
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="mb-3">
          <label class="form-label">비밀번호</label>
          <div class="input-group">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              v-model="password"
              placeholder="비밀번호를 입력하세요"
            />
            <span
              class="input-group-text"
              style="cursor: pointer"
              @click="togglePassword"
            >
              <i
                :class="
                  showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'
                "
              ></i>
            </span>
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="mb-2">
          <label class="form-label">비밀번호 확인</label>
          <div class="input-group">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              v-model="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
            />
            <span
              class="input-group-text"
              style="cursor: pointer"
              @click="toggleConfirmPassword"
            >
              <i
                :class="
                  showConfirmPassword
                    ? 'fa-solid fa-eye'
                    : 'fa-solid fa-eye-slash'
                "
              ></i>
            </span>
          </div>
        </div>

        <!-- 여기 에러 메시지 표시 -->
        <div v-if="errorMessage" class="text-danger small text-center mb-3">
          {{ errorMessage }}
        </div>

        <!-- 회원가입 버튼 -->
        <button
          class="btn btn-primary w-100 mb-3"
          style="background-color: #4318d1; border: none"
          @click="signup"
        >
          회원가입
        </button>

        <!-- 로그인 링크 -->
        <p class="text-center text-muted small">
          이미 계정이 있으신가요?
          <router-link to="/" class="text-primary">로그인</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useUserStore } from '@/stores/userStore';
const userStore = useUserStore();

const router = useRouter();

// 사용자 입력 값들
const nickname = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

// 상태값: 비밀번호 보기 토글
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 에러 메시지
const errorMessage = ref('');

// 비밀번호 입력 토글
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 비밀번호 확인 입력 토글
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 회원가입 처리
const signup = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '비밀번호가 일치하지 않습니다';
    return;
  }

  errorMessage.value = '';

  try {
    // 이메일 중복 체크
    const check = await axios.get('/api/users', {
      params: { email: email.value },
    });

    if (check.data.length > 0) {
      errorMessage.value = '이미 사용 중인 이메일입니다.';
      return;
    }

    // 회원 정보 db.json에 저장
    const response = await axios.post('/api/users', {
      nickname: nickname.value,
      email: email.value,
      password: password.value,
    });

    console.log('✅ 회원가입 성공:', response.data);

    // 회원가입 성공 후에 이 코드 추가!
    userStore.setUser(response.data); // Pinia에 유저 저장
    localStorage.setItem('userId', response.data.id); // ✅ 로컬에도 저장

    // 입력값 초기화
    nickname.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';

    // 완료 후 로그인 페이지로 이동 (옵션)
    alert('회원가입이 완료되었습니다!');

    // 로그인 페이지로 이동
    router.push('/');
  } catch (err) {
    console.error('❌ 회원가입 오류:', err);
    errorMessage.value = '회원가입 중 오류가 발생했습니다.';
  }
};
</script>
