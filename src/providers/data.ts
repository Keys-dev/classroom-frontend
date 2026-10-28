import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

import { CreateResponse, GetOneResponse, ListResponse } from "@/types";
import { BACKEND_BASE_URL } from "@/constants";
import { HttpError } from "@refinedev/core";

if (!BACKEND_BASE_URL) {
  console.warn('WARNING: BACKEND_BASE_URL is not configured. API calls will fail.');
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
    let message = 'Request failed.';

    try {
        const payload = (await response.json()) as { message?: string }

        if(payload?.message) message = payload.message;
    } catch {
        //Ignore errors      
    }

    return {
      message,
      statusCode: response.status
    }
}

const RESOURCE_ENDPOINT_MAP: Record<string, string> = {
  "my-classes": "classes/my",
  "enrolled-classes": "classes/enrolled",
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => {
      const mapped = RESOURCE_ENDPOINT_MAP[resource];
      return mapped ? `api/${mapped}` : `api/${resource}`;
    },

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const params: Record<string, string | number> = {};

      if (pagination?.mode !== "off") {
        const page = pagination?.currentPage ?? 1;
        const pageSize = pagination?.pageSize ?? 10;

        params.page = page;
        params.limit = pageSize;
      }

      filters?.forEach((filter) => {
        const field = "field" in filter ? filter.field : "";
        const value = String(filter.value);

        if (field === "role") {
          params.role = value;
        }

        if (resource === "departments") {
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "users") {
          if (field === "search" || field === "name" || field === "email") {
            params.search = value;
          }
        }

        if (resource === "subjects") {
          if (field === "department") params.department = value;
          if (field === "name" || field === "code") params.search = value;
        }

        if (resource === "classes") {
          if (field === "name") params.search = value;
          if (field === "subject") params.subject = value;
          if (field === "teacher") params.teacher = value;
        }

        if (resource === "my-classes" || resource === "enrolled-classes") {
          if (field === "name") params.search = value;
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if(!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => `api/${resource}`,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => `api/${resource}/${id}`,

    mapResponse: async (response) => {
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },

  update: {
    getEndpoint: ({ resource, id }) => `api/${resource}/${id}`,

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => `api/${resource}/${id}/archive`,

    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      return json.data ?? {};
    },
  },

  getMany: {
    getEndpoint: ({ resource }) => `api/${resource}`,

    buildQueryParams: async ({ ids }) => {
      return { ids: ids.join(",") };
    },

    mapResponse: async (response) => {
      const json: ListResponse = await response.json();
      return (json.data ?? []) as any;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };