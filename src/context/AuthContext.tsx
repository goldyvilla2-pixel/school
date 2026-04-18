import React, { createContext, useContext, useState } from 'react';

export type Role = 'SUPER_ADMIN' | 'SUPER_SUB_ADMIN' | 'ADMIN' | 'ACCOUNTING' | 'COORDINATOR';
export type School = 'NORTH CAMPUS' | 'SOUTH CAMPUS' | 'EAST CAMPUS' | 'WEST CAMPUS';

interface User {
  username: string;
  role: Role;
  assignedSchool: School | 'ALL';
}

interface AuthContextType {
  user: User;
  setUser: (user: User) => void;
  selectedSchool: School | 'ALL';
  setSelectedSchool: (school: School | 'ALL') => void;
  canEdit: () => boolean;
  canUpdate: () => boolean;
  canViewFinancials: (school: School) => boolean;
  canAccessModule: (moduleId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mock current user - In real app, this comes from login
  const [user, setUser] = useState<User>({
    username: 'ADMINISTRATOR',
    role: 'SUPER_ADMIN',
    assignedSchool: 'ALL'
  });

  const [selectedSchool, setSelectedSchool] = useState<School | 'ALL'>('ALL');

  // RBAC LOGIC
  const canEdit = () => user.role === 'SUPER_ADMIN';
  
  const canUpdate = () => ['SUPER_ADMIN', 'ACCOUNTING', 'COORDINATOR'].includes(user.role);

  const canViewFinancials = (school: School) => {
    if (user.role === 'SUPER_ADMIN') return true;
    if (user.role === 'SUPER_SUB_ADMIN') {
        // SUPER SUB ADMIN restricted from seeing all financials unless it's their assigned school
        return school === user.assignedSchool;
    }
    if (['ADMIN', 'ACCOUNTING'].includes(user.role)) {
        return school === user.assignedSchool || user.assignedSchool === 'ALL';
    }
    return false;
  };

  const canAccessModule = (moduleId: string) => {
    if (user.role === 'SUPER_ADMIN') return true;
    
    // STRICT MODULE ACCESS
    if (moduleId === 'fees' || moduleId === 'reports') {
        if (user.role === 'COORDINATOR') return false; // Coordinator can update but not see reports/financials of all?
        if (user.role === 'SUPER_SUB_ADMIN') return user.assignedSchool !== 'ALL'; // Only if assigned to a school
    }
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        setUser, 
        selectedSchool, 
        setSelectedSchool, 
        canEdit, 
        canUpdate, 
        canViewFinancials,
        canAccessModule
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
