import { NextRequest, NextResponse } from "next/server";

// 메모리에 결과 저장 (실제 프로덕션에서는 Redis나 DB 사용)
let currentResult: any = null;
let lastUpdate = 0;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 결과 저장
    currentResult = body;
    lastUpdate = Date.now();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}

export async function GET() {
  // 결과 조회
  const response = { 
    result: currentResult, 
    lastUpdate,
    hasResult: !!currentResult 
  };
  
  // reset 신호 처리 후 currentResult 초기화
  if (currentResult && currentResult.type === "reset") {
    currentResult = null;
  }
  
  return NextResponse.json(response);
}
