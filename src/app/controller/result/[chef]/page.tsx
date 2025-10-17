"use client";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

const chefInfo = {
  zen: { name: "ZEN", description: "여기에 ZEN 컨트롤러 전용 연출/설명" },
  nara: { name: "NARA", description: "여기에 NARA 컨트롤러 전용 연출/설명" },
  remi: { name: "REMI", description: "여기에 REMI 컨트롤러 전용 연출/설명" }
};

export default function Page({ params }: { params: { chef: string } }) {
  const router = useRouter();
  const socket: Socket = useMemo(() => io({ path: "/api/socket" }), []);
  
  const chef = params.chef.toLowerCase() as keyof typeof chefInfo;
  const info = chefInfo[chef] || chefInfo.zen;

  useEffect(() => {
    fetch("/api/socket");
    return () => { socket.disconnect(); };
  }, [socket]);

  const resetBoth = () => {
    // API로 리셋 신호 전송
    fetch("/api/result", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "reset", at: Date.now() }),
    });
    
    // Socket으로도 리셋 신호 전송
    socket.emit("reset", { at: Date.now() });
    
    // Controller 페이지로 이동
    router.push("/controller");
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* 헤더 */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-800">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-neutral-400">Controller Result • {info.name}</span>
        </div>
        <div className="inline-flex items-center px-3 py-1 text-xs font-medium bg-neutral-800 text-neutral-300 border border-neutral-700 rounded-sm">
          Result
        </div>
      </div>

       {/* 디저트 플레이트 영상 */}
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div className="relative w-full max-w-4xl">
            <video
              src={`/teaset-${chef}.mp4`}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto rounded-md"
            />
          </div>
        </div>

        {/* 하단 텍스트 패널 - Controller 스타일과 일치 */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border-l border-r border-t border-white/20 rounded-t-[30px] p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4 text-white">Remua's Recommendation</h2>
              <p className="text-lg text-white/90 mb-6 font-medium">Chef. {info.name}</p>
              <p className="text-white/80 leading-relaxed mb-8 text-sm">
                {info.name} 셰프의 특별한 디저트 컬렉션을 경험해보세요. 
                각 디저트는 고유한 의미와 스토리를 담고 있으며, 
                당신의 감정과 어울리는 완벽한 조화를 제공합니다.
              </p>
              
              <div className="flex gap-4">
                <button 
                  className="bg-white/20 border border-white/40 px-6 py-3 rounded-2xl hover:bg-white/30 transition-all duration-300 flex items-center font-medium text-white"
                  onClick={resetBoth}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  다시하기
                </button>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
