import { useEffect, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Shield } from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  image: string | null;
};

const StudentProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((json: { data: UserProfile }) => {
        setProfile(json.data ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <ListView>
        <p className="state-message">Loading...</p>
      </ListView>
    );
  }

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Profile</h1>
      <Separator />

      <Card className="max-w-md mt-4">
        <CardHeader>
          <div className="flex items-center gap-4">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
            )}
            <div>
              <CardTitle>{profile?.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {profile?.role}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{profile?.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="capitalize">{profile?.role}</span>
          </div>
        </CardContent>
      </Card>
    </ListView>
  );
};

export default StudentProfile;
