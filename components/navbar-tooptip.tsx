// components/nav-tooltip.tsx
"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";

export function NavTooltip({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={200}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="bottom"
            sideOffset={6}
            className="z-50 rounded-md bg-fd-popover px-3 py-1.5 text-xs text-fd-popover-foreground shadow-md border border-fd-border animate-in fade-in-0 zoom-in-95"
          >
            {label}
            <TooltipPrimitive.Arrow className="fill-fd-popover" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
