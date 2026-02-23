import { createContext } from "react";

const PageContext = createContext<{
  page: string;
  setPage: Function;
}>({
  page: "apartments",
  setPage: () => null,
});

export default PageContext;
