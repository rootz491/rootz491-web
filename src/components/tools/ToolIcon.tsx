import {
  ArrowLeftRight,
  AtSign,
  BadgeCheck,
  Binary,
  Bot,
  Braces,
  CalendarClock,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  FileBadge,
  FileCheck,
  FileCode,
  FileSearch,
  FileText,
  Fingerprint,
  GitCompare,
  Globe,
  GlobeLock,
  Hash,
  IndianRupee,
  KeyRound,
  KeySquare,
  LayoutGrid,
  Link as LinkIcon,
  Lock,
  LockKeyhole,
  Mail,
  MailCheck,
  Megaphone,
  MonitorSmartphone,
  Network,
  Palette,
  QrCode,
  Radar,
  Regex,
  Route,
  ScanSearch,
  Server,
  Shield,
  ShieldCheck,
  Signature,
  Smartphone,
  Store,
  Webhook,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  ArrowLeftRight,
  AtSign,
  BadgeCheck,
  Binary,
  Bot,
  Braces,
  CalendarClock,
  ClipboardPaste,
  Clock,
  CornerDownRight,
  FileBadge,
  FileCheck,
  FileCode,
  FileSearch,
  FileText,
  Fingerprint,
  GitCompare,
  Globe,
  GlobeLock,
  Hash,
  IndianRupee,
  KeyRound,
  KeySquare,
  LayoutGrid,
  Link: LinkIcon,
  Lock,
  LockKeyhole,
  Mail,
  MailCheck,
  Megaphone,
  MonitorSmartphone,
  Network,
  Palette,
  QrCode,
  Radar,
  Regex,
  Route,
  ScanSearch,
  Server,
  Shield,
  ShieldCheck,
  Signature,
  Smartphone,
  Store,
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
