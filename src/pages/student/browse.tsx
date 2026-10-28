import { useState } from "react";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, LogIn } from "lucide-react";

type AvailableClass = {
  id: number;
  name: string;
  status: string;
  subject: { name: string } | null;
  teacher: { name: string } | null;
  capacity: number;
};

const columns: ColumnDef<AvailableClass>[] = [
  {
    accessorKey: "name",
    header: "Class Name",
  },
  {
    accessorKey: "subject.name",
    header: "Subject",
    cell: ({ getValue }) => (getValue() as string) ?? "N/A",
  },
  {
    accessorKey: "teacher.name",
    header: "Teacher",
    cell: ({ getValue }) => (getValue() as string) ?? "N/A",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue() as string;
      return (
        <Badge variant={status === "active" ? "default" : "secondary"}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/classes/show/${row.original.id}`)}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/student/join")}
          >
            <LogIn className="w-4 h-4 mr-1" />
            Join
          </Button>
        </div>
      );
    },
  },
];

const StudentBrowse = () => {
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");

  const { result: subjectsResult } = useList({
    resource: "subjects",
    pagination: { mode: "off" },
  });
  const subjects = subjectsResult?.data ?? [];

  const table = useTable<AvailableClass>({
    columns,
    refineCoreProps: {
      resource: "classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: [
          search
            ? { field: "name", operator: "contains" as const, value: search }
            : null,
          subjectFilter
            ? { field: "subject", operator: "contains" as const, value: subjectFilter }
            : null,
        ].filter((f): f is NonNullable<typeof f> => f !== null),
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="Browse Classes" canCreate={false} />
      <div className="flex gap-2 mt-4 flex-wrap">
        <Input
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={subjectFilter}
          onValueChange={setSubjectFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="All Subjects" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {subjects.map((s: any) => (
              <SelectItem key={s.id} value={s.name}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <DataTable table={table} />
    </ListView>
  );
};

export default StudentBrowse;
