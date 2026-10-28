import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, Users, Plus } from "lucide-react";
import { BACKEND_BASE_URL } from "@/constants";

type TeacherClass = {
  id: number;
  name: string;
  status: string;
  subject: { name: string } | null;
  enrolledCount: number;
};

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/classes/my`)
      .then((res) => res.json())
      .then((json: { data: TeacherClass[] }) => {
        setClasses(json.data ?? []);
        setTotalStudents((json.data ?? []).reduce((sum, c) => sum + (c.enrolledCount ?? 0), 0));
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
        <h1 className="page-title">Teacher Dashboard</h1>
        <Button onClick={() => navigate("/teacher/classes/create")}>
          <Plus className="w-4 h-4 mr-2" />
          New Class
        </Button>
      </div>
      <Separator />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Classes</CardTitle>
            <BookOpen className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.length}</div>
            <p className="text-xs text-muted-foreground">Active classes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all classes</p>
          </CardContent>
        </Card>
      </div>

      {classes.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Recent Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.slice(0, 6).map((cls) => (
              <Card
                key={cls.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(`/teacher/classes/show/${cls.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-base">{cls.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{cls.subject?.name ?? "No subject"}</p>
                  <p className="text-sm mt-1">
                    <Users className="w-3 h-3 inline mr-1" />
                    {cls.enrolledCount} enrolled
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </ListView>
  );
};

export default TeacherDashboard;
