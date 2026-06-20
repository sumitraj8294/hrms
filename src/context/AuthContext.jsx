import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem('nexhr_token')
  )

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('nexhr_user')
    return storedUser ? JSON.parse(storedUser) : null
  })

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const storedUser = localStorage.getItem('nexhr_user')

      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } else {
      setUser(null)
    }

    setLoading(false)
  }, [token])

  const login = (userData, authToken) => {
    localStorage.setItem('nexhr_token', authToken)
    localStorage.setItem('nexhr_user', JSON.stringify(userData))

    setToken(authToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('nexhr_token')
    localStorage.removeItem('nexhr_user')

    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}