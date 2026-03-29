import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const MainNavigation = ({ isCollapsed = false, onToggleCollapse }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate getting current user from localStorage or context
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  }, []);

  const navigationItems = [
    {
      label: 'Dashboard',
      path: getCurrentDashboardPath(),
      icon: 'LayoutDashboard',
      roles: ['secretary', 'coordinator', 'teacher', 'parent']
    },
    {
      label: 'Perfil do Aluno',
      path: '/student-profile',
      icon: 'User',
      roles: ['secretary', 'coordinator', 'teacher', 'parent']
    }
  ];

  function getCurrentDashboardPath() {
    if (!currentUser?.role) return '/login';
    
    switch (currentUser?.role) {
      case 'secretary':
        return '/secretary-dashboard';
      case 'coordinator':
        return '/coordinator-dashboard';
      case 'teacher':
        return '/teacher-dashboard';
      case 'parent':
        return '/parent-portal';
      default:
        return '/login';
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const filteredNavItems = navigationItems?.filter(item => 
    !currentUser?.role || item?.roles?.includes(currentUser?.role)
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-educational">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <Link to={getCurrentDashboardPath()} className="flex items-center space-x-3 hover-scale">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Icon name="GraduationCap" size={24} color="white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">Edu+ Inclusiva</h1>
                <p className="text-xs text-muted-foreground">Educação Especial Municipal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {filteredNavItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-educational hover-scale ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground shadow-educational'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center space-x-3">
            {/* User Profile Dropdown */}
            {currentUser?.name && (
              <div className="hidden sm:flex items-center space-x-3 px-3 py-2 bg-muted rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
                  <Icon name="User" size={16} color="white" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{currentUser?.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              iconName="LogOut"
              className="hidden sm:flex"
            >
              Sair
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card border-t border-border shadow-educational-lg">
            <nav className="px-4 py-3 space-y-2">
              {filteredNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-educational ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.label}</span>
                </Link>
              ))}
              
              {/* Mobile User Info & Logout */}
              <div className="pt-3 mt-3 border-t border-border">
                {currentUser?.name && (
                  <div className="flex items-center space-x-3 px-4 py-2 mb-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-secondary rounded-full">
                      <Icon name="User" size={16} color="white" />
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{currentUser?.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{currentUser?.role}</p>
                    </div>
                  </div>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  iconName="LogOut"
                  className="w-full justify-start px-4"
                >
                  Sair
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default MainNavigation;