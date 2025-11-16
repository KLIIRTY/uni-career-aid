import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Trash2 } from "lucide-react";
import { StatusBadge, ApplicationStatus } from "./StatusBadge";
import { format } from "date-fns";

export interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  dateApplied: Date;
  location?: string;
  notes?: string;
}

interface ApplicationCardProps {
  application: Application;
  onDelete: (id: string) => void;
}

export const ApplicationCard = ({ application, onDelete }: ApplicationCardProps) => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="text-lg font-semibold">{application.position}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="w-4 h-4" />
              <span>{application.company}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(application.id)}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(application.dateApplied, "MMM dd, yyyy")}</span>
          </div>
          <StatusBadge status={application.status} />
        </div>
        {application.location && (
          <p className="text-sm text-muted-foreground mt-2">{application.location}</p>
        )}
        {application.notes && (
          <p className="text-sm mt-2 line-clamp-2">{application.notes}</p>
        )}
      </CardContent>
    </Card>
  );
};
