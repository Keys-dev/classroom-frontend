import {
  DataProvider,
  BaseRecord,
  GetListParams,
  GetListResponse,
  GetOneParams,
  GetOneResponse,
  CreateParams,
  CreateResponse,
  UpdateParams,
  UpdateResponse,
  DeleteOneParams,
  DeleteOneResponse,
  CrudFilter,
  LogicalFilter,
} from "@refinedev/core";
import { mockSubjects } from "../constants/mock-subjects";

const applyFilter = (
  items: (typeof mockSubjects)[0][],
  filter: CrudFilter
): (typeof mockSubjects)[0][] => {
  // LogicalFilter has a `field` property; ConditionalFilter does not
  if ("field" in filter) {
    const logicalFilter = filter as LogicalFilter;
    const { field, operator, value } = logicalFilter;

    switch (operator) {
      case "contains":
        return items.filter((item) =>
          String((item as any)[field] ?? "").toLowerCase().includes(String(value).toLowerCase())
        );
      case "eq":
        return items.filter((item) => String((item as any)[field] ?? "") === String(value));
      case "ne":
        return items.filter((item) => String((item as any)[field] ?? "") !== String(value));
      case "null":
        return items.filter((item) => (item as any)[field] == null);
      case "nnull":
        return items.filter((item) => (item as any)[field] != null);
      default:
        return items;
    }
  }

  // ConditionalFilter (or / and) — not implemented for mock data
  return items;
};

export const dataProvider: DataProvider = {
  getList: async <TData extends BaseRecord>({
    resource,
    pagination,
    sorters,
    filters,
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== "subjects") {
      return { data: [] as unknown as TData[], total: 0 };
    }

    let results: (typeof mockSubjects)[0][] = [...mockSubjects];

    // Apply filters
    if (filters && filters.length > 0) {
      for (const filter of filters) {
        results = applyFilter(results, filter);
      }
    }

    // Apply sorters
    if (sorters && sorters.length > 0) {
      for (const sorter of sorters) {
        const field = sorter.field;
        const order = sorter.order === "desc" ? -1 : 1;
        results.sort((a, b) => {
          const aVal = (a as any)[field];
          const bVal = (b as any)[field];
          if (aVal < bVal) return -1 * order;
          if (aVal > bVal) return 1 * order;
          return 0;
        });
      }
    }

    const total = results.length;

    // Apply pagination (server mode)
    if (pagination?.mode === "server") {
      const currentPage = pagination.currentPage ?? 1;
      const pageSize = pagination.pageSize ?? 10;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      results = results.slice(start, end);
    }

    return {
      data: results as unknown as TData[],
      total,
    };
  },

  getOne: async <TData extends BaseRecord>({
    resource,
    id,
  }: GetOneParams): Promise<GetOneResponse<TData>> => {
    if (resource === "subjects") {
      const subject = mockSubjects.find((s) => s.id === Number(id));
      if (!subject) {
        throw new Error(`Subject with id ${id} not found`);
      }
      return { data: subject as unknown as TData };
    }
    throw new Error(`GetOne not supported for resource: ${resource}`);
  },

  create: async <TData extends BaseRecord, TVariables = {}>({
    resource,
    variables,
  }: CreateParams<TVariables>): Promise<CreateResponse<TData>> => {
    if (resource === "subjects") {
      const vars = variables as any;
      const newId = Math.max(...mockSubjects.map((s) => s.id)) + 1;
      const newSubject = {
        id: newId,
        code: vars.data?.code || vars.code || "",
        name: vars.data?.name || vars.name || "",
        department: vars.data?.department || vars.department || "",
        description: vars.data?.description || vars.description || "",
        createdAt: new Date().toISOString(),
      };
      mockSubjects.push(newSubject);
      return { data: newSubject as unknown as TData };
    }
    throw new Error(`Create not supported for resource: ${resource}`);
  },

  update: async <TData extends BaseRecord, TVariables = {}>({
    resource,
    id,
    variables,
  }: UpdateParams<TVariables>): Promise<UpdateResponse<TData>> => {
    if (resource === "subjects") {
      const index = mockSubjects.findIndex((s) => s.id === Number(id));
      if (index === -1) {
        throw new Error(`Subject with id ${id} not found`);
      }
      const vars = variables as any;
      const updatedSubject = {
        ...mockSubjects[index],
        ...(vars.data || vars),
      };
      mockSubjects[index] = updatedSubject;
      return { data: updatedSubject as unknown as TData };
    }
    throw new Error(`Update not supported for resource: ${resource}`);
  },

  deleteOne: async <TData extends BaseRecord, TVariables = {}>({
    resource,
    id,
  }: DeleteOneParams<TVariables>): Promise<DeleteOneResponse<TData>> => {
    if (resource === "subjects") {
      const index = mockSubjects.findIndex((s) => s.id === Number(id));
      if (index === -1) {
        throw new Error(`Subject with id ${id} not found`);
      }
      const deleted = mockSubjects.splice(index, 1)[0];
      return { data: deleted as unknown as TData };
    }
    throw new Error(`Delete not supported for resource: ${resource}`);
  },

  getApiUrl: () => "",
};
