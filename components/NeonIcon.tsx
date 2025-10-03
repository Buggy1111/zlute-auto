import { LucideIcon } from 'lucide-react';

interface NeonIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  glow?: 'none' | 'normal' | 'strong';
  strokeWidth?: number;
}

export default function NeonIcon({
  icon: Icon,
  size = 24,
  className = '',
  glow = 'normal',
  strokeWidth = 1.5
}: NeonIconProps) {
  const glowClass = glow === 'strong' ? 'neon-glow-strong' : glow === 'normal' ? 'neon-glow' : '';

  return (
    <Icon
      className={`${glowClass} ${className}`}
      size={size}
      strokeWidth={strokeWidth}
    />
  );
}
