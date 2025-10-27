import { X, AlertTriangle, CheckCircle, Info, AlertCircle } from "lucide-react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning", // warning, danger, success, info
  isLoading = false,
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertCircle className="w-8 h-8 text-red-400" />;
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      case "info":
        return <Info className="w-8 h-8 text-blue-400" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-yellow-400" />;
    }
  };

  const getIconBg = () => {
    switch (type) {
      case "danger":
        return "bg-red-500/20 border-red-500/30";
      case "success":
        return "bg-green-500/20 border-green-500/30";
      case "info":
        return "bg-blue-500/20 border-blue-500/30";
      default:
        return "bg-yellow-500/20 border-yellow-500/30";
    }
  };

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-500 hover:bg-red-600";
      case "success":
        return "bg-green-500 hover:bg-green-600";
      case "info":
        return "bg-blue-500 hover:bg-blue-600";
      default:
        return "bg-yellow-500 hover:bg-yellow-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-secondary-800/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full mx-4 border border-white/10 shadow-2xl">
        <div className="text-center">
          <div
            className={`w-16 h-16 ${getIconBg()} border rounded-2xl flex items-center justify-center mx-auto mb-6`}
          >
            {getIcon()}
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

          <p className="text-gray-300 mb-8">{message}</p>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/10 transition-all duration-200 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3 ${getConfirmButtonStyle()} text-white rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processando...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
