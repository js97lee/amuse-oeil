# Amuse-Oeil

감정 기반 셰프 매칭 시스템

## 🎯 프로젝트 개요

Amuse-Oeil은 사용자의 감정을 분석하여 최적의 셰프를 매칭하는 인터랙티브 시스템입니다.

## 🚀 배포된 사이트

**Live Demo**: [https://amuse-oeil.vercel.app](https://amuse-oeil.vercel.app)

## 📱 기능

- **Controller (모바일)**: 감정 기반 설문을 통한 셰프 매칭
- **Display (큰 화면)**: 결과 시각화 및 셰프별 영상 재생
- **실시간 통신**: Socket.io를 통한 Controller-Display 연동
- **갤러리 스타일 UI**: 미니멀하고 럭셔리한 디자인

## 🎨 셰프

- **ZEN**: 🧘‍♂️ 명상과 평온의 셰프
- **NARA**: 🌸 우아하고 섬세한 셰프  
- **REMI**: 🎨 창의적이고 예술적인 셰프

## 🛠️ 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Real-time**: Socket.io
- **Deployment**: Vercel

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── controller/          # 모바일 컨트롤러
│   ├── display/             # 큰 화면 디스플레이
│   └── page.tsx             # 메인 페이지
├── globals.css              # 갤러리 스타일 CSS
└── data/
    └── questions.json       # 설문 데이터
```

## 🎯 사용법

1. **메인 페이지**: Controller 또는 Display 선택
2. **Controller**: 모바일에서 설문 완료 후 결과 전송
3. **Display**: 큰 화면에서 결과 확인 및 영상 재생
4. **리셋**: Controller에서 다시하기 버튼으로 초기화

## 🎨 갤러리 스타일 특징

- **다크 테마**: neutral-950 배경
- **미세한 라운딩**: 3px border-radius
- **럭셔리 디자인**: 갤러리 스타일 카드 레이아웃
- **반응형**: 모바일과 데스크톱 모두 지원

## 🚀 로컬 개발

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📦 배포

이 프로젝트는 Vercel에 배포되어 있습니다:
- **Production**: [https://amuse-oeil.vercel.app](https://amuse-oeil.vercel.app)
- **Framework**: Next.js 15
- **Runtime**: Node.js 18.x