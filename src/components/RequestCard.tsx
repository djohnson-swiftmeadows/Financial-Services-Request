import type { RequestItem } from '../types';
import ProgressBar from './ProgressBar';

const statusTone: Record<string, string> = {
  Submitted: 'badge-neutral',
  'Pending Manager Review': 'badge-warning',
  'In-Review': 'badge-purple',
  'Awaiting Approval': 'badge-primary',
  Completed: 'badge-success',
  Canceled: 'badge-danger',
};

const cardAccent: Record<string, string> = {
  Submitted: 'card-accent-neutral',
  'Pending Manager Review': 'card-accent-warning',
  'In-Review': 'card-accent-purple',
  'Awaiting Approval': 'card-accent-primary',
  Completed: 'card-accent-success',
  Canceled: 'card-accent-danger',
};

interface RequestCardProps {
  request: RequestItem;
  onOpen?: () => void;
}

export default function RequestCard({ request, onOpen }: RequestCardProps) {
  return (
    <article
      className={`request-card ${cardAccent[request.status]} ${onOpen ? 'clickable' : ''}`}
      onClick={onOpen}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={onOpen ? (event) => { if (event.key === 'Enter' || event.key === ' ') onOpen(); } : undefined}
    >
      <div className="request-card-header">
        <span className="request-id"># {request.id}</span>
        <span className={`status-pill ${statusTone[request.status]}`}>{request.status}</span>
      </div>

      <div className="request-card-title-group">
        <h2>{request.title}</h2>
        <span className="request-type">{request.type}</span>
      </div>

      <ProgressBar request={request} interactive={true} />

      <div className="progress-line" style={{ display: 'none' }}>
        {request.progress.map((step, index) => (
          <div key={step.label} className="progress-step">
            <div className={`step-dot ${step.status}`} />
            <span className="step-label">{step.label}</span>
            {index < request.progress.length - 1 && <div className="step-connector" />}
          </div>
        ))}
      </div>

      <div className="request-card-meta">
        <div>
          <p className="detail-title">Due Date</p>
          <p>{request.dueDate}</p>
        </div>
        <div>
          <p className="detail-title">Manager</p>
          <p>{request.manager}</p>
        </div>
        <div>
          <p className="detail-title">Assigned</p>
          <p>{request.assignee}</p>
        </div>
        <div>
          <p className="detail-title">Updates</p>
          <p>{request.counts.files} files, {request.updates.length} notes</p>
        </div>
      </div>

      <p className="request-description">{request.description}</p>

      <div className="request-card-footer">
        <span className="request-note">{request.note}</span>
        <span className="request-date">{request.updatedAt}</span>
      </div>
    </article>
  );
}
