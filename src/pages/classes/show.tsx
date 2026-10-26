import { AdvancedImage } from "@cloudinary/react";
import { useShow, useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { useState, useCallback, useRef, useEffect } from "react";
import { useParams } from "react-router";

import { DataTable } from "@/components/refine-ui/data-table/data-table";
import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { bannerPhoto } from "@/lib/cloudinary";
import { ClassDetails, User } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";

type ClassUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
};

const ClassesShow = () => {
  const { id } = useParams();
  const classId = id ?? "";

  const { query } = useShow<ClassDetails>({
    resource: "classes",
  });

  const classDetails = query.data?.data;
  const capacity = classDetails?.capacity ?? 50;

  // Fetch available students for enrollment dialog
  const { query: studentsQuery } = useList<User>({
    resource: "users",
    filters: [{ field: "role", operator: "eq", value: "student" }],
    pagination: { pageSize: 100 },
    queryOptions: { enabled: false },
  });
  const availableStudents = studentsQuery.data?.data || [];

  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [searchStudent, setSearchStudent] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // Use a ref to avoid circular dependency with studentsTable
  const tableRef = useRef<any>(null);

  const studentsTable = useTable<ClassUser>({
    columns: [
      {
        id: "name",
        accessorKey: "name",
        size: 240,
        header: () => <p className="column-title">Student</p>,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Avatar className="size-7">
              {row.original.image && (
                <AvatarImage
                  src={row.original.image}
                  alt={row.original.name}
                />
              )}
              <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
              <span className="truncate">{row.original.name}</span>
              <span className="text-xs text-muted-foreground truncate">
                {row.original.email}
              </span>
            </div>
          </div>
        ),
      },
      {
        id: "actions",
        size: 100,
        header: () => <p className="column-title">Actions</p>,
        cell: ({ row }) => (
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              try {
                const res = await fetch(
                  `${BACKEND_BASE_URL}/api/classes/${classId}/enrollments/${row.original.id}`,
                  { method: "DELETE" }
                );
                if (!res.ok) throw new Error("Failed to unenroll");
                if (tableRef.current) tableRef.current.refineCore.invalidate();
              } catch (err) {
                console.error("Unenrollment error:", err);
              }
            }}
          >
            Unenroll
          </Button>
        ),
      },
    ],
    refineCoreProps: {
      resource: `classes/${classId}/users`,
      pagination: {
        pageSize: 3,
        mode: "server",
      },
      filters: {
        permanent: [
          {
            field: "role",
            operator: "eq",
            value: "student",
          },
        ],
      },
    },
  });

  useEffect(() => {
    tableRef.current = studentsTable;
  }, [studentsTable]);

  const enrolledCount = studentsTable.refineCore.tableQuery.data?.pagination?.total ?? 0;
  const isFull = enrolledCount >= capacity;

  const handleEnroll = useCallback(async () => {
    if (!selectedStudentId) return;
    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}/api/classes/${classId}/enrollments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ studentId: selectedStudentId }),
        }
      );
      if (!res.ok) throw new Error("Failed to enroll");
      if (tableRef.current) tableRef.current.refineCore.invalidate();
      setEnrollDialogOpen(false);
      setSelectedStudentId("");
      setSearchStudent("");
    } catch (err) {
      console.error("Enrollment error:", err);
    }
  }, [selectedStudentId, classId]);

  const filteredStudents = availableStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  if (query.isLoading || query.isError || !classDetails) {
    return (
      <ShowView className="class-view class-show">
        <ShowViewHeader resource="classes" title="Class Details" />
        <p className="state-message">
          {query.isLoading
            ? "Loading class details..."
            : query.isError
            ? "Failed to load class details."
            : "Class details not found."}
        </p>
      </ShowView>
    );
  }

  const teacherName = classDetails.teacher?.name ?? "Unknown";
  const teacherInitials = teacherName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    teacherInitials || "NA"
  )}`;

  return (
    <ShowView className="class-view class-show space-y-6">
      <ShowViewHeader resource="classes" title="Class Details" />

      <div className="banner">
        {classDetails.bannerUrl ? (
          classDetails.bannerUrl.includes("res.cloudinary.com") &&
          classDetails.bannerCldPubId ? (
            <AdvancedImage
              cldImg={bannerPhoto(
                classDetails.bannerCldPubId ?? "",
                classDetails.name
              )}
              alt="Class Banner"
            />
          ) : (
            <img
              src={classDetails.bannerUrl}
              alt={classDetails.name}
              loading="lazy"
            />
          )
        ) : (
          <div className="placeholder" />
        )}
      </div>

      <Card className="details-card">
        {/* Class Details */}
        <div>
          <div className="details-header">
            <div>
              <h1>{classDetails.name}</h1>
              <p>{classDetails.description}</p>
            </div>

            <div>
              <Badge variant="outline">
                {enrolledCount}/{capacity} spots
              </Badge>
              {isFull && (
                <Badge variant="destructive">Full</Badge>
              )}
              <Badge
                variant={
                  classDetails.status === "active" ? "default" : "secondary"
                }
                data-status={classDetails.status}
              >
                {classDetails.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          <div className="details-grid">
            <div className="instructor">
              <p>👨‍🏫 Instructor</p>
              <div>
                <img
                  src={classDetails.teacher?.image ?? placeholderUrl}
                  alt={teacherName}
                />

                <div>
                  <p>{teacherName}</p>
                  <p>{classDetails?.teacher?.email}</p>
                </div>
              </div>
            </div>

            <div className="department">
              <p>🏛️ Department</p>

              <div>
                <p>{classDetails?.department?.name}</p>
                <p>{classDetails?.department?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subject Card */}
        <div className="subject">
          <p>📚 Subject</p>

          <div>
            <Badge variant="outline">
              Code: <span>{classDetails?.subject?.code}</span>
            </Badge>
            <p>{classDetails?.subject?.name}</p>
            <p>{classDetails?.subject?.description}</p>
          </div>
        </div>

        <Separator />
      </Card>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Enrolled Students</CardTitle>
          <Dialog
            open={enrollDialogOpen}
            onOpenChange={(open) => {
              setEnrollDialogOpen(open);
              if (!open) {
                setSearchStudent("");
                setSelectedStudentId("");
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm" disabled={isFull}>
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Enroll a Student</DialogTitle>
                <DialogDescription>
                  Search for a student and select them to enroll in this class.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Search by name or email..."
                value={searchStudent}
                onChange={(e) => {
                  setSearchStudent(e.target.value);
                  setSelectedStudentId("");
                }}
                onFocus={() =>
                  studentsQuery.refetch()
                }
              />
              <div className="max-h-60 overflow-y-auto space-y-1">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                      selectedStudentId === student.id
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedStudentId(student.id)}
                  >
                    <Avatar className="size-7">
                      {student.image && (
                        <AvatarImage
                          src={student.image}
                          alt={student.name}
                        />
                      )}
                      <AvatarFallback>
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {student.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {student.email}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEnrollDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEnroll}
                  disabled={!selectedStudentId}
                >
                  Enroll
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {studentsTable.refineCore.tableQuery.isError ? (
            <p className="state-message">Failed to load students.</p>
          ) : (
            <DataTable table={studentsTable} paginationVariant="simple" />
          )}
        </CardContent>
      </Card>
    </ShowView>
  );
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0] ?? ""}${
    parts[parts.length - 1][0] ?? ""
  }`.toUpperCase();
};

export default ClassesShow;