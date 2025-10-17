// 메모리에 결과 저장 (실제 프로덕션에서는 Redis나 DB 사용)
let currentResult = null;
let lastUpdate = 0;

exports.handler = async (event, context) => {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      // 결과 저장
      currentResult = body;
      lastUpdate = Date.now();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true })
      };
    } catch (error) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid JSON' })
      };
    }
  } else if (event.httpMethod === 'GET') {
    // 결과 조회
    const response = { 
      result: currentResult, 
      lastUpdate,
      hasResult: !!currentResult 
    };
    
    // reset 신호 처리 후 currentResult 초기화
    if (currentResult && currentResult.type === 'reset') {
      currentResult = null;
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } else {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }
};
