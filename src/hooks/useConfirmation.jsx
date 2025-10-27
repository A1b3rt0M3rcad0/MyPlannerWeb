import { useState } from "react";

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirmar",
    cancelText: "Cancelar",
    type: "warning",
    onConfirm: null,
    onCancel: null,
    isLoading: false,
  });

  const showConfirmation = ({
    title,
    message,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    type = "warning",
    onConfirm,
    onCancel,
  }) => {
    setConfirmation({
      isOpen: true,
      title,
      message,
      confirmText,
      cancelText,
      type,
      onConfirm: () => {
        if (onConfirm) {
          onConfirm();
        }
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) {
          onCancel();
        }
        setConfirmation((prev) => ({ ...prev, isOpen: false }));
      },
      isLoading: false,
    });
  };

  const hideConfirmation = () => {
    setConfirmation((prev) => ({ ...prev, isOpen: false }));
  };

  const setLoading = (loading) => {
    setConfirmation((prev) => ({ ...prev, isLoading: loading }));
  };

  return {
    confirmation,
    showConfirmation,
    hideConfirmation,
    setLoading,
  };
};
