import { useMemo, useState, type FormEvent } from 'react';
import { priorityOptions, requestTypeOptions } from '../data';
import { formatDate } from '../utils/dateFormatter';
import type { RequestType, PriorityLevel } from '../types';

interface NewRequestFormProps {
  onBack: () => void;
  onSubmit: (request: { title: string; type: RequestType; priority: PriorityLevel; dueDate: string; description: string; note: string; attachments: string[] }) => void;
}

export default function NewRequestForm({ onBack, onSubmit }: NewRequestFormProps) {
  const [title, setTitle] = useState('');
  const [requestType, setRequestType] = useState<RequestType>('Budget Adjustment / Amendment');
  const [priority, setPriority] = useState<PriorityLevel>('Standard Queue');
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [note, setNote] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const selectedPriority = priorityOptions.find((option) => option.value === priority);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setAttachments((current) => [...current, ...Array.from(files)]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Convert YYYY-MM-DD to DD-MMM-YYYY format
    const formattedDueDate = dueDate ? formatDate(new Date(dueDate)) : '';
    onSubmit({
      title,
      type: requestType,
      priority,
      dueDate: formattedDueDate,
      description,
      note,
      attachments: attachments.map((file) => file.name),
    });
  };

  const attachmentCount = useMemo(() => attachments.length, [attachments]);

  return (
    <section className="new-request-page">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back
      </button>

      <div className="form-page-header">
        <h1>Submit a Financial Services Request</h1>
        <p>Use the request form to capture the details needed for manager review and assignment.</p>
      </div>

      <div className="form-card">
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="request-form-heading">
            <div>
              <p className="eyebrow">Request Overview</p>
              <h2>Enter the request details</h2>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Enter a descriptive title for your request"
              required
            />
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="requestType">Request Type *</label>
              <select
                id="requestType"
                value={requestType}
                onChange={(event) => setRequestType(event.target.value as RequestType)}
                required
              >
                {requestTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <div className="field-label-with-note">
                <label htmlFor="priority">Priority</label>
                <span className="field-note">Default: Standard Queue</span>
              </div>
              <select
                id="priority"
                value={priority}
                onChange={(event) => setPriority(event.target.value as PriorityLevel)}
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="hint-text">{selectedPriority?.hint}</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="field-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
              />
            </div>
            <div className="field-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the request and business need"
                rows={4}
              />
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="note">Notes</label>
            <textarea
              id="note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add any additional instructions or context"
              rows={3}
            />
          </div>

          <div className="field-group">
            <label>Attachments</label>
            <label className="upload-dropzone" htmlFor="attachments">
              <div className="upload-icon">⤴</div>
              <div className="dropzone-copy">
                <p className="dropzone-title">Drag and drop files here, or click to browse</p>
                <p className="dropzone-subtitle">Supported formats: PDF, XLSX, DOCX, PNG</p>
              </div>
              <button type="button" className="browse-button">Browse Files</button>
            </label>
            <input
              id="attachments"
              type="file"
              multiple
              onChange={(event) => handleFiles(event.target.files)}
              className="file-input"
            />
            {attachmentCount > 0 && (
              <div className="attachment-list">
                {attachments.map((file, index) => (
                  <span key={`${file.name}-${index}`} className="attachment-item">
                    {file.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="workflow-card">
            <div className="workflow-heading">
              <div className="workflow-icon">i</div>
              <div>
                <h3>Workflow</h3>
              </div>
            </div>
            <ol className="workflow-list">
              <li>Request is submitted and routed to a frontline manager</li>
              <li>Manager reviews details and assigns the correct employee</li>
              <li>Stakeholders track progress through approval stages</li>
              <li>Notes and attachments stay linked to the request</li>
            </ol>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={onBack}>Cancel</button>
            <button type="submit" className="primary-button">Submit Request</button>
          </div>
        </form>
      </div>
    </section>
  );
}
