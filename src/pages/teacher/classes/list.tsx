import { useState } from "react";
import { useNavigate } from "react-router";
import { useTable } from "@refinedev/react-table";
import { useList } from "@refinedev/core";
import { ListView, ListViewHeader } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

type TeacherClass = {
  id: number;
  name: string;
  status: string;
  subject: { name: string } | null;
  teacher: { name: string } | null;
  enrolledCount: number;
};

const columns: ColumnDef<TeacherClass>[] = [
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
    accessorKey: "enrolledCount",
    header: "Enrolled",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/teacher/classes/show/${row.original.id}`)}
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </Button>
      );
    },
  },
];

const TeacherClassesList = () => {
  const [search, setSearch] = useState("");

  const table = useTable<TeacherClass>({
    columns,
    refineCoreProps: {
      resource: "my-classes",
      pagination: { pageSize: 10, mode: "server" },
      filters: {
        permanent: search
          ? [{ field: "name", operator: "contains", value: search }]
          : [],
      },
    },
  });

  return (
    <ListView>
      <ListViewHeader title="My Classes" canCreate />
      <div className="flex gap-2 mt-4">
        <Input
          placeholder="Search classes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <DataTable table={table} />
    </ListView>
  );
};

export default TeacherClassesList;
