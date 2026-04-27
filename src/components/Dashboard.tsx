import type { RequestItem, RequestType, RequestStatus, Role } from '../types';
import RequestCard from './RequestCard';
import { requestTypes, statusFilters, roles } from '../data';

interface DashboardProps {
  requests: RequestItem[];
  summaryCards: Array<{ label: string; value: string; tone: string; icon: string }>;
  search: string;
  selectedStatus: RequestStatus | 'All';
  selectedType: RequestType | 'All Types';
  currentRole: Role;
  onSearch: (value: string) => void;
  onStatusChange: (status: RequestStatus | 'All') => void;
  onTypeChange: (type: RequestType | 'All Types') => void;
  onRoleChange: (role: Role) => void;
  onCreateRequest: () => void;
}

export default function Dashboard({
  requests,
  summaryCards,
  search,
  selectedStatus,
  selectedType,
  currentRole,
  onSearch,
  onStatusChange,
  onTypeChange,
  onRoleChange,
  onCreateRequest,
}: DashboardProps) {
  return (
    <div className="dashboard-shell">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Financial Services Requests</p>
          <h1>Track every request through submission, review, and completion</h1>
          <p className="dashboard-copy">Submit and monitor requests, assign staff, and manage approvals with full visibility across the workflow.</p>
        </div>

        <div className="dashboard-actions">
          <div className="role-switcher">
            <label htmlFor="role">Role</label>
            <select id="role" value={currentRole} onChange={(event) => onRoleChange(event.target.value as Role)}>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
          <button type="button" className="action-button" onClick={onCreateRequest}>+ New Request</button>
        </div>
      </div>

      <section className="summary-grid">
        {summaryCards.map((card) => (
          <div key={card.label} className={`summary-card summary-${card.tone}`}>
            <span className="summary-icon">{card.icon}</span>
            <span className="summary-value">{card.value}</span>
            <span className="summary-label">{card.label}</span>
          </div>
        ))}
      </section>

      <section className="search-filter-bar">
        <div className="search-input-wrapper">
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search by title, request ID, description, or assignee"
          />
        </div>

        <div className="filter-group">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              className={`chip ${selectedStatus === filter.value ? 'chip-selected' : ''}`}
              onClick={() => onStatusChange(filter.value as RequestStatus | 'All')}
            >
              {filter.label}
              <span className="chip-count">{filter.count}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="type-filters">
        <span className="type-label">Type:</span>
        {requestTypes.map((type) => (
          <button
            key={type}
            className={`type-chip ${selectedType === type ? 'type-chip-selected' : ''}`}
            onClick={() => onTypeChange(type)}
          >
            {type}
          </button>
        ))}
      </section>

      <section className="request-list">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
        {requests.length === 0 && <div className="empty-state">No requests match the selected filters.</div>}
      </section>
    </div>
  );
}
