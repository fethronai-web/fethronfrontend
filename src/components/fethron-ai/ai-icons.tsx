import type { ComponentType } from "react";
import {
  ArrowUp,
  BookOpen,
  Check,
  ChevronDown,
  CircleUser,
  Image,
  LogIn,
  LogOut,
  MessageSquare,
  PanelLeft,
  Moon,
  Paperclip,
  Plus,
  Rocket,
  ShieldCheck,
  Sun,
  type LucideProps,
} from "lucide-react";
import type { AiToolId } from "@/config/ai-tools";

const TOOL_ICONS = {
  "sentinel-audit": ShieldCheck,
  "vision-to-launch": Rocket,
} as const satisfies Record<AiToolId, ComponentType<LucideProps>>;

export function ToolIcon({
  id,
  size = 16,
  className,
}: {
  id: AiToolId;
  size?: number;
  className?: string;
}) {
  const Icon = TOOL_ICONS[id];
  return <Icon size={size} strokeWidth={2} className={className} aria-hidden />;
}

export function AttachFileIcon(props: LucideProps) {
  return <Paperclip strokeWidth={2} {...props} />;
}

export function AttachPhotoIcon(props: LucideProps) {
  return <Image strokeWidth={2} {...props} />;
}

export function SendIcon(props: LucideProps) {
  return <ArrowUp strokeWidth={2.25} {...props} />;
}

export function ChevronDownIcon(props: LucideProps) {
  return <ChevronDown strokeWidth={2} {...props} />;
}

export function CheckIcon(props: LucideProps) {
  return <Check strokeWidth={2.5} {...props} />;
}

export function LogInIcon(props: LucideProps) {
  return <LogIn strokeWidth={2} {...props} />;
}

export function UserCircleIcon(props: LucideProps) {
  return <CircleUser strokeWidth={2} {...props} />;
}

export function DocsIcon(props: LucideProps) {
  return <BookOpen strokeWidth={2} {...props} />;
}

export function LogOutIcon(props: LucideProps) {
  return <LogOut strokeWidth={2} {...props} />;
}

export function SidebarToggleIcon(props: LucideProps) {
  return <PanelLeft strokeWidth={2} {...props} />;
}

export function NewChatIcon(props: LucideProps) {
  return <Plus strokeWidth={2} {...props} />;
}

export function ChatsIcon(props: LucideProps) {
  return <MessageSquare strokeWidth={2} {...props} />;
}

export function MoonIcon(props: LucideProps) {
  return <Moon strokeWidth={2} {...props} />;
}

export function SunIcon(props: LucideProps) {
  return <Sun strokeWidth={2} {...props} />;
}
