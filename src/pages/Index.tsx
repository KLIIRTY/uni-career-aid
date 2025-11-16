import { useState } from "react";
import { Briefcase, FileCheck, MessageSquare, XCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ApplicationCard, Application } from "@/components/ApplicationCard";
import { AddApplicationDialog } from "@/components/AddApplicationDialog";
import { Input } from "@/components/ui/input";
import { ApplicationStatus } from "@/components/StatusBadge";
import { toast } from "sonner";

const Index = () => {
  const [applications, setApplications] = useState<Application[]>([
    {
      id: "1",
      company: "Google",
      position: "Software Engineer Intern",
      status: "interview",
      dateApplied: new Date("2024-01-15"),
      location: "Mountain View, CA",
      notes: "Completed online assessment, waiting for technical interview",
    },
    {
      id: "2",
      company: "Meta",
      position: "Data Science Intern",
      status: "applied",
      dateApplied: new Date("2024-01-20"),
      location: "Menlo Park, CA",
    },
    {
      id: "3",
      company: "Amazon",
      position: "Product Manager Intern",
      status: "offer",
      dateApplied: new Date("2024-01-10"),
      location: "Seattle, WA",
      notes: "Received verbal offer, waiting for formal letter",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleAddApplication = (newApp: Omit<Application, "id">) => {
    const application: Application = {
      ...newApp,
      id: Date.now().toString(),
    };
    setApplications([application, ...applications]);
    toast.success("Application added successfully!");
  };

  const handleDeleteApplication = (id: string) => {
    setApplications(applications.filter((app) => app.id !== id));
    toast.success("Application removed");
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    interview: applications.filter((app) => app.status === "interview").length,
    offer: applications.filter((app) => app.status === "offer").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">Job Application Tracker</h1>
              <p className="text-muted-foreground">
                Manage your job search and track applications in one place
              </p>
            </div>
            <AddApplicationDialog onAdd={handleAddApplication} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard title="Total Applications" value={stats.total} icon={Briefcase} />
            <StatsCard
              title="Interviews"
              value={stats.interview}
              icon={MessageSquare}
              variant="warning"
            />
            <StatsCard title="Offers" value={stats.offer} icon={FileCheck} variant="success" />
            <StatsCard
              title="Rejected"
              value={stats.rejected}
              icon={XCircle}
              variant="destructive"
            />
          </div>

          <Input
            placeholder="Search by company or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onDelete={handleDeleteApplication}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                {searchQuery ? "No applications found matching your search" : "No applications yet. Add your first one to get started!"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
