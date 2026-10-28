import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, LogIn, Plus } from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";

type EnrolledClass = {
  id: number;
  name: string;
  subject: { name: string } | null;
  teacher: { name: string } | null;
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/classes/enrolled`)
      .then((res) => res.json())
      .then((json: { data: EnrolledClass[] }) => {
        setClasses(json.data ?? []);
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
      <div className="flex items-center justify-between">
        <h1 className="page-title">My Learning</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/student/browse")}>
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Classes
          </Button>
          <Button onClick={() => navigate("/student/join")}>
            <LogIn className="w-4 h-4 mr-2" />
            Join Class
          </Button>
        </div>
      </div>
      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Classes</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
      </div>

      {classes.length > 0 ? (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">My Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Card
                key={cls.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/student/classes/show/${cls.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{cls.subject?.name ?? "No subject"}</p>
                  <p className="text-sm text-muted-foreground">
                    {cls.teacher?.name ?? "No teacher"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6 text-center text-muted-foreground">
          <p>You are not enrolled in any classes yet.</p>
          <Button className="mt-4" onClick={() => navigate("/student/browse")}>
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Available Classes
          </Button>
        </div>
      )}
    </ListView>
  );
};

export default StudentDashboard;
