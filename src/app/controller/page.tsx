"use client";

import { useEffect, useState } from "react";
import data from "@/data/questions.json";
import { useRouter } from "next/navigation";

type Choice = { label: string; payload: string; score: Record<string, number | undefined> };
type Question = { id: string; text: string; multi: boolean; choices: Choice[] };
type Questionnaire = {
  chefs: string[];
  tiebreak_priority: string[];
  tiebreak_fallback_order: string[];
  questions: Question[];
};

type Result = {
  winner: string;
  total: Record<string, number>;
};

export default function Page() {
  const d = data as Questionnaire;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [touched, setTouched] = useState(false); // 유효성 메시지 노출 제어
  const [fadeKey, setFadeKey] = useState(0);     // 간단한 전환 트리거
  const [result, setResult] = useState<Result | null>(null); // 제출 후 컨트롤러에도 결과 표시

  const router = useRouter();
  // 결과 랜딩 경로 매핑
  const controllerRouteMap: Record<string, string> = {
    Zen: "controller/result/zen",
    Nara: "controller/result/nara",
    Remi: "controller/result/remi",
  };
  const displayRouteMap: Record<string, string> = {
    Zen: "result-teaset-zen",
    Nara: "result-teaset-nara",
    Remi: "result-teaset-remi",
  };

  const q = d.questions[step];
  const totalSteps = d.questions.length;
  const progress = Math.round(((step + 1) / totalSteps) * 100);

  const toggleChoice = (qid: string, payload: string, multi: boolean) => {
    setSelected(prev => {
      const cur = prev[qid] || [];
      const next = multi
        ? (cur.includes(payload) ? cur.filter(p => p !== payload) : [...cur, payload])
        : [payload];
      return { ...prev, [qid]: next };
    });
  };

  const hasSelection = !!(q && selected[q.id]?.length);
  const nextDisabled = !hasSelection;

  const computeResult = (): Result => {
    const total: Record<string, number> = {};
    d.chefs.forEach(c => (total[c] = 0));

    // 점수 계산
    d.questions.forEach(question => {
      const chosen = selected[question.id] || [];
      chosen.forEach(payload => {
        const choice = question.choices.find(c => c.payload === payload);
        if (choice) {
          Object.entries(choice.score).forEach(([chef, val]) => {
            total[chef] = (total[chef] || 0) + (val ?? 0);
          });
        }
      });
    });

    const max = Math.max(...Object.values(total));
    let tied = d.chefs.filter(c => total[c] === max);

    // 동점 처리
    if (tied.length > 1) {
      for (const prioId of d.tiebreak_priority) {
        const subs: Record<string, number> = {};
        tied.forEach(c => (subs[c] = 0));
        const tq = d.questions.find(x => x.id === prioId);
        if (tq) {
          const chosen = selected[tq.id] || [];
          chosen.forEach(payload => {
            const choice = tq.choices.find(c => c.payload === payload);
            if (choice) {
              Object.entries(choice.score).forEach(([chef, val]) => {
                if (chef in subs) subs[chef] += val ?? 0;
              });
            }
          });
        }
        const subMax = Math.max(...Object.values(subs));
        tied = tied.filter(c => subs[c] === subMax);
        if (tied.length === 1) break;
      }
    }

    const winner = tied.length === 1 
      ? tied[0] 
      : d.tiebreak_fallback_order.find(c => tied.includes(c)) || tied[0];

    return { winner, total };
  };

  const goNext = () => {
    setTouched(false);
    if (step < totalSteps - 1) {
      setStep(s => s + 1);
      setFadeKey(k => k + 1);
    }
  };

  const goPrev = () => {
    setTouched(false);
    if (step > 0) {
      setStep(s => s - 1);
      setFadeKey(k => k + 1);
    }
  };

  const submit = async () => {
    console.log('Submit 함수 시작');
    const r = computeResult();
    console.log('결과 계산 완료:', r);
    setResult(r); // (즉시 라우팅하므로 UI에는 거의 안 보임)

    // API로 결과 전송 (파일 기반)
    try {
      const response = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "result",
          chef: r.winner,
          scores: r.total,
          selections: selected,
          at: Date.now(),
          target: `display/${displayRouteMap[r.winner]}` || "display/display_result_zen",
        }),
      });
      
      if (response.ok) {
        console.log("결과 전송 성공:", r.winner);
      } else {
        console.error("결과 전송 실패:", response.status);
      }
    } catch (error) {
      console.error("결과 전송 실패:", error);
    }

    // 컨트롤러도 각자의 결과 페이지로 이동
    const route = controllerRouteMap[r.winner] || "controller_result_zen";
    console.log('라우팅 시작:', route);
    router.push(`/${route}`);
  };

  const resetSurvey = async () => {
    setSelected({});
    setStep(0);
    setTouched(false);
    setFadeKey(k => k + 1);
    setResult(null);
    
    // API로 리셋 신호 전송 (파일 기반)
    try {
      await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reset", at: Date.now() }),
      });
    } catch (error) {
      console.error("리셋 신호 전송 실패:", error);
    }
  };

  const shareResult = async () => {
    if (!result) return;
    const url = window.location.href.replace("/controller", "/display");
    const text =
      `오늘의 셰프: ${result.winner}\n` +
      `점수: ${Object.entries(result.total)
        .map(([k, v]) => `${k} ${v}`)
        .join(", ")}\n` +
      `보기: ${url}`;
    try {
      // Web Share API 우선
      if (typeof navigator !== "undefined" && "share" in navigator) {
        await (navigator as any).share({ title: "Amuse-Oeil 결과", text, url });
      } else if (typeof navigator !== "undefined" && "clipboard" in navigator) {
        await (navigator as any).clipboard.writeText(text);
        alert("결과를 클립보드에 복사했어요.");
      } else {
        // 최후의 수단
        prompt("아래 내용을 복사하세요", text);
      }
    } catch {
      // 사용자가 공유 취소한 경우 등은 무시
    }
  };

  return (
    <main className="min-h-screen bg-[url('/BG-controller.png')] bg-cover bg-center text-white relative overflow-hidden">
      {/* 벨벳 커튼 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-black-900/40 via-black-800/50 to-black-900/60 backdrop-blur-sm"></div>
      
      {/* iOS 26 스타일 헤더 */}
      <div className="relative z-10 flex justify-between items-center p-6 group">
        {/* 왼쪽 Controller • Active 텍스트 - 호버 시에만 보임 */}
        <div className="flex items-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-8 h-8 bg-white/20 backdrop-blur-md text-white flex items-center justify-center font-bold text-sm rounded-2xl border border-white/30">
            🎮
          </div>
          <span className="text-sm text-white/80 font-medium">Controller • Active</span>
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

      {/* iOS 26 스타일 결과 화면 */}
      {result ? (
        <div className="relative z-10 p-6">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 text-xs font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/20 rounded-2xl mb-4">
                Result
              </div>
              <h1 className="text-4xl font-light mb-6 tracking-wide text-white">{result.winner}</h1>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4 tracking-wide text-center text-white/90">점수 분석</h2>
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(result.total).map(([chef, sc]) => (
                  <div key={chef} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                    <div className="text-sm text-white/70 mb-2">{chef}</div>
                    <div className="text-2xl font-light text-white">{sc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button 
                className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex items-center"
                onClick={resetSurvey}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-white font-medium">다시하기</span>
              </button>
              <button 
                className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-2xl hover:bg-white/15 hover:border-white/30 transition-all duration-300 flex items-center"
                onClick={shareResult}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-white font-medium">공유하기</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-10 p-6">
          {/* iOS 26 스타일 진행바 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="inline-flex items-center px-4 py-2 text-xs font-medium bg-white/10 backdrop-blur-md text-white/90 border border-white/20 rounded-2xl">
                Question {step + 1} / {totalSteps}
              </div>
              <div className="text-sm text-white/80 font-medium">{progress}%</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1">
              <div
                className="h-2 bg-gradient-to-r from-white/60 to-white/80 transition-all duration-500 rounded-xl"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* iOS 26 스타일 질문/선택 영역 - 중앙 정렬 */}
          <div key={fadeKey} className="animate-fadeIn flex items-center justify-center min-h-[60vh]">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl max-w-2xl w-full">
              <div className="mb-8 text-center text-white">
                <div className="text-2xl font-bold tracking-wide leading-relaxed mb-2" dangerouslySetInnerHTML={{ __html: q.text.split('\n')[0].replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}></div>
                {q.text.includes('\n') && (
                  <div className="text-lg font-normal text-white/80" dangerouslySetInnerHTML={{ __html: q.text.split('\n')[1] }}></div>
                )}
              </div>

              {/* 정사각형 버튼 2x2 그리드 */}
              <div className="grid grid-cols-2 gap-4">
                {q.choices.map((c) => {
                  const active = (selected[q.id] || []).includes(c.payload);
                  return (
                    <button
                      key={c.payload}
                      className={`aspect-square text-center transition-all duration-300 p-6 rounded-2xl border backdrop-blur-md flex flex-col items-center justify-center ${
                        active 
                          ? 'bg-white/20 border-white/40 shadow-lg shadow-white/10' 
                          : 'bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30'
                      }`}
                      onClick={() => {
                        toggleChoice(q.id, c.payload, q.multi);
                        // 단일 선택 시 자동으로 다음 질문으로 진행
                        if (!q.multi) {
                          setTimeout(() => {
                            if (step < totalSteps - 1) {
                              goNext();
                            } else {
                              console.log('마지막 질문 - 결과 제출 시작');
                              submit();
                            }
                          }, 500);
                        }
                      }}
                    >
                      <div className="text-xl tracking-wide text-white">
                        <div className="font-bold text-2xl" dangerouslySetInnerHTML={{ __html: c.label.split('\n')[0] }}></div>
                        {c.label.includes('\n') && (
                          <div className="text-base font-light text-white/70 mt-1" dangerouslySetInnerHTML={{ __html: c.label.split('\n')[1] }}></div>
                        )}
                      </div>
                      {active && (
                        <svg className="w-5 h-5 text-white mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          {/* iOS 26 스타일 유효성 메시지 - 중앙 정렬 */}
          {touched && nextDisabled && (
            <div className="flex justify-center">
              <div className="text-sm text-red-300 p-4 bg-red-500/20 backdrop-blur-md border border-red-400/30 rounded-2xl text-center">
                최소 1개 이상 선택해 주세요.
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}