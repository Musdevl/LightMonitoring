export interface Agent {
  hostname: string;
  ip: string;
  config?: {
    location?: string;
    refreshInterval?: number;
  };
}
