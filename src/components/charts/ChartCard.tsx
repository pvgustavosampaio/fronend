
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartCardProps {
  title: string;
  description?: string;
  tooltip?: string;
  className?: string;
  children: React.ReactNode;
  headerClassName?: string;
  contentClassName?: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  description,
  tooltip,
  className,
  children,
  headerClassName,
  contentClassName
}) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className={cn("flex flex-row items-center justify-between space-y-0 pb-2", headerClassName)}>
        <div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </CardHeader>
      <CardContent className={cn("pt-4", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default ChartCard;
