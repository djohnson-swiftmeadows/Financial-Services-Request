import { useMemo, useState } from 'react';
import Dashboard from './components/Dashboard';
import FinancePortal from './components/FinancePortal';
import MyRequests from './components/MyRequests';
import NewRequestForm from './components/NewRequestForm';
import RequestDetail from './components/RequestDetail';
import NotificationCenter from './components/NotificationCenter';
import { requests as initialRequests, summaryCards } from './data';
import type { RequestItem, RequestType, RequestStatus, Role, PriorityLevel } from './types';

export type RequestFilterType = RequestType | 'All Types';

function App() {
  const [view, setView] = useState<'dashboard' | 'myRequests' | 'newRequest' | 'requestDetail' | 'financePortal'>('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('Requestor');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'All'>('All');
  const [selectedType, setSelectedType] = useState<RequestFilterType>('All Types');
  const [requestList, setRequestList] = useState<RequestItem[]>(initialRequests);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [nextFsrNumber, setNextFsrNumber] = useState(1); // Starts at 1, will be formatted as 0001

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
              requestList.filter((request) => ['Submitted', 'Pending Manager Review'].includes(request.status)).length,
            ),
          };
        }

        if (card.label === 'In Progress') {
          return {
            ...card,
            value: String(
              requestList.filter((request) => ['In-Review', 'Awaiting Approval'].includes(request.status)).length,
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

  const selectedRequest = selectedRequestId ? requestList.find((request) => request.id === selectedRequestId) : null;

  const handleUpdateRequest = (id: string, changes: Partial<RequestItem>) => {
    setRequestList((current) => current.map((request) => (request.id === id ? { ...request, ...changes } : request)));
  };

  const handleCreateRequest = (request: {
    title: string;
    type: RequestType;
    priority: PriorityLevel;
    dueDate: string;
    description: string;
    note: string;
    attachments: string[];
  }) => {
    const fiscalYear = '26'; // Current fiscal year
    const sequentialNumber = nextFsrNumber.toString().padStart(4, '0');
    const id = `FSR-${fiscalYear}-${sequentialNumber}`;
    setNextFsrNumber(nextFsrNumber + 1);
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
    setSelectedRequestId(id);
    setView('myRequests');
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
          <button className={`nav-button ${view === 'myRequests' ? 'active' : ''}`} onClick={() => setView('myRequests')}>
            My Requests
          </button>
          <button className={`nav-button ${view === 'financePortal' ? 'active' : ''}`} onClick={() => setView('financePortal')}>
            Finance Login
          </button>
          <button className="nav-button icon">Tools</button>
          <button className="action-button" onClick={() => setView('newRequest')}>
            + New Request
          </button>
        </nav>
      </header>

      <main className="content">
        {view === 'dashboard' && (
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
            onOpenRequest={(id) => {
              setSelectedRequestId(id);
              setView('requestDetail');
            }}
          />
        )}

        {view === 'myRequests' && (
          <MyRequests
            requests={filteredRequests}
            search={search}
            selectedStatus={selectedStatus}
            selectedType={selectedType}
            onSearch={setSearch}
            onStatusChange={setSelectedStatus}
            onTypeChange={setSelectedType}
            onOpenRequest={(id) => {
              setSelectedRequestId(id);
              setView('requestDetail');
            }}
          />
        )}

        {view === 'financePortal' && (
          <FinancePortal
            requests={filteredRequests}
            onUpdateRequest={handleUpdateRequest}
            onReviewRequest={(id) => {
              setSelectedRequestId(id);
              setView('requestDetail');
            }}
          />
        )}

        {view === 'requestDetail' && selectedRequest && (
          <RequestDetail request={selectedRequest} onBack={() => setView('myRequests')} />
        )}

        {view === 'newRequest' && <NewRequestForm onBack={() => setView('myRequests')} onSubmit={handleCreateRequest} />}
      </main>

      <NotificationCenter />
    </div>
  );
}

export default App;
