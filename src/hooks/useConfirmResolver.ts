import { useState } from "react";

export default function useConfirmResolver() {
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(
    null,
  );

  const confirm = () => {
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const onConfirm = () => {
    resolver?.(true);
    setResolver(null);
  };

  const onCancel = () => {
    resolver?.(false);
    setResolver(null);
  };

  return { confirm, onConfirm, onCancel };
}
