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
        <div class="text-center mb-4">
          <img
            src="@/assets/images/logo.png"
            alt="KB가계부 로고"
            style="width: 160px; height: auto"
          />
          <p class="text-muted">나의 소비를 똑똑하게 관리하세요</p>
        </div>

        <!-- 💡 로그인 폼 시작 -->
        <form @submit.prevent="login">
          <!-- 이메일 -->
          <div class="mb-3 position-relative">
            <label class="form-label">이메일</label>
            <div class="input-group">
              <input
                type="email"
                class="form-control"
                v-model="email"
                placeholder="이메일을 입력하세요"
                :class="{ 'is-invalid shake': emailError }"
              />
              <span class="input-group-text">
                <i class="fa-solid fa-envelope"></i>
              </span>
            </div>
            <div v-if="emailError" class="tooltip-message">
              이메일 형식이 올바르지 않습니다.
            </div>
          </div>

          <!-- 비밀번호 -->
          <div class="mb-3 position-relative">
            <label class="form-label">비밀번호</label>
            <div class="input-group">
              <input
                :type="showPassword ? 'text' : 'password'"
                class="form-control"
                v-model="password"
                placeholder="비밀번호를 입력하세요"
                :class="{ 'is-invalid shake': passwordError }"
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
            <div v-if="passwordError" class="tooltip-message">
              비밀번호를 입력하세요
            </div>
            <div class="text-end mt-1">
              <a href="#" class="small text-primary">비밀번호 찾기</a>
            </div>
          </div>

          <!-- 자동 로그인 + 눈 아이콘 -->
          <div class="form-check d-flex align-items-center mb-4">
            <input
              class="form-check-input me-2"
              type="checkbox"
              v-model="autoLogin"
              id="autoLogin"
            />
            <label class="form-check-label me-auto" for="autoLogin">
              자동 로그인
            </label>
            <span style="cursor: pointer" @click="togglePassword">
              <!-- <i
                :class="
                  showPassword ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'
                "
              ></i> -->
            </span>
          </div>

          <!-- 오류 메시지 출력 -->
          <div v-if="errorMessage" class="text-danger small text-center mb-3">
            {{ errorMessage }}
          </div>

          <!-- 로그인 버튼 -->
          <button class="btn btn-primary w-100 mb-3" type="submit">
            로그인
          </button>
        </form>

        <!-- 회원가입 링크 -->
        <p class="text-center text-muted small">
          아직 회원이 아니신가요?
          <router-link to="/signup" class="text-p">회원가입</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "@/services/api";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/userStore";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const autoLogin = ref(false);
const errorMessage = ref("");

const emailError = ref(false);
const passwordError = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const validateEmail = (email) => {
  const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regex.test(email);
};

const login = async () => {
  emailError.value = !validateEmail(email.value);
  passwordError.value = !password.value;

  if (emailError.value || passwordError.value) {
    return;
  }

  try {
    const res = await api.get("/users", {
      params: {
        email: email.value,
        password: password.value,
      },
    });

    if (res.data.length > 0) {
      const loggedInUser = res.data[0];
      userStore.setUser(loggedInUser);
      localStorage.setItem("userId", loggedInUser.id);

      // ✅ 자동 로그인 정보 저장
      if (autoLogin.value) {
        localStorage.setItem("autoLoginEmail", email.value);
        localStorage.setItem("autoLoginPassword", password.value);
      } else {
        localStorage.removeItem("autoLoginEmail");
        localStorage.removeItem("autoLoginPassword");
      }

      errorMessage.value = "";
      router.push("/home");
    } else {
      errorMessage.value = "이메일 또는 비밀번호가 일치하지 않습니다.";
    }
  } catch (err) {
    console.error("로그인 오류:", err);
    errorMessage.value = "로그인 중 오류가 발생했습니다.";
  }
};

// ✅ 자동 로그인 실행
onMounted(async () => {
  const savedEmail = localStorage.getItem("autoLoginEmail");
  const savedPassword = localStorage.getItem("autoLoginPassword");

  if (savedEmail && savedPassword) {
    email.value = savedEmail;
    password.value = savedPassword;
    autoLogin.value = true;
  }
});
</script>

<style scoped>
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
.is-invalid {
  border-color: #c2b2f0 !important;
  box-shadow: 0 0 0 0.2rem rgba(194, 178, 240, 0.25);
}
</style>
