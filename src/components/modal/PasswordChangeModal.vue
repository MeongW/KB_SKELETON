<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <!-- 헤더 -->
        <div class="modal-header">
          <h5 class="modal-title">비밀번호 변경</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>

        <!-- 바디 -->
        <div class="modal-body">
          <!-- 현재 비밀번호 -->
          <div class="mb-3 position-relative">
            <label class="form-label">현재 비밀번호</label>
            <input
              type="password"
              v-model="currentPassword"
              class="form-control"
              placeholder="현재 비밀번호를 입력하세요"
              :class="{ 'is-invalid shake': currentError }"
            />
            <div v-if="currentError" class="tooltip-message">
              {{ currentError }}
            </div>
          </div>

          <!-- 새 비밀번호 -->
          <div class="mb-3 position-relative">
            <label class="form-label">새 비밀번호</label>
            <input
              type="password"
              v-model="newPassword"
              class="form-control"
              placeholder="새 비밀번호를 입력하세요"
              :class="{ 'is-invalid shake': newPasswordError }"
            />
            <div class="form-text">
              영문, 숫자, 특수문자 포함 8자 이상<br />
              한글, 이모지는 사용할 수 없습니다.
            </div>
            <div v-if="newPasswordError" class="tooltip-message">
              {{ newPasswordError }}
            </div>
          </div>

          <!-- 비밀번호 확인 -->
          <div class="mb-3 position-relative">
            <label class="form-label">새 비밀번호 확인</label>
            <input
              type="password"
              v-model="confirmPassword"
              class="form-control"
              placeholder="새 비밀번호를 다시 입력하세요"
              @keyup.enter="changePassword"
              :class="{ 'is-invalid shake': confirmPasswordError }"
            />
            <div v-if="confirmPasswordError" class="tooltip-message">
              {{ confirmPasswordError }}
            </div>
          </div>
        </div>

        <!-- 푸터 -->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            @click="$emit('close')"
          >
            취소
          </button>
          <button type="button" class="btn btn-primary" @click="changePassword">
            변경하기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { useUserStore } from "@/stores/userStore";

const emit = defineEmits(["close"]);
const userStore = useUserStore();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const currentError = ref("");
const newPasswordError = ref("");
const confirmPasswordError = ref("");

// 클라이언트 유효성 검사 함수 (UI단에서만 사용)
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

const showTooltip = async (refVar, message) => {
  refVar.value = "";
  await nextTick();
  refVar.value = message;
};

const changePassword = async () => {
  currentError.value = "";
  newPasswordError.value = "";
  confirmPasswordError.value = "";

  // 새 비밀번호 유효성 검사 (클라이언트 UI용)
  const pwValidationMessage = validateStrongPassword(newPassword.value);
  if (pwValidationMessage) {
    await showTooltip(newPasswordError, pwValidationMessage);
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    await showTooltip(confirmPasswordError, "비밀번호가 일치하지 않습니다.");
    return;
  }

  const result = await userStore.changePassword(
    currentPassword.value,
    newPassword.value
  );

  if (result === "success") {
    alert("비밀번호가 변경되었습니다.");
    emit("close");
  } else if (result === "not-matched") {
    await showTooltip(currentError, "현재 비밀번호가 일치하지 않습니다.");
  } else if (result === "invalid-password-format") {
    await showTooltip(newPasswordError, "비밀번호 형식이 올바르지 않습니다.");
  } else if (result === "no-user") {
    await showTooltip(
      currentError,
      "로그인이 만료되었습니다. 다시 로그인해주세요."
    );
  } else {
    alert("알 수 없는 오류로 비밀번호를 변경할 수 없습니다.");
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
