import { useEffect, useState } from "react";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { BACKEND_BASE_URL } from "@/constants";

type DashboardData = {
  counts: {
    users: number;
    teachers: number;
    students: number;
    departments: number;
    subjects: number;
    classes: number;
    enrollments: number;
  };
  enrollmentTrends: { month: string; count: number }[];
  classesByDept: { department: string; count: number }[];
  capacityStatus: { full: number; nearlyFull: number; available: number };
  userDistribution: { admin: number; teacher: number; student: number };
  keyMetrics: { avgClassSize: number; utilizationRate: number };
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_BASE_URL}/api/dashboard`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        return res.json();
      })
      .then((json: DashboardData) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <ListView>
        <p className="state-message">Loading dashboard...</p>
      </ListView>
    );
  }

  if (error || !data) {
    return (
      <ListView>
        <p className="state-message">Failed to load dashboard data.</p>
      </ListView>
    );
  }

  const capacityChartData = [
    { name: "Available", value: data.capacityStatus.available },
    { name: "Nearly Full", value: data.capacityStatus.nearlyFull },
    { name: "Full", value: data.capacityStatus.full },
  ];

  const userDistChartData = [
    { name: "Admin", value: data.userDistribution.admin },
    { name: "Teacher", value: data.userDistribution.teacher },
    { name: "Student", value: data.userDistribution.student },
  ];

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Dashboard</h1>
      <div className="intro-row">
        <p>Quick access to essential metrics and management tools</p>
      </div>
      <Separator />

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.users}</div>
            <p className="text-xs text-muted-foreground">
              {data.counts.teachers} teachers · {data.counts.students} students
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.counts.classes}</div>
            <p className="text-xs text-muted-foreground">
              {data.counts.subjects} subjects
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.counts.departments}
            </div>
            <p className="text-xs text-muted-foreground">
              {data.counts.subjects} subjects total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.counts.enrollments}
            </div>
            <p className="text-xs text-muted-foreground">
              Avg {data.keyMetrics.avgClassSize} per class
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Average Class Size
                </span>
                <Badge variant="outline">{data.keyMetrics.avgClassSize}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Utilization Rate
                </span>
                <Badge variant="outline">
                  {data.keyMetrics.utilizationRate}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Subjects
                </span>
                <Badge variant="outline">{data.counts.subjects}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Total Departments
                </span>
                <Badge variant="outline">{data.counts.departments}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Enrollment Trends */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Enrollment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.enrollmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Classes by Department */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Classes by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.classesByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Capacity Status */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Class Capacity Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={capacityChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {capacityChartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* User Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#82ca9d"
                  dataKey="value"
                >
                  {userDistChartData.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ListView>
  );
};

export default Dashboard;