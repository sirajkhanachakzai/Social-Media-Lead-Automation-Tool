
export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  CLOSED = 'Closed'
}

export enum Platform {
  INSTAGRAM = 'Instagram',
  FACEBOOK = 'Facebook',
  UNKNOWN = 'Unknown'
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  handle: string;
  platform: Platform;
  interestLevel: number; // 1-10
  summary: string;
  status: LeadStatus;
  createdAt: string;
  lastFollowUp?: string;
}

export interface LeadExtractionResult {
  name: string;
  email: string;
  handle: string;
  platform: Platform;
  interestLevel: number;
  summary: string;
}

export interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  conversionRate: number;
  platformDistribution: { name: string; value: number }[];
}
