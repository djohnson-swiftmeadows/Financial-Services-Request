import type { RequestItem } from '../types';

interface ProgressBarProps {
  request: RequestItem;
  onStepClick?: (stepLabel: string) => void;
  interactive?: boolean;
}

export default function ProgressBar({ request, onStepClick, interactive = false }: ProgressBarProps) {
  const completedCount = request.progress.filter((step) => step.status === 'complete').length;
  const totalCount = request.progress.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-wrapper">
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className="progress-bar-steps">
          {request.progress.map((step, index) => (
            <div
              key={step.label}
              className={`progress-bar-step ${step.status} ${interactive ? 'interactive' : ''}`}
              style={{ left: `${(index / (totalCount - 1)) * 100}%` }}
              onClick={() => interactive && onStepClick?.(step.label)}
              role={interactive ? 'button' : undefined}
              tabIndex={interactive ? 0 : undefined}
              onKeyDown={interactive ? (e) => e.key === 'Enter' && onStepClick?.(step.label) : undefined}
            >
              <div className="progress-bar-step-dot" />
            </div>
          ))}
        </div>
      </div>
      <div className="progress-bar-label">
        <span className="progress-percentage">{Math.round(progressPercentage)}% Complete</span>
        <span className="progress-info">
          {completedCount} of {totalCount} steps completed
        </span>
      </div>
    </div>
  );
}
