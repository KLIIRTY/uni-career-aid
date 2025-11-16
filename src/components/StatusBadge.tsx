import { Badge } from "@/components/ui/badge";

export type ApplicationStatus = "applied" | "interview" | "offer" | "rejected";

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    applied: { label: "Applied", className: "bg-primary text-primary-foreground hover:bg-primary/90" },
    interview: { label: "Interview", className: "bg-warning text-warning-foreground hover:bg-warning/90" },
    offer: { label: "Offer", className: "bg-success text-success-foreground hover:bg-success/90" },
    rejected: { label: "Rejected", className: "bg-destructive text-destructive-foreground hover:bg-destructive/90" },
  };

  const config = statusConfig[status];

  return <Badge className={config.className}>{config.label}</Badge>;
};
