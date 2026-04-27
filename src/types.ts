export type Role = 'Requestor' | 'Frontline Manager' | 'Assigned Employee' | 'Administrator';

export type RequestStatus = 'Submitted' | 'Pending Manager Review' | 'In-Review' | 'Awaiting Approval' | 'Completed' | 'Canceled';

export type RequestType = 'Budget Adjustment / Amendment' | 'New General Ledger / Project Ledger' | 'New Grant' | 'Other Request';

export type PriorityLevel = 'Standard Queue' | 'High Priority' | 'Immediate';

export interface RequestUpdate {
  id: string;
  author: string;
  role: Role;
  note: string;
  attachments: string[];
  date: string;
}

export interface RequestItem {
  id: string;
  title: string;
  type: RequestType;
  status: RequestStatus;
  priority: PriorityLevel;
  dueDate: string;
  manager: string;
  assignee: string;
  requestor: string;
  description: string;
  note: string;
  badges: string[];
  progress: Array<{ label: string; status: 'active' | 'complete' | 'pending' }>;
  counts: {
    files: number;
    updates: number;
  };
  updates: RequestUpdate[];
  updatedAt: string;
}
