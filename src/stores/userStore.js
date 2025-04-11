import { defineStore } from "pinia";
import api from "@/services/api";
import bcrypt from "bcryptjs";

const BASE_URL = "";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser(id) {
      try {
        const res = await api.get(`${BASE_URL}/users/${id}`);
        this.user = res.data;
        console.log(localStorage.getItem("userId"));
      } catch (error) {
        console.log("유저 조회 실패", error);
        this.user = null;
      }
    },
    setUser(userData) {
      this.user = userData;
      localStorage.setItem("userId", userData.id);
      localStorage.setItem("userImage", "https://picsum.photos/50/50");
    },
    logout() {
      this.user = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("userImage");
      localStorage.removeItem("fixedToast");
    },
    async deleteUser() {
      //현재 로그인된 유저 정보가 없으면 함수 종료
      if (!this.user) return;
      await api.delete(`${BASE_URL}/users/${this.user.id}`);
      this.logout();
    },

    async changePassword(current, newPassword) {
      if (!this.user) {
        return "no-user"; // 사용자 정보 없음
      }

      // 비밀번호 유효성 검사 함수
      const validateStrongPassword = (password) => {
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[!@#$%^&*(),.?":{}|<>_\-\\[\]=+`~;'\/]/.test(
          password
        );
        const isOnlyAllowedChars =
          /^[A-Za-z0-9!@#$%^&*(),.?":{}|<>_\-\\[\]=+`~;'\/]+$/.test(password);
        return (
          password.length >= 8 &&
          hasLetter &&
          hasNumber &&
          hasSymbol &&
          isOnlyAllowedChars
        );
      };

      // 비밀번호 조건 불충족
      if (!validateStrongPassword(newPassword)) {
        return "invalid-password-format";
      }

      // 현재 비밀번호 불일치
      const isMatch = await bcrypt.compare(current, this.user.password);
      if (!isMatch) {
        return "not-matched";
      }

      // 비밀번호 해싱 후 업데이트
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUser = {
        ...this.user,
        password: hashedPassword,
      };

      try {
        const res = await api.put(
          `${BASE_URL}/users/${this.user.id}`,
          updatedUser
        );

        if (res.status === 200) {
          this.user.password = hashedPassword;
          return "success";
        } else {
          return "server-error";
        }
      } catch (error) {
        console.error("비밀번호 변경 요청 중 에러:", error);
        return "server-error";
      }
    },

    async changeNickname(newNickname) {
      try {
        if (!newNickname || newNickname.trim().length < 2) {
          return;
        }
        const updatedUser = {
          ...this.user,
          nickname: newNickname,
        };

        const res = await api.put(
          `${BASE_URL}/users/${this.user.id}`,
          updatedUser
        );
        if (res.status === 200) {
          // ✅ 객체를 통째로 교체해서 반응성 유지
          this.user = { ...this.user, nickname: newNickname };
        } else {
          alert("닉네임 수정에 실패했습니다.");
        }
      } catch (error) {
        console.log("닉네임 변경 실패", error);
      }
    },
  },
});
