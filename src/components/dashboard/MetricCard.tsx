import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'neutral';
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  className?: string;
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon,
  variant = 'default',
  className 
}: MetricCardProps) {
  const trendColors = {
    up: 'text-success',
    down: 'text-destructive',
    neutral: 'text-muted-foreground'
  };

  const variantStyles = {
    default: 'border-border',
    primary: 'border-primary/30 bg-primary/5',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    destructive: 'border-destructive/30 bg-destructive/5',
  };

  return (
    <div className={cn(
      "glass-panel p-5 card-hover",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-start justify-between mb-3">
        <span className="metric-label">{title}</span>
        {icon && (
          <div className="p-2 rounded-lg bg-muted/50">
            {icon}
          </div>
        )}
      </div>
      
      <div className="metric-value text-foreground mb-1">
        {value}
      </div>
      
      <div className="flex items-center gap-2">
        {subtitle && (
          <span className="text-sm text-muted-foreground">{subtitle}</span>
        )}
        {trend && (
          <div className={cn("flex items-center gap-1 text-sm", trendColors[trend.direction])}>
            {trend.direction === 'up' && <TrendingUp className="w-3 h-3" />}
            {trend.direction === 'down' && <TrendingDown className="w-3 h-3" />}
            {trend.direction === 'neutral' && <Minus className="w-3 h-3" />}
            <span>{trend.value}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
