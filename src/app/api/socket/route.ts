import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  // Socket.io는 App Router에서 직접 지원되지 않으므로
  // 간단한 상태 확인 API로 대체
  return NextResponse.json({ 
    status: "connected",
    message: "Socket functionality replaced with simple API"
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 간단한 메시지 처리
    return NextResponse.json({ 
      success: true, 
      message: "Message received",
      data: body 
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
