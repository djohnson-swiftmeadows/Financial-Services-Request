import type { RequestItem } from '../types';

interface RequestDetailProps {
  request: RequestItem;
  onBack: () => void;
}

export default function RequestDetail({ request, onBack }: RequestDetailProps) {
  return (
    <div className="request-detail-shell">
      <div className="request-detail-header">
        <button type="button" className="back-button" onClick={onBack}>← Back to My Requests</button>
        <button type="button" className="secondary-button reject-button">Reject Request</button>
      </div>

      <div className="request-detail-card">
        <div className="request-detail-top">
          <div>
            <span className="request-id"># {request.id}</span>
            <span className="status-pill status-pill-detail">{request.status}</span>
            <h1>{request.title}</h1>
            <div className="request-detail-tags">
              <span className="request-type">{request.type}</span>
              <span className="request-meta-pill">Due: {request.dueDate}</span>
              <span className="request-meta-pill">Notifications On</span>
            </div>
          </div>
        </div>

        <div className="request-detail-info-grid">
          <div className="request-detail-block">
            <h2>Progress</h2>
            <div className="progress-detail-line">
              {request.progress.map((step, index) => (
                <div key={step.label} className="progress-detail-step">
                  <div className={`progress-detail-dot ${step.status}`} />
                  <span className="progress-detail-label">{step.label}</span>
                  {index < request.progress.length - 1 && <div className="progress-detail-bar" />}
                </div>
              ))}
            </div>
          </div>

          <div className="request-detail-block">
            <h2>Approval Progress</h2>
            <div className="approval-list">
              {request.progress.map((step, index) => (
                <div key={step.label} className="approval-item">
                  <div className="approval-step-number">{index + 1}</div>
                  <div>
                    <p className="approval-title">{step.label}</p>
                    <span className={`approval-status approval-${step.status}`}>{step.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="request-detail-footer-grid">
          <div className="detail-panel">
            <h3>Summary</h3>
            <p>{request.description}</p>
          </div>
          <div className="detail-panel">
            <h3>Request Information</h3>
            <div className="info-row">
              <span>Request Number</span>
              <strong>{request.id}</strong>
            </div>
            <div className="info-row">
              <span>Requestor</span>
              <strong>{request.requestor}</strong>
            </div>
            <div className="info-row">
              <span>Financial Services Manager</span>
              <strong>{request.manager}</strong>
            </div>
            <div className="info-row">
              <span>Assigned Staff</span>
              <strong>{request.assignee}</strong>
            </div>
            <div className="info-row">
              <span>Priority</span>
              <strong>{request.priority}</strong>
            </div>
          </div>
        </div>

        <div className="detail-panel notes-attachments-grid">
          <div className="notes-panel">
            <div className="notes-header">
              <h3>Notes & Updates</h3>
              <button type="button" className="primary-button">+ Add Note</button>
            </div>
            <div className="note-list">
              {request.updates.length > 0 ? (
                request.updates.map((update) => (
                  <div key={update.id} className="note-item">
                    <div className="note-header">
                      <strong>{update.author}</strong>
                      <span>{update.date}</span>
                    </div>
                    <p>{update.note}</p>
                  </div>
                ))
              ) : (
                <div className="empty-note">No updates yet for this request.</div>
              )}
            </div>
          </div>

          <div className="attachments-panel">
            <div className="attachments-header">
              <h3>Attachments</h3>
              <button type="button" className="secondary-button">+</button>
            </div>
            <div className="attachment-dropzone">
              <p>Drag & drop files here or click to browse</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
