import { useEffect, useRef } from 'react';

const Snackbar = ({ toasts, onDismiss }) => {
  const timersRef = useRef(new Map());

  useEffect(() => {
    if (!Array.isArray(toasts)) return undefined;

    const timers = timersRef.current;

    toasts.forEach(toast => {
      if (!timers.has(toast.id)) {
        const timerId = setTimeout(() => {
          timers.delete(toast.id);
          if (typeof onDismiss === 'function') {
            onDismiss(toast.id);
          }
        }, 3500);
        timers.set(toast.id, timerId);
      }
    });

    timers.forEach((timeoutId, id) => {
      if (!toasts.some(toast => toast.id === id)) {
        clearTimeout(timeoutId);
        timers.delete(id);
      }
    });
  }, [toasts, onDismiss]);

  useEffect(() => () => {
    const timers = timersRef.current;
    timers.forEach(timeoutId => clearTimeout(timeoutId));
    timers.clear();
  }, []);

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 flex flex-col items-center gap-2 px-4 pointer-events-none z-50 sm:items-end sm:pr-4">
      <div className="flex flex-col items-stretch gap-2 w-full max-w-sm" aria-live="polite">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-gray-900/95 text-white px-4 py-2 rounded-lg shadow-lg border border-indigo-500/30"
          >
            <p className="text-sm font-medium">{toast.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Snackbar;
