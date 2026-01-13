export type Todo = {
  _id: string;
  title: string;
  completed: boolean;
};

export type PaginatedTodosResponse = {
  todos: Todo[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
