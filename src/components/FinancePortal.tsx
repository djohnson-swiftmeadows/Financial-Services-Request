import { useMemo, useState } from 'react';
import type { PriorityLevel, RequestItem } from '../types';
import { priorityOptions } from '../data';

type FinanceRole = 'Manager' | 'Assignee' | 'Director';

type ViewMode = 'Dashboard' | 'Flagged Requests' | 'Work Queue' | 'Calendar';

interface FinancePortalProps {
  requests: RequestItem[];
  onUpdateRequest: (id: string, changes: Partial<RequestItem>) => void;
  onReviewRequest: (id: string) => void;
}

export default function FinancePortal({ requests, onUpdateRequest, onReviewRequest }: FinancePortalProps) {
  const [activeRole, setActiveRole] = useState<FinanceRole>('Manager');
  const [viewMode, setViewMode] = useState<ViewMode>('Dashboard');

  const userName = activeRole === 'Manager' ? 'Michael Chen' : activeRole === 'Assignee' ? 'David Kim' : 'Michael Chen (Director)';

  const pendingReviewCount = useMemo(
    () => requests.filter((request) => ['Submitted', 'Pending Manager Review'].includes(request.status)).length,
    [requests],
  );
  const inProgressCount = useMemo(
    () => requests.filter((request) => ['In-Review', 'Awaiting Approval'].includes(request.status)).length,
    [requests],
  );
  const immediateCount = useMemo(() => requests.filter((request) => request.priority === 'Immediate').length, [requests]);
  const completedCount = useMemo(() => requests.filter((request) => request.status === 'Completed').length, [requests]);

  const assigneeRequests = useMemo(
    () => requests.filter((request) => request.assignee === 'David Kim' || request.assignee === 'Assigned'),
    [requests],
  );

  const managerRequests = useMemo(
    () => requests.filter((request) => ['Submitted', 'Pending Manager Review', 'In-Review'].includes(request.status)),
    [requests],
  );

  const managerRequestGroups = useMemo(() => {
    const groups: Record<'Submitted' | 'Pending Manager Review' | 'In-Review', RequestItem[]> = {
      Submitted: [],
      'Pending Manager Review': [],
      'In-Review': [],
    };

    managerRequests.forEach((request) => {
      if (groups[request.status as 'Submitted' | 'Pending Manager Review' | 'In-Review']) {
        groups[request.status as 'Submitted' | 'Pending Manager Review' | 'In-Review'].push(request);
      }
    });

    return groups;
  }, [managerRequests]);

  const directorRequests = requests;
  const approvedCount = useMemo(() => requests.filter((request) => request.status === 'Completed').length, [requests]);
  const returnedCount = useMemo(() => requests.filter((request) => request.status === 'Canceled').length, [requests]);
  const notedCount = useMemo(() => requests.filter((request) => request.status === 'Pending Manager Review').length, [requests]);
  const approvalRate = useMemo(
    () => (requests.length ? Math.round((approvedCount / requests.length) * 100) : 0),
    [approvedCount, requests.length],
  );
  const avgResolution = useMemo(() => {
    const completed = requests.filter((request) => request.status === 'Completed');
    if (!completed.length) return '0d';
    return `${Math.round(5)}d`;
  }, [requests]);

  const handlePriorityChange = (id: string, priority: PriorityLevel) => {
    onUpdateRequest(id, { priority });
  };

  const handleDueDateChange = (id: string, dueDate: string) => {
    onUpdateRequest(id, { dueDate: dueDate || 'TBD' });
  };

  return (
    <div className="finance-portal-shell">
      <div className="finance-portal-header">
        <div>
          <p className="eyebrow">Finance Portal</p>
          <h1>Logged in as {userName}</h1>
        </div>

        <div className="finance-role-group">
          {(['Manager', 'Assignee', 'Director'] as FinanceRole[]).map((role) => (
            <button
              type="button"
              key={role}
              className={`pill-button ${activeRole === role ? 'pill-selected' : ''}`}
              onClick={() => {
                setActiveRole(role);
                setViewMode(role === 'Assignee' ? 'Work Queue' : 'Dashboard');
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <section className="portal-stats-grid">
        <div className="summary-card summary-warning">
          <span className="summary-label">Pending Review</span>
          <span className="summary-value">{pendingReviewCount}</span>
          <span className="summary-icon">!</span>
        </div>
        <div className="summary-card summary-primary">
          <span className="summary-label">In Progress</span>
          <span className="summary-value">{inProgressCount}</span>
          <span className="summary-icon">⟳</span>
        </div>
        <div className="summary-card summary-danger">
          <span className="summary-label">Immediate</span>
          <span className="summary-value">{immediateCount}</span>
          <span className="summary-icon">⚡</span>
        </div>
        <div className="summary-card summary-success">
          <span className="summary-label">Completed</span>
          <span className="summary-value">{completedCount}</span>
          <span className="summary-icon">✔</span>
        </div>
      </section>

      <section className="finance-panel">
        {activeRole === 'Manager' && (
          <div className="portal-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Pending Manager Review</p>
                <h2>Set priority and manage scheduling for requests</h2>
              </div>
            </div>
            <div className="request-list manager-list">
              {(['Submitted', 'Pending Manager Review', 'In-Review'] as const).map((status) => (
                <div key={status} className="status-group">
                  <div className="status-group-heading">
                    <h3>{status}</h3>
                    <span className="status-count">{managerRequestGroups[status].length}</span>
                  </div>
                  {managerRequestGroups[status].length > 0 ? (
                    managerRequestGroups[status].map((request, index) => (
                      <div key={request.id} className="portal-request-row">
                        <div className="portal-request-main">
                          <span className="request-number">#{index + 1}</span>
                          <span className="request-id">{request.id}</span>
                          <span className="status-pill">{request.status}</span>
                          <span className="request-type">{request.type}</span>
                        </div>
                        <div className="portal-request-title">
                          <h3>{request.title}</h3>
                          <div className="request-meta-row">
                            <span>👤 {request.requestor}</span>
                            <span>📅 Due: {request.dueDate}</span>
                          </div>
                        </div>
                        <div className="portal-request-actions">
                          <select value={request.priority} onChange={(event) => handlePriorityChange(request.id, event.target.value as PriorityLevel)}>
                            {priorityOptions.map((option) => (
                              <option key={option.value} value={option.value}>{option.value}</option>
                            ))}
                          </select>
                          <input
                            type="date"
                            value={request.dueDate === 'TBD' ? '' : request.dueDate}
                            onChange={(event) => handleDueDateChange(request.id, event.target.value)}
                          />
                          <button type="button" className="secondary-button" onClick={() => onReviewRequest(request.id)}>
                            Review
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-state">No requests in this queue yet.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeRole === 'Assignee' && (
          <div className="portal-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">My Assigned Requests</p>
                <h2>Drag to reorder your work queue and set estimated completion dates.</h2>
              </div>
              <div className="toggle-group">
                <button type="button" className={`pill-button ${viewMode === 'Work Queue' ? 'pill-selected' : ''}`} onClick={() => setViewMode('Work Queue')}>
                  Work Queue
                </button>
                <button type="button" className={`pill-button ${viewMode === 'Calendar' ? 'pill-selected' : ''}`} onClick={() => setViewMode('Calendar')}>
                  Calendar
                </button>
              </div>
            </div>
            <div className="request-list assignee-list">
              {assigneeRequests.map((request, index) => (
                <div key={request.id} className="portal-request-row">
                  <div className="portal-request-main">
                    <span className="request-number">#{index + 1}</span>
                    <span className="request-id">{request.id}</span>
                    <span className="status-pill">{request.status}</span>
                    <span className="request-type">{request.type}</span>
                  </div>
                  <div className="portal-request-title">
                    <h3>{request.title}</h3>
                    <div className="request-meta-row">
                      <span>👤 {request.requestor}</span>
                      <span>📅 Due: {request.dueDate}</span>
                    </div>
                  </div>
                  <div className="portal-request-actions">
                    <button type="button" className="secondary-button">Set Date</button>
                    <button type="button" className="secondary-button">Assign</button>
                    <button type="button" className="secondary-button" onClick={() => onReviewRequest(request.id)}>
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeRole === 'Director' && (
          <div className="portal-section director-layout">
            <div className="director-summary-grid">
              <div className="summary-card summary-danger">
                <span className="summary-label">Pending</span>
                <span className="summary-value">{pendingReviewCount}</span>
                <span className="summary-icon">⚠️</span>
              </div>
              <div className="summary-card summary-success">
                <span className="summary-label">Resolved</span>
                <span className="summary-value">{completedCount}</span>
                <span className="summary-icon">✔</span>
              </div>
              <div className="summary-card summary-primary">
                <span className="summary-label">Approval Rate</span>
                <span className="summary-value">{approvalRate}%</span>
                <span className="summary-icon">📈</span>
              </div>
              <div className="summary-card summary-purple">
                <span className="summary-label">Avg Resolution</span>
                <span className="summary-value">{avgResolution}</span>
                <span className="summary-icon">⏱</span>
              </div>
            </div>

            <div className="director-panels-grid">
              <div className="detail-panel">
                <h3>Disposition Breakdown</h3>
                <div className="disposition-row">
                  <span>Approved</span>
                  <span>{approvedCount}</span>
                </div>
                <div className="disposition-row">
                  <span>Returned</span>
                  <span>{returnedCount}</span>
                </div>
                <div className="disposition-row">
                  <span>Noted</span>
                  <span>{notedCount}</span>
                </div>
              </div>
              <div className="detail-panel attention-panel">
                <h3>Attention Required</h3>
                <div className="attention-item attention-danger">
                  <span>Immediate Priority</span>
                  <span>{immediateCount}</span>
                </div>
                <div className="attention-item attention-warning">
                  <span>High Priority</span>
                  <span>{requests.filter((request) => request.priority === 'High Priority').length}</span>
                </div>
                <div className="attention-item attention-neutral">
                  <span>Standard Queue</span>
                  <span>{requests.filter((request) => request.priority === 'Standard Queue').length}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
