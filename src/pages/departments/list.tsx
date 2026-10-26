import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { ListView } from '@/components/refine-ui/views/list-view'
import { useMemo, useState } from 'react'
import { Search } from "lucide-react"
import { CreateButton } from '@/components/refine-ui/buttons/create'
import { EditButton } from '@/components/refine-ui/buttons/edit'
import { DeleteButton } from '@/components/refine-ui/buttons/delete'
import { DataTable } from '@/components/refine-ui/data-table/data-table'
import { useTable } from '@refinedev/react-table'
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

type DepartmentItem = {
  id: number;
  code: string;
  name: string;
  description: string | null;
  deletedAt: string | null;
};

const DepartmentsList = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchFilters = searchQuery ? [
    { field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : [];

  const departmentTable = useTable<DepartmentItem>({
    columns: useMemo<ColumnDef<DepartmentItem>[]>(() => [
      {
        id: 'code',
        accessorKey: 'code',
        size: 120,
        header: () => <p className='column-title ml-2'>Code</p>,
        cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
      },
      {
        id: 'name',
        accessorKey: 'name',
        size: 200,
        header: () => <p className='column-title'>Name</p>,
        cell: ({ getValue }) => (
          <span className='text-foreground'>{getValue<string>()}</span>
        ),
        filterFn: 'includesString',
      },
      {
        id: 'description',
        accessorKey: 'description',
        size: 300,
        header: () => <p className='column-title'>Description</p>,
        cell: ({ getValue }) => (
          <span className='truncate line-clamp-2'>
            {getValue<string>() ?? '—'}
          </span>
        ),
      },
      {
        id: 'status',
        accessorKey: 'deletedAt',
        size: 100,
        header: () => <p className='column-title'>Status</p>,
        cell: ({ getValue }) => {
          const deletedAt = getValue<string | null>();
          const variant = deletedAt ? 'secondary' : 'default';
          return <Badge variant={variant}>{deletedAt ? 'Archived' : 'Active'}</Badge>;
        },
      },
      {
        id: 'actions',
        size: 140,
        header: () => <p className='column-title'>Actions</p>,
        cell: ({ row }) => (
          <div className='flex gap-2'>
            <EditButton
              resource="departments"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
            <DeleteButton
              resource="departments"
              recordItemId={row.original.id}
              size="sm"
            >
              Archive
            </DeleteButton>
          </div>
        ),
      },
    ], []),
    refineCoreProps: {
      resource: 'departments',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...searchFilters]
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
      <h1 className="page-title">Departments</h1>
      <div className='intro-row'>
        <p>Quick access to essential metrics and management tools</p>
        <div className='actions-row'>
          <div className='search-field'>
            <Search className='search-icon' />
            <input
              type="text"
              placeholder='Search by name'
              className='pl-10 f-full'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className='flex gap-2 w-full sm:w-auto'>
            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={departmentTable} />
    </ListView>
  )
}

export default DepartmentsList
