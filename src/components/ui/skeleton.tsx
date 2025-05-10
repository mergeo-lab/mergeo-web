import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md opacity-10 bg-muted/30", className)}
      {...props}
    />
  )
}

export { Skeleton }
