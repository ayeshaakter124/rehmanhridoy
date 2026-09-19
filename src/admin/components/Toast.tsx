import React, { useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) =>
        renderToast(toast, () => onDismiss(toast.id))
      )}
    </div>
  );
}

function renderToast(toast: ToastMessage, onDismiss: () => void) {
  return <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ToastItem: any = ({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle2 className="text-green-400 shrink-0" size={18} />,
    error: <XCircle className="text-red-400 shrink-0" size={18} />,
    warning: <AlertTriangle className="text-amber-400 shrink-0" size={18} />,
    info: <Info className="text-sky-400 shrink-0" size={18} />,
  };

  const borderBg: Record<ToastType, string> = {
    success: "bg-secondary/95 border-green-500/30 text-green-200",
    error: "bg-secondary/95 border-red-500/30 text-red-200",
    warning: "bg-secondary/95 border-amber-500/30 text-amber-200",
    info: "bg-secondary/95 border-sky-500/30 text-sky-200",
  };

  return (
    <div
      className={`pointer-events-auto p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-center justify-between gap-3 text-xs font-medium transition-all ${borderBg[toast.type]}`}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type]}
        <span className="text-text-pure leading-relaxed">{toast.message}</span>
      </div>
      <button
        onClick={onDismiss}
        className="text-text-muted hover:text-text-pure p-1 rounded-lg hover:bg-white/5 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
};
