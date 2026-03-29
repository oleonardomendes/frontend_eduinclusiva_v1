import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbNavigation = ({ customBreadcrumbs = null, className = '' }) => {
  const location = useLocation();

  const routeLabels = {
    '/secretary-dashboard': 'Dashboard da Secretária',
    '/coordinator-dashboard': 'Dashboard da Coordenadora',
    '/teacher-dashboard': 'Dashboard da Professora',
    '/parent-portal': 'Portal dos Responsáveis',
    '/student-profile': 'Perfil do Aluno',
    '/login': 'Login'
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [
      {
        label: 'Início',
        path: '/',
        icon: 'Home'
      }
    ];

    let currentPath = '';
    pathSegments?.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const label = routeLabels?.[currentPath] || segment?.charAt(0)?.toUpperCase() + segment?.slice(1);
      
      breadcrumbs?.push({
        label,
        path: currentPath,
        isLast: index === pathSegments?.length - 1
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  // Don't show breadcrumbs on login page or if only one item
  if (location?.pathname === '/login' || breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav 
      className={`flex items-center space-x-2 text-sm text-muted-foreground mb-6 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon 
                name="ChevronRight" 
                size={14} 
                className="text-muted-foreground/60" 
              />
            )}
            
            {crumb?.isLast ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                {crumb?.icon && <Icon name={crumb?.icon} size={14} />}
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {crumb?.label}
                </span>
              </span>
            ) : (
              <Link
                to={crumb?.path}
                className="flex items-center space-x-1 hover:text-foreground transition-educational hover-scale"
              >
                {crumb?.icon && <Icon name={crumb?.icon} size={14} />}
                <span className="truncate max-w-[150px] sm:max-w-none">
                  {crumb?.label}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbNavigation;