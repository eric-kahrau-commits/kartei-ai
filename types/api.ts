export interface AiOverviewRequest {
  setTitle: string;
  cards: Array<{ front: string; back: string }>;
  length?: 'kurz' | 'mittel' | 'lang';
}

export interface AiOverviewResponse {
  content: string;
  error?: string;
}
