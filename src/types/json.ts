// https://t28.dev/blog/safety-json-parsing
// jsonのパースを安全に行うための型定義
// repository層で取得したcontent_jsonをこれを用いて、型安全にparseする
export interface ContentJson {
  location?: string;
  candidates: Candidate[];
  notes?: string;
}

export interface Candidate {
  start: string;
  end: string;
}

export interface AnswerJson {
  content: ContentJson;
  notes?: string;
}

export interface AnswerContentJson {
  content: ContentJson;
  status: 'pending' | 'accepted' | 'rejected';
}

// 型ガード関数：Candidateかどうかをチェック
function isCandidate(obj: unknown): obj is Candidate {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'start' in obj &&
    'end' in obj &&
    typeof obj.start === 'string' &&
    typeof obj.end === 'string'
  );
}

// 型ガード関数：ContentJsonかどうかをチェック
function isContentJson(obj: unknown): obj is ContentJson {
  if (typeof obj !== 'object' || obj === null) return false;

  const record = obj as Record<string, unknown>;

  return (
    'candidates' in record &&
    Array.isArray(record.candidates) &&
    record.candidates.every(isCandidate) &&
    (record.location === undefined || typeof record.location === 'string') &&
    (record.notes === undefined || typeof record.notes === 'string')
  );
}

// 型ガード関数：AnswerContentJsonかどうかをチェック
function isAnswerContentJson(obj: unknown): obj is AnswerContentJson {
  if (typeof obj !== 'object' || obj === null) return false;

  const record = obj as Record<string, unknown>;

  return (
    'content' in record &&
    'status' in record &&
    isContentJson(record.content) &&
    (record.status === 'pending' ||
      record.status === 'accepted' ||
      record.status === 'rejected')
  );
}

// 安全なJSONパース関数
function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// ContentJsonの安全なパース関数
export function ContentJsonParse(json: string): ContentJson | null {
  const parsed = safeJsonParse(json);

  if (isContentJson(parsed)) {
    return parsed;
  }

  return null;
}

// AnswerContentJsonの安全なパース関数
export function AnswerContentJsonParse(json: string): AnswerContentJson | null {
  const parsed = safeJsonParse(json);

  if (isAnswerContentJson(parsed)) {
    return parsed;
  }

  return null;
}
