import { useState } from "react";

export function useToast() {
  const [toasts, setToasts] = useState<any[]>([]);
  function toast({ title, description, variant }: { title: string; description?: string; variant?: string }) {
    setToasts((prev) => [...prev, { title, description, variant }]);
    // Thực tế nên dùng thư viện toast UI, ở đây chỉ mock cho đủ hook
    alert(title + (description ? ": " + description : ""));
  }
  return { toast };
}
