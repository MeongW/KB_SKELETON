import { defineStore } from "pinia";
import axios from "axios";

const BASE_URL = "/api";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
  }),
  actions: {
    async fetchUser(id) {
      try {
        const res = await axios.get(`${BASE_URL}/users/${id}`);
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
    },
    async deleteUser() {
      //현재 로그인된 유저 정보가 없으면 함수 종료
      if (!this.user) return;
      await axios.delete(`${BASE_URL}/users/${this.user.id}`);
      this.logout();
    },
    async changePassword(current, newPassword) {
      if (!this.user) {
        console.log("유저 정보가 없습니다.");
      }
      if (this.user.password !== current) {
        console.log("비밀번호가 일치하지 않습니다.");
      }
      const updatedUser = {
        ...this.user,
        password: newPassword,
      };
      const res = await axios.put(
        `${BASE_URL}/users/${this.user.id}`,
        updatedUser
      );
      if (res.status === 200) {
        this.user.password = newPassword;
        return true;
      } else {
        console.log("비밀번호 변경 실패");
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

        const res = await axios.put(
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
