import type { RequestItem, RequestType, RequestStatus, Role } from '../types';
import RequestCard from './RequestCard';
import { requestTypes, statusFilters } from '../data';

interface MyRequestsProps {
  requests: RequestItem[];
  search: string;
  selectedStatus: RequestStatus | 'All';
  selectedType: RequestType | 'All Types';
  onSearch: (value: string) => void;
  onStatusChange: (status: RequestStatus | 'All') => void;
  onTypeChange: (type: RequestType | 'All Types') => void;
  onOpenRequest: (requestId: string) => void;
}

export default function MyRequests({
  requests,
  search,
  selectedStatus,
  selectedType,
  onSearch,
  onStatusChange,
  onTypeChange,
  onOpenRequest,
}: MyRequestsProps) {
  return (
    <div className="my-requests-shell">
      <div className="my-requests-header">
        <div>
          <p className="eyebrow">My Requests</p>
          <h1>Track and manage your financial service requests</h1>
          <p className="dashboard-copy">View the requests you opened, check status updates, and drill into details for each FSR.</p>
        </div>
      </div>

      <section className="search-filter-bar">
        <div className="search-input-wrapper">
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search requests..."
          />
        </div>

        <div className="filter-controls">
          <div className="select-control">
            <label htmlFor="statusFilter">Status</label>
            <select id="statusFilter" value={selectedStatus} onChange={(event) => onStatusChange(event.target.value as RequestStatus | 'All')}>
              <option value="All">All Statuses</option>
              {statusFilters.map((filter) => (
                filter.value !== 'All' ? <option key={filter.value} value={filter.value}>{filter.label}</option> : null
              ))}
            </select>
          </div>
          <div className="select-control">
            <label htmlFor="typeFilter">Type</label>
            <select id="typeFilter" value={selectedType} onChange={(event) => onTypeChange(event.target.value as RequestType | 'All Types')}>
              {requestTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="request-list compact-list">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} onOpen={() => onOpenRequest(request.id)} />
        ))}
        {requests.length === 0 && <div className="empty-state">No requests match your filters.</div>}
      </section>
    </div>
  );
}
