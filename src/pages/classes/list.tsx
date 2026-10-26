
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { useMemo, useState } from 'react'
import { Search } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { useTable } from '@refinedev/react-table'
import { useList } from '@refinedev/core'
import { Subject, User } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { ShowButton } from '@/components/refine-ui/buttons/show'

type ClassItem = {
  id: number;
  name: string;
  bannerUrl?: string;
  status: 'active' | 'inactive' | 'archived';
  capacity: number;
  subject?: { name: string };
  teacher?: { name: string };
};

const ClassesList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedTeacher, setSelectedTeacher] = useState('all');

  // Fetch subjects for filter dropdown
  const { query: subjectsQuery } = useList<Subject>({
    resource: 'subjects',
    pagination: { pageSize: 100 },
  });
  const subjects = subjectsQuery.data?.data || [];

  // Fetch teachers for filter dropdown
  const { query: teachersQuery } = useList<User>({
    resource: 'users',
    filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
    pagination: { pageSize: 100 },
  });
  const teachers = teachersQuery.data?.data || [];

  const subjectFilters = selectedSubject === 'all' ? [] : [
    { field: 'subject', operator: 'eq' as const, value: selectedSubject }
  ];

  const teacherFilters = selectedTeacher === 'all' ? [] : [
    { field: 'teacher', operator: 'eq' as const, value: selectedTeacher }
  ];

  const searchFilters = searchQuery ? [
    { field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : [];

  const classTable = useTable<ClassItem>({
    columns: useMemo<ColumnDef<ClassItem>[]>(() => [
      {
        id: 'banner',
        accessorKey: 'bannerUrl',
        size: 80,
        header: () => <p className='column-title'>Banner</p>,
        cell: ({ getValue }) => {
          const url = getValue<string>();
          if (url) {
            return (
              <img
                src={url}
                alt="Class banner"
                className="w-10 h-10 rounded object-cover"
              />
            );
          }
          return <div className="w-10 h-10 rounded bg-gray-200" />;
        },
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Class Name</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString',
      },
      {
        id: 'status',
        accessorKey: 'status',
        size: 100,
        header: () => <p className='column-title'>Status</p>,
        cell: ({ getValue }) => {
          const status = getValue<string>();
          const variant = status === 'active' ? 'default' : 'secondary';
          return <Badge variant={variant}>{status}</Badge>;
        },
      },
      {
        id: 'subject',
        accessorFn: (row) => row.subject?.name ?? '',
        size: 150,
        header: () => <p className='column-title'>Subject</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'teacher',
        accessorFn: (row) => row.teacher?.name ?? '',
        size: 150,
        header: () => <p className='column-title'>Teacher</p>,
        cell: ({ getValue }) => <span className='text-foreground'>{getValue<string>()}</span>,
      },
      {
        id: 'capacity',
        accessorKey: 'capacity',
        size: 100,
        header: () => <p className='column-title'>Capacity</p>,
        cell: ({ getValue }) => <span>{getValue<number>()}</span>,
      },

      {
        id: 'details',
        size: 140,
        header: () => <p className='column-title'>Details</p>,
        cell: ({ row }) => <ShowButton resource='classes' recordItemId={row.original.id} variant={"outline"} size={"sm"}>View</ShowButton>
      }

    ], []),
    refineCoreProps: {
      resource: 'classes',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...subjectFilters, ...teacherFilters, ...searchFilters]
      },
      sorters: {
        initial: [
          { field: 'id', order: 'desc' }
        ]
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />
      <h1 className="page-title">Classes</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools</p>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className='search-icon' />
            <input
              type="text"
              placeholder='Search by class name'
              className='pl-10 f-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='flex gap-2 w-full sm:w-auto'>
            <Select
              value={selectedSubject}
              onValueChange={setSelectedSubject}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Subjects
                </SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedTeacher}
              onValueChange={setSelectedTeacher}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by teacher" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Teachers
                </SelectItem>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher.id} value={teacher.name}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={classTable} />
    </ListView>
  )
}

export default ClassesList