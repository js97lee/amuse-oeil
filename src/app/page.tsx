"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 모바일 디바이스 감지
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // 모바일이면 자동으로 Controller로 이동
      router.push("/controller");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* 갤러리 스타일 헤더 */}
      <div className="flex justify-between items-center p-6 border-b border-neutral-800">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-sm rounded-sm">
            88
          </div>
          <span className="text-sm text-neutral-400">Current location • Seoul, KR</span>
        </div>
        <div className="w-8 h-8 bg-neutral-800 rounded-full"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="p-6">
        <h1 className="text-4xl font-light mb-8 tracking-wide">Good Morning, Brooklyn...</h1>
        
        {/* 검색 바 */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Q"
            className="w-full pl-10 pr-4 py-3 bg-neutral-900 border border-neutral-800 rounded-sm text-white placeholder-neutral-400 focus:outline-none focus:border-neutral-600"
          />
        </div>

        {/* 카테고리 필터 */}
        <div className="flex space-x-6 mb-8 overflow-x-auto">
          <div className="flex flex-col items-center space-y-2 min-w-0">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="text-xs text-neutral-400">Exhibition</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2 min-w-0">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs text-neutral-400">Event</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2 min-w-0">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <span className="text-xs text-neutral-400">Artwork</span>
          </div>
          
          <div className="flex flex-col items-center space-y-2 min-w-0">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-sm flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-xs text-neutral-400">Artist</span>
          </div>
        </div>

        {/* 섹션 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Experience</h2>
          <span className="text-sm text-neutral-400">See all</span>
        </div>

        {/* 메인 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link href="/controller" className="group">
            <div className="bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-600 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-2xl rounded-sm mx-auto mb-4">
                    🎮
                  </div>
                  <h3 className="text-lg font-medium mb-2">Controller</h3>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">Interactive Controller</h3>
                <p className="text-sm text-neutral-400 mb-3">May 23 - June 23</p>
                <div className="flex items-center text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  <span className="text-sm">Start Experience</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/display" className="group">
            <div className="bg-neutral-900 border border-neutral-800 rounded-sm overflow-hidden hover:border-neutral-600 transition-all duration-300">
              <div className="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-2xl rounded-sm mx-auto mb-4">
                    🖥️
                  </div>
                  <h3 className="text-lg font-medium mb-2">Display</h3>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium mb-2">Gallery Display</h3>
                <p className="text-sm text-neutral-400 mb-3">May 23 - June 20</p>
                <div className="flex items-center text-neutral-400 group-hover:text-neutral-200 transition-colors">
                  <span className="text-sm">View Gallery</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* 하단 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800">
        <div className="flex justify-around py-3">
          <div className="flex flex-col items-center space-y-1">
            <div className="w-6 h-6 bg-white rounded-sm"></div>
            <span className="text-xs text-white">Home</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-neutral-400">Calendar</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className="text-xs text-neutral-400">Cart</span>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs text-neutral-400">Profile</span>
          </div>
        </div>
      </div>
    </main>
  );
}
