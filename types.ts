export enum AppTab {
  LIVE_AUDIO = 'LIVE_AUDIO',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  SMART_CHAT = 'SMART_CHAT',
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  image?: string; // base64
}

export interface AudioVisualizerData {
  volume: number;
}
