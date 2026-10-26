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
import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User } from '@/types'

const UsersList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const roleFilters = selectedRole === 'all' ? [] : [
    { field: 'role', operator: 'eq' as const, value: selectedRole }
  ];

  const searchFilters = searchQuery ? [
    { field: 'name', operator: 'contains' as const, value: searchQuery }
  ] : [];

  const userTable = useTable<User>({
    columns: useMemo<ColumnDef<User>[]>(() => [
      {
        id: 'avatar',
        accessorKey: 'image',
        size: 60,
        header: () => <p className='column-title'>Avatar</p>,
        cell: ({ row }) => {
          const image = row.original.image;
          const name = row.original.name;
          const initials = name
            .split(' ')
            .map((n: string) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
          return (
            <Avatar className="w-8 h-8">
              <AvatarImage src={image} alt={name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          );
        },
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
        id: 'email',
        accessorKey: 'email',
        size: 250,
        header: () => <p className='column-title'>Email</p>,
        cell: ({ getValue }) => (
          <span className='text-foreground text-sm'>{getValue<string>()}</span>
        ),
      },
      {
        id: 'role',
        accessorKey: 'role',
        size: 120,
        header: () => <p className='column-title'>Role</p>,
        cell: ({ getValue }) => {
          const role = getValue<string>();
          const variant =
            role === 'admin' ? 'default' : role === 'teacher' ? 'secondary' : 'outline';
          return <Badge variant={variant}>{role}</Badge>;
        },
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
              resource="users"
              recordItemId={row.original.id}
              variant="outline"
              size="sm"
            >
              Edit
            </EditButton>
            <DeleteButton
              resource="users"
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
      resource: 'users',
      pagination: { pageSize: 10, mode: 'server' },
      filters: {
        permanent: [...roleFilters, ...searchFilters]
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
      <h1 className="page-title">Users</h1>
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
            <Select
              value={selectedRole}
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All Roles
                </SelectItem>
                <SelectItem value="admin">
                  Admin
                </SelectItem>
                <SelectItem value="teacher">
                  Teacher
                </SelectItem>
                <SelectItem value="student">
                  Student
                </SelectItem>
              </SelectContent>
            </Select>

            <CreateButton />
          </div>
        </div>
      </div>

      <DataTable table={userTable} />
    </ListView>
  )
}

export default UsersList
