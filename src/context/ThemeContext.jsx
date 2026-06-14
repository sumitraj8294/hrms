import { createContext, useContext, useState } from 'react'
const ThemeContext = createContext(null)
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light')
  return <ThemeContext.Provider value={{ theme, setTheme, isDark: theme === 'dark' }}>{children}</ThemeContext.Provider>
}
export const useTheme = () => useContext(ThemeContext)
