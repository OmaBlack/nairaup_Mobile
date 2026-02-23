import { createContext } from "react";
import { themeType } from "src/types/app.types";

const AppThemeContext = createContext<{
  theme: themeType;
  toggleTheme: Function;
}>({
  theme: "light",
  toggleTheme: () => null,
});

export default AppThemeContext;
