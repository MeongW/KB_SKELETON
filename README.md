<div align="center">
 <h1>💸 MOA -모아서 관리하는 개인 맞춤형 가계부 서비스</h1>   
 <p align="center">
  <img src="https://github.com/user-attachments/assets/36551bc2-8ca4-4be0-9a88-05f355ccd5ac" width="30%"/>
  <img src="https://github.com/user-attachments/assets/1922416c-a0d4-43ee-969b-9823cf7e8993"width="30%"/>
 </p>
  <span>큐알 코드 스캔 시 서비스 이용 가능</span>
</div>
  

<br/>

<div align="center">
  <h2>📌 팀원 구성 (5명)</h2>  
<table>
          
  <tr>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/dlekgus?v=4" width="100" /><br/>
      <a href="https://github.com/dlekgus"><b>이다현</b></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/0woy?v=4" width="100" /><br/>
      <a href="https://github.com/0woy"><b>박윤아</b></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/MeongW?v=4" width="100" /><br/>
      <a href="https://github.com/MeongW"><b>정성엽</b></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/ParkPark8?v=4" width="100" /><br/>
      <a href="https://github.com/ParkPark8"><b>박동희</b></a>
    </td>
    <td align="center">
      <img src="https://avatars.githubusercontent.com/meentho?v=4" width="100" /><br/>
      <a href="https://github.com/meentho"><b>김민서</b></a>
    </td>
  </tr>
</table>
</div>

<br/>
<br/>

# 🚀 사용 기술 스택 (Tech Stack)

<p align="left"> <img src="https://img.shields.io/badge/Vue.js-35495e?style=for-the-badge&logo=vue.js&logoColor=4FC08D" /> <img src="https://img.shields.io/badge/Pinia-ffd859?style=for-the-badge&logo=pinia&logoColor=white" /> <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" /> <img src="https://img.shields.io/badge/JSON Server-000000?style=for-the-badge&logo=json&logoColor=white" /> <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" /> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" /> </p>


- Frontend: Vue.js (Composition API)
- State Management: Pinia
- Routing: Vue Router
- HTTP 요청: Axios
- Mock Backend: json-server 사용 (간단한 데이터베이스 대체)
- CSS Framework: Bootstrap

<br/>
<br/>

# ✨ 주요 기능 명세 (Feature Specification)

## 사용자 기능

| 기능              | 설명                                                                 |
|-------------------|----------------------------------------------------------------------|
| 회원가입         | 이름, 이메일, 비밀번호 입력 후 회원가입. 가입 후 로그인 페이지로 이동         |
| 로그인 / 자동 로그인 | 로그인 시 자동 로그인 여부 선택 가능. 새로고침 및 재접속 시 로그인 유지됨         |
| 비밀번호 변경     | 마이페이지에서 현재 비밀번호 확인 후 새로운 비밀번호로 변경 가능 (모달 방식)   |
| 닉네임 수정       | 마이페이지에서 닉네임 즉시 수정 가능                                      |
| 로그아웃         | 마이페이지 또는 헤더에서 로그아웃 수행                                  |

<br/>

## 거래 내역 관리
| 기능                | 설명                                                                       |
|---------------------|----------------------------------------------------------------------------|
| 거래 내역 조회       | 특정 날짜 선택 시 해당 날짜의 거래 내역만 필터링하여 표시                          |
| 거래 추가 / 수정 / 삭제 | 거래 내역을 등록, 수정, 삭제 가능 (모달 방식)                                     |
| 메모 기능           | 각 거래 항목에 짧은 메모 입력 가능                                              |
| 상세 필터링         | 월별(기본), 주간별, 카테고리별 필터 적용 가능                                    |
| 간소화된 UI         | 복잡한 그래프 없이 깔끔한 리스트 중심 UI 구성                                      |

<br/>

## 홈 화면 기능
| 기능                  | 설명                                                                 |
|-----------------------|----------------------------------------------------------------------|
| 달력 기반 거래 조회     | 달력에서 날짜 클릭 시 해당 날짜의 소비 내역 표시                               |
| 월별 재정 요약 카드     | 해당 월의 총 소비, 수입, 잔액 등을 요약한 카드 제공                            |
| 최근 거래 목록         | 가장 최근 소비 내역을 빠르게 확인할 수 있는 카드 형태 UI                        |
| 고정 지출 알림         | 로그인 직후, 결제 예정일이 3일 이내인 고정 지출/구독 항목 알림 카드가 우측 상단에 표시됨 |

<br/>

## 통계 기능
| 기능                | 설명                                                                 |
|---------------------|----------------------------------------------------------------------|
| 기간별 전체 통계 조회   | 선택한 기간에 대한 수입 / 지출 통계 제공                                  |
| 전월 대비 지출 변화     | 이전 달과 비교한 소비 증감율 시각화                                     |
| 최다 지출 항목         | 가장 많이 소비한 항목 (카테고리 기준) 확인 가능                          |
| 소비 점수 시각화       | 사용자의 소비 패턴을 점수화하여 시각적으로 표시                             |
| 카테고리별 지출 분석   | 카테고리별로 지출 내역을 그래프 혹은 리스트로 분류하여 확인 가능                |
| 요일별 지출           | 각 요일의 평균 지출 분석 → 주간 소비 습관 파악                             |

<br/>

## 고정 지출 관리
| 기능               | 설명                                                                  |
|--------------------|-----------------------------------------------------------------------|
| 고정 지출 수동 등록   | 정기 결제 및 반복 지출 항목을 사용자가 직접 등록 가능                          |
| 구독 / 고정 항목 분리 | 구독 서비스와 일반 고정 지출 항목을 탭으로 구분하여 확인 가능                    |
| 결제 예정일 표시      | 각 고정 지출 항목에 대해 다음 결제일 표시 및 정렬                             |

---
# 프로젝트 구성도
![1](https://github.com/user-attachments/assets/c0d2e613-d2d2-462a-92c0-076137e21420)

<br/>

# ERD (json-server)
<img src="https://github.com/user-attachments/assets/8a64a8f7-0f68-40f9-8b47-316061215b06" width="80%" />


---

# 🖼️ 서비스 주요 화면

## 🔐 로그인 & 회원가입
<p align="center"> <img src="https://github.com/user-attachments/assets/ce474615-5293-4715-806b-c22eaa7b9cb5" width="45%" /> <img src="https://github.com/user-attachments/assets/319d077f-3d19-4e2f-8364-afc44c501b3c" width="45%" /> </p>

<br/>

## 🏠 홈 화면
<img src="https://github.com/user-attachments/assets/d52cbdf0-be2f-4c7f-a5cd-6e06bbc6b1ed" width="100%" /> 
<br/>

## 📄 거래 내역 화면
<img src="https://github.com/user-attachments/assets/1345ab69-ff07-4ca2-8bbb-b4a31a1bf4c5" width="80%" />
<br/>

## 💸고정 지출 관리 화면
<p align="center">  <img src="https://github.com/user-attachments/assets/5b55a361-6259-4c5f-99f3-dbe1505a821e" width="80%" />
  <img src="https://github.com/user-attachments/assets/b969d1e1-3c7a-4fbe-8f92-42ff405b4f6d" width="80%" /> </p>
<br/>

## 📊 통계 화면
<img src="https://github.com/user-attachments/assets/cd8e6efc-adf4-4b84-8991-fd30f26b7b58" width="100%" /> 
<br/>

## 👤 마이페이지 화면
<p align="center"> <img src="https://github.com/user-attachments/assets/dea126ce-c1e2-42f9-b322-997b5f910783" width="45%" /> <img src="https://github.com/user-attachments/assets/0020f76a-9fd7-4b33-ac04-408e89bde1e6" width="45%" /> </p>

---

# ⚙️ 설치 방법 (Getting Started)
로컬 환경에서 이 프로젝트를 실행하는 방법은 다음과 같습니다.

### 1. 저장소 클론
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```
실행 후 브라우저에서 http://localhost:5173 으로 접속합니다.

### 4. json-server 실행 (Mock Backend)
```bash
npm install -g json-server
json-server --watch db.json --port 3001
```
db.json 파일은 프로젝트 루트에 있어야 하며, 초기 더미 데이터가 포함되어 있어야 합니다.
json-server가 실행되면 http://localhost:3001에서 API가 작동합니다.


