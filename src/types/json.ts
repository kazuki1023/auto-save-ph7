export interface ContentJson {
  location: string;
  candidates: Candidate[];
  notes: string;
}

export interface Candidate {
  start: string;
  end: string;
}

export interface AnswerJson {
  content: ContentJson;
  notes: string;
}

export interface AnswerContentJson {
  content: ContentJson;
  status: 'pending' | 'accepted' | 'rejected';
}
