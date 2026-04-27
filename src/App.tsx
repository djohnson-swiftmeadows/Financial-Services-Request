import { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import NewRequestForm from './components/NewRequestForm';
import { requests as initialRequests, summaryCards } from './data';
import type { RequestItem, RequestType, RequestStatus, Role, PriorityLevel } from './types';

export type RequestFilterType = RequestType | 'All Types';

function App() {
  const [view, setView] = useState<'dashboard' | 'newRequest'>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('Requestor');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'All'>('All');
  const [selectedType, setSelectedType] = useState<RequestFilterType>('All Types');
  const [requestList, setRequestList] = useState<RequestItem[]>(initialRequests);

  const filteredRequests = useMemo(() => {
    return requestList.filter((request) => {
      const matchesSearch = [request.id, request.title, request.description, request.requestor, request.manager, request.assignee]
        .join(' ')
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = selectedStatus === 'All' || request.status === selectedStatus;
      const matchesType = selectedType === 'All Types' || request.type === selectedType;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, selectedStatus, selectedType, requestList]);

  const dynamicSummary = useMemo(
    () =>
      summaryCards.map((card) => {
        if (card.label === 'Total') {
          return { ...card, value: String(requestList.length) };
        }

        if (card.label === 'Pending') {
          return {
            ...card,
            value: String(
              requestList.filter((request) =>
                ['Submitted', 'Pending Manager Review'].includes(request.status),
              ).length,
            ),
          };
        }

        if (card.label === 'In Progress') {
          return {
            ...card,
            value: String(
              requestList.filter((request) =>
                ['In-Review', 'Awaiting Approval'].includes(request.status),
              ).length,
            ),
          };
        }

        if (card.label === 'Completed') {
          return { ...card, value: String(requestList.filter((request) => request.status === 'Completed').length) };
        }

        return { ...card, value: String(requestList.filter((request) => request.status === 'Canceled').length) };
      }),
    [requestList],
  );

  const handleCreateRequest = (request: {
    title: string;
    type: RequestType;
    priority: PriorityLevel;
    dueDate: string;
    description: string;
    note: string;
    attachments: string[];
  }) => {
    const id = `FSR-${Date.now().toString().slice(-6)}`;
    const createdAt = new Date().toLocaleDateString('en-US');

    const newRequest: RequestItem = {
      id,
      title: request.title,
      type: request.type,
      status: 'Submitted',
      priority: request.priority,
      dueDate: request.dueDate || 'TBD',
      manager: 'TBD',
      assignee: 'Unassigned',
      requestor: 'Staff Member',
      description: request.description || 'No additional description provided.',
      note: request.note || 'No notes provided.',
      badges: ['Submitted'],
      progress: [
        { label: 'Submitted', status: 'active' },
        { label: 'Pending Manager Review', status: 'pending' },
        { label: 'In-Review', status: 'pending' },
        { label: 'Awaiting Approval', status: 'pending' },
        { label: 'Completed', status: 'pending' },
      ],
      counts: {
        files: request.attachments.length,
        updates: 0,
      },
      updates: [],
      updatedAt: createdAt,
    };

    setRequestList((current) => [newRequest, ...current]);
    setView('dashboard');
  };

  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="logo">FSR</div>
          <div className="brand-text">
            <p>Financial Services Request</p>
          </div>
        </div>
        <nav className="topnav">
          <button className={`nav-button ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}>
            Dashboard
          </button>
          <button className="nav-button">My Requests</button>
          <button className="nav-button">Finance Login</button>
          <button className="nav-button icon">Tools</button>
          <button className="action-button" onClick={() => setView('newRequest')}>
            + New Request
          </button>
        </nav>
      </header>

      <main className="content">
        {view === 'dashboard' ? (
          <Dashboard
            requests={filteredRequests}
            summaryCards={dynamicSummary}
            search={search}
            selectedStatus={selectedStatus}
            selectedType={selectedType}
            currentRole={currentRole}
            onSearch={setSearch}
            onStatusChange={setSelectedStatus}
            onTypeChange={setSelectedType}
            onRoleChange={setCurrentRole}
            onCreateRequest={() => setView('newRequest')}
          />
        ) : (
          <NewRequestForm onBack={() => setView('dashboard')} onSubmit={handleCreateRequest} />
        )}
      </main>
    </div>
  );
}

export default App;
