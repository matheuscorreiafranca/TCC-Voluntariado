import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authService from '../services/authService';

interface AuthUser {
  usuarioId: number;
  voluntarioId?: number;
  instituicaoId?: number;
  nome: string;
  email: string;
  tipo: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoggedIn: boolean;
  isOrganizacao: boolean;
  isAdmin: boolean;
  isSuperadmin: boolean;
  loading: boolean;
  login: (email: string, senha: string) => Promise<AuthUser>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao montar, verificar se há sessão persistida no localStorage
  useEffect(() => {
    if (authService.isAuthenticated()) {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getToken();
      if (storedUser && storedToken) {
        setUser(storedUser);
        setToken(storedToken);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    const response = await authService.login(email, senha);
    const authUser: AuthUser = {
      usuarioId: response.usuarioId,
      voluntarioId: response.voluntarioId,
      instituicaoId: response.instituicaoId,
      nome: response.nome,
      email: response.email,
      tipo: response.tipo,
    };
    setUser(authUser);
    setToken(response.token);
    return authUser;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const isLoggedIn = !!user && !!token;
  const isOrganizacao = user?.tipo === 'Instituicao';
  const isSuperadmin = user?.tipo === 'Superadmin';
  const isAdmin = user?.tipo === 'Admin' || isSuperadmin;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, isOrganizacao, isAdmin, isSuperadmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
