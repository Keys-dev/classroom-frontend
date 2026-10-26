import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { useMemo, useState } from 'react'
import { Search } from "lucide-react"
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { useTable } from '@refinedev/react-table'
import { useList } from '@refinedev/core'
import { Subject, Department } from '@/types'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

const SubjectsList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Fetch departments for filter dropdown
  const { query: departmentsQuery } = useList<Department>({
    resource: 'departments',
    pagination: { pageSize: 100 },
  });
  const departments = departmentsQuery.data?.data || [];

  const departmentFilters = selectedDepartment === 'all' ? [] : [
    {field: 'department', operator: 'eq' as const, value: selectedDepartment}
  ];

  const searchFilters = searchQuery ? [
    {field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : [];

  const subjectTable = useTable<Subject>({
    columns: useMemo<ColumnDef<Subject>[]>(() => [
      {
        id: 'code', 
        accessorKey: 'code', 
        size: 100, 
        header: () => <p className='column-title ml-2'>Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>
      },

      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue }) => <span 
        className='text-foreground'>{getValue<string>()}</span>,
        filterFn: 'includesString'
      },

      {
        id: 'department',
        accessorFn: (row: any) => row.departments?.name ?? '',
        size: 150,
        header: () => <p className='column-title'>Department</p>,
        cell: ({ getValue }) => <Badge variant={'secondary'}>{getValue<string>()}</Badge>
      },

      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell: ({ getValue }) => <span className='truncate line-clamp-2'>{getValue<string>()}</span>,
      },

      {
        id: 'actions',
        size: 140,
        header: () => <p className='column-title'>Actions</p>,
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <EditButton
              resource="subjects"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
            <DeleteButton
              resource="subjects"
              recordItemId={row.original.id}
              size="sm"
            >
              Archive
            </DeleteButton>
          </div>
        ),
      }

    ], []),
    refineCoreProps: {
    resource: 'subjects',
    pagination: {pageSize:10, mode: 'server'},
    filters: {
      permanent: [...departmentFilters, ...searchFilters]
    },
    sorters: {
      initial: [
        { field: 'id', order: 'desc'}
      ]
    },

  }
  });

    return (
      <ListView>
        <Breadcrumb />
        <h1 className="page-title">Subjects</h1>
        <div className='intro-row'>
          <p>Quick access to essential metrics and management tools</p>
          <div className='actions-row'>
            <div className='search-field'>
              <Search className='search-icon'/>

              <input 
                type="text" 
                placeholder='Search by name'
                className='pl-10 f-full'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} 
                />
            </div>

            <div className='flex gap-2 w-full sm:w-auto'>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by department"/>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">
                    All Departments
                  </SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <CreateButton />
            </div>
          </div>
        </div>

        <DataTable table={subjectTable} />
      </ListView>
      
    )
}

export default SubjectsList