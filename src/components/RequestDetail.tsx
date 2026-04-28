import { useState } from 'react';
import type { RequestItem, RequestUpdate } from '../types';
import ProgressBar from './ProgressBar';
import { formatDateTime } from '../utils/dateFormatter';

interface RequestDetailProps {
  request: RequestItem;
  onBack: () => void;
  onUpdateRequest?: (id: string, changes: Partial<RequestItem>) => void;
}

export default function RequestDetail({ request, onBack, onUpdateRequest }: RequestDetailProps) {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);

  const handleAddNote = () => {
    if (noteText.trim() && onUpdateRequest) {
      const newUpdate: RequestUpdate = {
        id: `upd-${Date.now()}`,
        author: 'Current User',
        role: 'Assigned Employee',
        note: noteText,
        attachments: attachmentFiles.map(f => f.name),
        date: formatDateTime(new Date()),
      };

      const updatedUpdates = [...request.updates, newUpdate];
      onUpdateRequest(request.id, {
        updates: updatedUpdates,
        counts: {
          ...request.counts,
          files: request.counts.files + attachmentFiles.length,
          updates: updatedUpdates.length,
        },
      });

      setNoteText('');
      setAttachmentFiles([]);
      setShowNoteForm(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    setAttachmentFiles(prev => [...prev, ...files]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachmentFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setAttachmentFiles(prev => prev.filter((_, i) => i !== index));
  };
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
            <ProgressBar request={request} interactive={true} />
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
              <button type="button" className="primary-button" onClick={() => setShowNoteForm(!showNoteForm)}>
                {showNoteForm ? '✕ Cancel' : '+ Add Note'}
              </button>
            </div>

            {showNoteForm && (
              <div className="note-form">
                <textarea
                  className="note-textarea"
                  placeholder="Add a note or update..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />

                {attachmentFiles.length > 0 && (
                  <div className="attached-files">
                    <p className="attached-files-label">Attached Files ({attachmentFiles.length}):</p>
                    <div className="file-list">
                      {attachmentFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <span className="file-name">{file.name}</span>
                          <button
                            type="button"
                            className="file-remove"
                            onClick={() => removeFile(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="note-form-actions">
                  <div
                    className={`mini-dropzone ${dragActive ? 'active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="note-file-input"
                      multiple
                      onChange={handleFileInput}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="note-file-input" className="mini-dropzone-label">
                      📎 Attach files
                    </label>
                  </div>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                  >
                    Post Note
                  </button>
                </div>
              </div>
            )}

            <div className="note-list">
              {request.updates.length > 0 ? (
                request.updates.map((update) => (
                  <div key={update.id} className="note-item">
                    <div className="note-header">
                      <strong>{update.author}</strong>
                      <span>{update.date}</span>
                    </div>
                    <p>{update.note}</p>
                    {update.attachments.length > 0 && (
                      <div className="note-attachments">
                        <small className="attachment-label">{update.attachments.length} file(s) attached</small>
                        <div className="attachment-list">
                          {update.attachments.map((attachment, idx) => (
                            <div key={idx} className="attachment-item">
                              📄 {attachment}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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
            </div>
            <div
              className={`attachment-dropzone ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                id="main-file-input"
                multiple
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
              <label htmlFor="main-file-input" className="dropzone-label">
                <div>📁 Drag & drop files here or click to browse</div>
              </label>
            </div>

            {attachmentFiles.length > 0 && (
              <div className="pending-attachments">
                <p className="pending-label">Pending Files ({attachmentFiles.length}):</p>
                <div className="pending-files-list">
                  {attachmentFiles.map((file, index) => (
                    <div key={index} className="pending-file-item">
                      <span className="file-name">📄 {file.name}</span>
                      <button
                        type="button"
                        className="file-remove"
                        onClick={() => removeFile(index)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
