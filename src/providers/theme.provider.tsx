import React, { JSX, useContext, useEffect, useState } from "react";
import { APP_THEME } from "src/constants/app.constants";
import AppThemeContext from "src/contexts/theme.context";
import { themeType } from "src/types/app.types";
import SecureStoreManager from "src/utils/securestoremanager.utils";

export const AppThemeProvider = ({ children }: { children: JSX.Element }) => {
  const [value, setValue] = useState<themeType>("light");

  const toggleTheme = () => {
    setValue((theme) => (theme === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    SecureStoreManager.saveItemToAsyncStorage(`${APP_THEME}`, value)
      .then(() => {})
      .catch((e) => console.log(e));
  }, [value]);

  return (
    <AppThemeContext.Provider
      value={{
        theme: value,
        toggleTheme,
      }}
    >
      {children}
    </AppThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(AppThemeContext);
