<template>
  <div>
    <MypageLayout v-if="user">
      <template v-slot:title-area>
        <h2>마이페이지</h2>
        <p>회원 정보 및 설정을 관리하세요</p>
      </template>

      <template v-slot:profile-area>
        <div class="user-image">
          <img class="rounded-circle" :src="userImage" alt="" />
        </div>
        <div class="info">
          <div class="user-name">
            <template v-if="isEditing">
              <input
                type="text"
                v-model="editedNickname"
                class="form-control"
              />
            </template>
            <template v-else>
              {{ nickname }}
            </template>
          </div>
          <div class="user-email">{{ email }}</div>
          <div class="user-join-date">{{ joinDate }}</div>
        </div>
        <div class="btn-modi">
          <button
            class="btn btn-primary pointer"
            @click="isEditing ? updateNickname() : modiNickname()"
          >
            {{ isEditing ? '완료' : '수정' }}
          </button>
          <button
            v-show="isEditing"
            class="btn btn-primary cancel pointer"
            @click="isEditing = false"
          >
            취소
          </button>
        </div>
      </template>

      <template v-slot:alarm-area>
        <div>알림 설정</div>
        <hr />
        <div
          class="switch-setting"
          v-for="(label, key) in alarmLabels"
          :key="key"
        >
          <label
            class="form-check-label justify-content-end pointer"
            :for="key"
          >
            {{ label }}
          </label>
          <span class="form-check form-switch">
            <input
              class="form-check-input pointer"
              type="checkbox"
              role="switch"
              id="sendNotification"
              :checked="user?.sendNotification"
              @change="(e) => handleToggleNotification(e.target.checked)"
            />
          </span>
        </div>
      </template>

      <template v-slot:manage-area>
        계정 관리
        <div class="d-flex flex-column gap-2 mt-2">
          <button
            class="btn btn-passwordChange"
            @click="showPasswordChangeModal = true"
          >
            비밀번호 변경
          </button>
          <PasswordChangeModal
            v-if="showPasswordChangeModal"
            :userId="user.id"
            @close="showPasswordChangeModal = false"
          />
          <button class="btn btn-logout" @click="logout">로그아웃</button>
          <button class="btn btn-out" @click="deleteUser">회원 탈퇴</button>
        </div>
      </template>
    </MypageLayout>
  </div>
</template>

<script setup>
import MypageLayout from '@/components/layouts/MypageLayout.vue';
import PasswordChangeModal from '@/components/modal/PasswordChangeModal.vue';
import { computed, ref, onMounted } from 'vue';
import router from '@/router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const BASEURL = '';

const showPasswordChangeModal = ref(false);
const isEditing = ref(false);
const editedNickname = ref('');
const userImage = ref('https://picsum.photos/50/50');

const alarmLabels = {
  //   pushAlarm: "푸시 알림",
  //   emailAlarm: "이메일 알림",
  payAlarm: '결제 예정 알림',
};

const handleToggleNotification = (value) => {
  userStore.toggleSendNotification(value);
};

const modiNickname = () => {
  isEditing.value = true;
};

const updateNickname = async () => {
  try {
    if (editedNickname.value.length >= 2) {
      await userStore.changeNickname(editedNickname.value);
      isEditing.value = false;
      alert('닉네임 변경');
    } else {
      alert('두글자 이상 입력하세요!');
    }
  } catch (error) {
    alert('닉네임 변경 실패');
  }
};

const logout = () => {
  const confirmLogout = confirm('정말 로그아웃하시겠습니까?');
  if (!confirmLogout) return;
  userStore.logout();

  router.push('/');
};

const deleteUser = async () => {
  const confirmLogout = confirm('정말 회원 탈퇴하시겠습니까?');
  if (!confirmLogout) return;
  userStore.deleteUser();
  router.push('/');
};

onMounted(async () => {
  const storedId = localStorage.getItem('userId');

  userImage.value =
    localStorage.getItem('userImage') ||
    'https://velog.velcdn.com/images/chanmi125/post/18a3256c-dbaf-4f5e-952e-c694496e25ad/image.svg';

  if (!storedId) {
    console.warn('⚠️ userId가 없음 → 로그인 페이지로 이동');
    router.push('/login');
    return;
  }

  try {
    await userStore.fetchUser(storedId);
  } catch (e) {
    console.error('❌ fetchUser 실패:', e);
  }
});

const user = computed(() => userStore.user);
// 옵셔널 체이닝을 이용해 null 방지
const email = computed(() => user.value?.email || '');
const nickname = computed(() => userStore.user?.nickname || '');
const joinDate = computed(() => user.value?.joinDate || '');
</script>

<style scoped>
.switch-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.5rem;
}

.btn-modi {
  margin-left: auto;
}

.user-image {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  margin-right: 1rem;
  overflow: hidden;
  background-color: #f3f4f6;
}

.user-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.user-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.user-email {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.15rem;
}

.user-join-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.btn {
  text-align: left;
  font-size: small;
  cursor: pointer;
}

.btn-modi .btn {
  font-size: 0.875rem;
  font-weight: 500;
  padding: 4px 12px;
  border-radius: 8px;
}

.btn-logout {
  background-color: #fef2f2;
  color: red;
  border: 0;
}

.btn-passwordChange {
  background-color: #f3f4f6;
}

.btn-out {
  color: #6b7280;
  font-size: x-small;
}

.cancel {
  margin-left: 0.5rem;
}

.pointer {
  cursor: pointer;
}
</style>
