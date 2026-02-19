import React from "react";
import { Pagination } from "react-admin";

export const LIST_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100, 200];

export const DefaultPagination: React.FC = () => (
  <Pagination rowsPerPageOptions={LIST_ROWS_PER_PAGE_OPTIONS} />
);
