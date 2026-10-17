import {
  ArrowLeftRight,
  Binary,
  Braces,
  CalendarClock,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  FileText,
  GitCompare,
  Hash,
  IndianRupee,
  KeyRound,
  LayoutGrid,
  Link as LinkIcon,
  Mail,
  Network,
  QrCode,
  Radar,
  Regex,
  ShieldCheck,
  Webhook,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ArrowLeftRight,
  Binary,
  Braces,
  CalendarClock,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  FileText,
  GitCompare,
  Hash,
  IndianRupee,
  KeyRound,
  LayoutGrid,
  Link: LinkIcon,
  Mail,
  Network,
  QrCode,
  Radar,
  Regex,
  ShieldCheck,
  Webhook,
};

export function ToolIcon({ icon, name }: { icon: string; name: string }) {
  const Icon = iconMap[icon];

  return (
    <span
      aria-hidden='true'
      className='flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated'
    >
      {Icon ? (
        <Icon className='h-4 w-4 text-cream' />
      ) : (
        <span className='text-xs font-semibold text-cream'>
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}
