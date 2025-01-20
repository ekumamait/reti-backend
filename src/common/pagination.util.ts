export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginatedResponse<T> {
  status: number;
  message: string;
  data: {
    items: T[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export const createPaginatedResponse = <T>(
  status: number,
  message: string,
  items: T[],
  total: number,
  page: number,
  limit: number,
): PaginatedResponse<T> => {
  return {
    status,
    message,
    data: {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  };
};

export const getPaginationParams = (query: PaginationParams) => {
  const page = Math.max(1, query.page || 1);
  const limit = Math.max(1, Math.min(100, query.limit || 10));
  const skip = (page - 1) * limit;
  const search = query.search || '';
  const sortBy = query.sortBy || 'createdAt';
  const sortOrder = query.sortOrder || 'DESC';

  return {
    page,
    limit,
    skip,
    search,
    sortBy,
    sortOrder,
  };
};
