import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const UserProfile = ({ className = '' }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get current user from localStorage or context
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef?.current && !dropdownRef?.current?.contains(event?.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsDropdownOpen(false);
    navigate('/login');
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      secretary: 'Secretária de Educação',
      coordinator: 'Coordenadora',
      teacher: 'Professora',
      parent: 'Responsável'
    };
    return roleNames?.[role] || role;
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name?.split(' ')?.map(n => n?.[0])?.join('')?.toUpperCase()?.slice(0, 2);
  };

  if (!currentUser?.name) {
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* User Profile Button */}
      <Button
        variant="ghost"
        onClick={toggleDropdown}
        className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-muted transition-educational"
      >
        <div className="flex items-center justify-center w-8 h-8 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
          {getInitials(currentUser?.name)}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-foreground leading-tight">
            {currentUser?.name}
          </p>
          <p className="text-xs text-muted-foreground leading-tight">
            {getRoleDisplayName(currentUser?.role)}
          </p>
        </div>
        <Icon 
          name="ChevronDown" 
          size={16} 
          className={`hidden sm:block transition-transform duration-200 ${
            isDropdownOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>
      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-popover border border-border rounded-lg shadow-educational-lg z-50 animate-slide-down">
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                {getInitials(currentUser?.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-popover-foreground truncate">
                  {currentUser?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {getRoleDisplayName(currentUser?.role)}
                </p>
                {currentUser?.school && (
                  <p className="text-xs text-muted-foreground truncate">
                    {currentUser?.school}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Navigate to profile settings if available
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-educational"
            >
              <Icon name="Settings" size={16} />
              <span>Configurações</span>
            </button>
            
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                // Navigate to help if available
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-educational"
            >
              <Icon name="HelpCircle" size={16} />
              <span>Ajuda</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-destructive hover:bg-muted transition-educational"
            >
              <Icon name="LogOut" size={16} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;