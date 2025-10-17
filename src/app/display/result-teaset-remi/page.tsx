"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const checkReset = () => {
      fetch("/api/result")
        .then(res => res.json())
        .then(data => {
          if (data.hasResult && data.result && data.result.type === "reset") {
            router.push("/display");
          }
        })
        .catch(() => {}); // 에러 무시
    };

    const interval = setInterval(checkReset, 1000);
    return () => clearInterval(interval);
  }, [router]);

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
            <div className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"></div>
            <span className="text-sm text-green-300 font-medium">Connected</span>
          </div>
        </div>
      </div>

      {/* 풀스크린 비디오 컨테이너 */}
      <div className="absolute inset-0 w-full h-full">
        <video
          src="/teaset-remi.mp4"
          autoPlay
          loop
          muted
          playsInline
          onError={(e) => console.error("영상 로딩 오류:", e)}
          onLoadStart={() => console.log("영상 로딩 시작")}
          onCanPlay={() => console.log("영상 재생 가능")}
          className="w-full h-full object-cover"
        />
      </div>


      {/* 로고 및 서브타이틀 오버레이 */}
      <div className="absolute top-30 left-1/2 transform -translate-x-1/2 text-center z-10">
        <img
          src="/Amuse-Oeil.svg"
          alt="Amuse-Oeil Logo"
          width={200}
          height={200}
          className="drop-shadow-2xl mx-auto"
          style={{ filter: 'drop-shadow(2px 2px 16px rgba(0, 0, 0, 0.8))' }}
        />
      </div>

    </main>
  );
}
