import type { RequestItem } from './types';

export const roles = ['Requestor', 'Frontline Manager', 'Assigned Employee', 'Administrator'] as const;

export const summaryCards = [
  { label: 'Total', tone: 'neutral', icon: '📄' },
  { label: 'Pending', tone: 'warning', icon: '🕒' },
  { label: 'In Progress', tone: 'purple', icon: '🚧' },
  { label: 'Completed', tone: 'success', icon: '✅' },
  { label: 'Canceled', tone: 'danger', icon: '✖️' },
];

export const requestTypes = [
  'All Types',
  'Budget Adjustment / Amendment',
  'New General Ledger / Project Ledger',
  'New Grant',
  'Other Request',
] as const;

export const requestTypeOptions = [
  'Budget Adjustment / Amendment',
  'New General Ledger / Project Ledger',
  'New Grant',
  'Other Request',
] as const;

export const priorityOptions = [
  { value: 'Standard Queue', label: 'Standard Queue - Normal processing', hint: 'Normal processing queue' },
  { value: 'High Priority', label: 'High Priority - Expedited processing', hint: 'Expedited processing queue' },
  { value: 'Immediate', label: 'Immediate - Urgent attention required', hint: 'Immediate review and response' },
] as const;

export const statusFilters = [
  { label: 'All', value: 'All', count: 13 },
  { label: 'Submitted', value: 'Submitted', count: 4 },
  { label: 'Pending Manager Review', value: 'Pending Manager Review', count: 1 },
  { label: 'In-Review', value: 'In-Review', count: 3 },
  { label: 'Awaiting Approval', value: 'Awaiting Approval', count: 1 },
  { label: 'Completed', value: 'Completed', count: 2 },
  { label: 'Canceled', value: 'Canceled', count: 1 },
] as const;

export const requests: RequestItem[] = [
  {
    id: 'FSR-26-0005',
    title: 'FY2027 Budget Amendment',
    type: 'Budget Adjustment / Amendment',
    status: 'Submitted',
    priority: 'Standard Queue',
    dueDate: '2026-05-18',
    manager: 'TBD',
    assignee: 'Unassigned',
    requestor: 'Jordan Lee',
    description: 'Adjust FY2027 budget to reflect updated revenue projections and priority spending changes.',
    note: 'Awaiting frontline manager review and assignment.',
    badges: ['Submitted'],
    progress: [
      { label: 'Submitted', status: 'active' },
      { label: 'Pending Manager Review', status: 'pending' },
      { label: 'In-Review', status: 'pending' },
      { label: 'Awaiting Approval', status: 'pending' },
      { label: 'Completed', status: 'pending' },
    ],
    counts: {
      files: 1,
      updates: 0,
    },
    updates: [],
    updatedAt: '5/18/2026',
  },
  {
    id: 'FSR-26-0002',
    title: 'New Project Account for Digital Transformation',
    type: 'New General Ledger / Project Ledger',
    status: 'Awaiting Approval',
    priority: 'High Priority',
    dueDate: '2026-05-13',
    manager: 'Michael Chen',
    assignee: 'Sarah Johnson',
    requestor: 'David Kim',
    description: 'Create a new project ledger account for the digital transformation initiative.',
    note: 'Submitted by David Kim. Awaiting final approval after manager review.',
    badges: ['Awaiting Approval'],
    progress: [
      { label: 'Submitted', status: 'complete' },
      { label: 'Pending Manager Review', status: 'complete' },
      { label: 'In-Review', status: 'complete' },
      { label: 'Awaiting Approval', status: 'active' },
      { label: 'Completed', status: 'pending' },
    ],
    counts: {
      files: 2,
      updates: 3,
    },
    updates: [
      {
        id: 'upd-1',
        author: 'Michael Chen',
        role: 'Frontline Manager',
        note: 'Reviewing scope and verifying account structure.',
        attachments: ['project-plan.pdf'],
        date: '2026-04-24',
      },
    ],
    updatedAt: '5/13/2026',
  },
];
