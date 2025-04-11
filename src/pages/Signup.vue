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
        <div class="mb-3 position-relative">
          <label class="form-label">닉네임</label>
          <input
            type="text"
            class="form-control"
            v-model="nickname"
            placeholder="닉네임을 입력하세요"
            :class="{ 'is-invalid': nicknameError, shake: shakeNickname }"
          />
          <div v-if="nicknameError" class="tooltip-message">
            {{ nicknameError }}
          </div>
        </div>

        <!-- 이메일 -->
        <div class="mb-3 position-relative">
          <label class="form-label">이메일</label>
          <div class="input-group">
            <input
              type="email"
              class="form-control"
              v-model="email"
              placeholder="이메일을 입력하세요"
              :class="{ 'is-invalid': emailError, shake: shakeEmail }"
            />
            <span class="input-group-text"
              ><i class="fa-solid fa-envelope"></i
            ></span>
          </div>
          <div v-if="emailError" class="tooltip-message">{{ emailError }}</div>
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
              :class="{ 'is-invalid': passwordError, shake: shakePassword }"
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
          <div class="form-text">
            영문, 숫자, 특수문자 포함 8자 이상. 한글, 이모지 금지
          </div>
          <div v-if="passwordError" class="tooltip-message">
            {{ passwordError }}
          </div>
        </div>

        <!-- 비밀번호 확인 -->
        <div class="mb-2 position-relative">
          <label class="form-label">비밀번호 확인</label>
          <div class="input-group">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              v-model="confirmPassword"
              placeholder="비밀번호를 다시 입력하세요"
              :class="{
                'is-invalid': confirmPasswordError,
                shake: shakeConfirmPassword,
              }"
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
          <div v-if="confirmPasswordError" class="tooltip-message">
            {{ confirmPasswordError }}
          </div>
        </div>

        <!-- 에러 메시지 -->
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
import { ref, nextTick } from "vue";
import { useRouter } from "vue-router";
import bcrypt from "bcryptjs";
import api from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import dayjs from "dayjs";

const router = useRouter();
const userStore = useUserStore();

const nickname = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

// 상태
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const nicknameError = ref("");
const emailError = ref("");
const passwordError = ref("");
const confirmPasswordError = ref("");
const errorMessage = ref("");

// 흔들림 트리거
const shakeNickname = ref(false);
const shakeEmail = ref(false);
const shakePassword = ref(false);
const shakeConfirmPassword = ref(false);

// 토글
const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () =>
  (showConfirmPassword.value = !showConfirmPassword.value);

// 정규식 검사 함수
const validateEmail = (email) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const validateStrongPassword = (password) => {
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+`~;'\/]/.test(password);
  const isOnlyAllowedChars =
    /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_\-\\[\]=+`~;'\/]+$/.test(password);

  if (password.length < 8) return "8자 이상 입력해주세요.";
  if (!hasLetter || !hasNumber || !hasSymbol)
    return "영문, 숫자, 특수문자를 모두 포함해야 합니다.";
  if (!isOnlyAllowedChars) return "한글, 이모지 등은 사용할 수 없습니다.";
  return "";
};

// 툴팁 + 흔들림 동시에 적용
const showTooltipWithShake = async (errorRef, shakeRef, message) => {
  errorRef.value = "";
  shakeRef.value = false;
  await nextTick();
  errorRef.value = message;
  shakeRef.value = true;
};

const signup = async () => {
  // 초기화
  nicknameError.value = "";
  emailError.value = "";
  passwordError.value = "";
  confirmPasswordError.value = "";
  errorMessage.value = "";

  if (!nickname.value.trim()) {
    await showTooltipWithShake(
      nicknameError,
      shakeNickname,
      "닉네임을 입력하세요."
    );
    return;
  }

  if (!validateEmail(email.value)) {
    await showTooltipWithShake(
      emailError,
      shakeEmail,
      "이메일 형식이 올바르지 않습니다."
    );
    return;
  }

  const pwMessage = validateStrongPassword(password.value);
  if (pwMessage) {
    await showTooltipWithShake(passwordError, shakePassword, pwMessage);
    return;
  }

  if (password.value !== confirmPassword.value) {
    await showTooltipWithShake(
      confirmPasswordError,
      shakeConfirmPassword,
      "비밀번호가 일치하지 않습니다."
    );
    return;
  }

  try {
    const check = await api.get("/users", { params: { email: email.value } });
    if (check.data.length > 0) {
      errorMessage.value = "이미 사용 중인 이메일입니다.";
      return;
    }

    const hashedPassword = await bcrypt.hash(password.value, 10);
    const response = await api.post("/users", {
      nickname: nickname.value,
      email: email.value,
      password: hashedPassword,
      joinDate: dayjs().format("YYYY-MM-DD"),
      sendNotification: true,
    });

    userStore.setUser(response.data);
    localStorage.setItem("userId", response.data.id);

    nickname.value = "";
    email.value = "";
    password.value = "";
    confirmPassword.value = "";

    alert("회원가입이 완료되었습니다!");
    router.push("/");
  } catch (err) {
    console.error("회원가입 오류:", err);
    errorMessage.value = "회원가입 중 오류가 발생했습니다.";
  }
};
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
  animation: fadeout 1.8s forwards;
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
