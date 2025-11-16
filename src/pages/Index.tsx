import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, FileCheck, MessageSquare, XCircle } from "lucide-react";
import { StatsCard } from "@/components/StatsCard";
import { ApplicationCard } from "@/components/ApplicationCard";
import { AddApplicationDialog } from "@/components/AddApplicationDialog";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ApplicationStatus } from "@/components/StatusBadge";

interface Application {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  date_applied: string;
  location?: string;
  notes?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      loadProfile();
      loadApplications();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data);
    }
  };

  const loadApplications = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("date_applied", { ascending: false });

    setLoading(false);

    if (error) {
      toast.error("Error loading applications");
      return;
    }

    if (data) {
      setApplications(data as Application[]);
    }
  };

  const handleAddApplication = async (newApp: Omit<Application, "id" | "date_applied">) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        company: newApp.company,
        position: newApp.position,
        status: newApp.status,
        location: newApp.location || null,
        notes: newApp.notes || null,
      })
      .select()
      .single();

    if (error) {
      toast.error("Error adding application");
      return;
    }

    if (data) {
      setApplications([data as Application, ...applications]);
      toast.success("Application added successfully!");
    }
  };

  const handleDeleteApplication = async (id: string) => {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Error removing application");
      return;
    }

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

  if (authLoading || !user) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={{ email: user.email, ...profile }} />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Applications</h2>
            <p className="text-muted-foreground">
              Track and manage your job search progress
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
          className="max-w-md mb-6"
        />

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={{
                    ...application,
                    dateApplied: new Date(application.date_applied),
                  }}
                  onDelete={handleDeleteApplication}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchQuery
                    ? "No applications found matching your search"
                    : "No applications yet. Add your first one to get started!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
