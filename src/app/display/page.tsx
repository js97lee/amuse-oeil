"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type ResultPayload = {
  type?: "result";
  chef: "Zen" | "Nara" | "Remi";
  target?: string; // 컨트롤러가 전달하는 디스플레이 결과 경로
};

export default function Page() {
  const [connected, setConnected] = useState(false);
  const router = useRouter();

  const displayRouteMap: Record<string, string> = {
    Zen: "display/result-teaset-zen",
    Nara: "display/result-teaset-nara",
    Remi: "display/result-teaset-remi",
  };

  useEffect(() => {
    let isNavigating = false; // 중복 네비게이션 방지
    
    // 폴링으로 결과 확인
    const checkResult = () => {
      if (isNavigating) return;
      
      fetch("/api/result")
        .then(res => res.json())
        .then(data => {
          if (data.hasResult && data.result) {
            const payload = data.result;
            
            if (payload && payload.type === "reset") {
              isNavigating = true;
              if (window.location.pathname === "/display") {
                window.location.reload();
              } else {
                router.push("/display");
              }
            } else if (payload && payload.type === "result") {
              isNavigating = true;
              const route = payload.target || displayRouteMap[payload.chef] || "display/result-teaset-zen";
              router.push(`/${route}`);
            }
          }
          setConnected(true);
        })
        .catch(() => setConnected(false));
    };

    // 즉시 한 번 확인
    checkResult();
    
    // 1초마다 결과 확인
    const interval = setInterval(checkResult, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [router]);

  // 대기 화면 (동영상/이미지 어느 것이든 지원)
  return (
    <main className="relative min-h-screen w-full bg-neutral-950">
      {/* iOS 26 스타일 헤더 */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 group">
        <div className="flex justify-between items-center">
          {/* 왼쪽 Display • Active 텍스트 - 호버 시에만 보임 */}
          <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-sm rounded-2xl border border-white/30">
              📺
            </div>
            <span className="text-sm text-white/80 font-medium">Display • Active</span>
          </div>
          
          {/* 기본 상태에서 보이는 핸들러 화살표 */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 group-hover:opacity-0 transition-opacity duration-300">
            <div className="w-5 h-1 bg-white/50 rounded-full"></div>
          </div>
          
          {/* 오른쪽 Connected 상태 - 호버 시에만 보임 */}
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400 shadow-lg shadow-green-400/50' : 'bg-red-400'}`}></div>
            <span className={`text-sm font-medium ${connected ? 'text-green-300' : 'text-red-300'}`}>
              {connected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* 풀스크린 비디오 컨테이너 */}
      <div className="absolute inset-0 w-full h-full">
        <video
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/emotier_waiting_loop.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 로고 및 서브타이틀 오버레이 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="flex items-center space-x-8 text-white">
          {/* 왼쪽 SVG 로고 */}
          <div className="flex-shrink-0">
            <img
              src="/Amuse-Oeil.svg"
              alt="Amuse-Oeil Logo"
              width={300}
              height={300}
              className="drop-shadow-2xl"
              style={{ filter: 'drop-shadow(2px 2px 16px rgba(0, 0, 0, 0.8))' }}
            />
          </div>
          
          {/* 오른쪽 서브타이틀 */}
          <div className="text-left">
            <p 
              className="text-2xl font-light text-white/90"
              style={{ textShadow: '1px 1px 12px rgba(0, 0, 0, 0.8)' }}
            >
              Emotier Remua Is Waiting
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}