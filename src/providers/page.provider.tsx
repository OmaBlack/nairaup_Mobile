import React, { JSX, useContext, useState } from "react";
import PageContext from "src/contexts/page.context";

export const PageProvider = ({ children }: { children: JSX.Element }) => {
  const [value, setValue] = useState<string | undefined>();

  const setPage = (type: string) => {
    setValue(type);
  };

  return (
    <PageContext.Provider
      value={{
        page: value || "apartments",
        setPage,
      }}
    >
      {children}
    </PageContext.Provider>
  );
};

export const usePage = () => useContext(PageContext);
