import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  icon: LucideIcon;
  onOpen: () => void;
}

export function DesktopIcon({ label, icon: Icon, onOpen }: Props) {
  return (
    <button type="button" className="desktop-icon" onClick={onOpen} aria-label={`Open ${label}`}>
      <Icon aria-hidden="true" size={26} />
      <span>{label}</span>
    </button>
  );
}
