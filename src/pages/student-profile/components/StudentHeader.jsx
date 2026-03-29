import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const StudentHeader = ({ student, currentUser, onEditProfile, onUploadPhoto }) => {
  const canEdit = currentUser?.role === 'teacher' || currentUser?.role === 'coordinator';
  
  const getAgeFromBirthDate = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today?.getFullYear() - birth?.getFullYear();
    const monthDiff = today?.getMonth() - birth?.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today?.getDate() < birth?.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-educational">
      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
        {/* Student Photo */}
        <div className="flex-shrink-0">
          <div className="relative">
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted border-2 border-border">
              <Image
                src={student?.photo}
                alt={student?.photoAlt}
                className="w-full h-full object-cover"
              />
            </div>
            {canEdit && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onUploadPhoto}
                iconName="Camera"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              />
            )}
          </div>
        </div>

        {/* Student Information */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-4 sm:space-y-0">
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">{student?.name}</h1>
                <p className="text-muted-foreground">Matrícula: {student?.registrationNumber}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">
                    {getAgeFromBirthDate(student?.birthDate)} anos
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="GraduationCap" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{student?.grade}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="School" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{student?.school}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Users" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">Turma {student?.class}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="User" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">Prof. {student?.teacher}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} className="text-muted-foreground" />
                  <span className="text-foreground">{student?.schedule}</span>
                </div>
              </div>

              {/* Special Needs Tags */}
              <div className="flex flex-wrap gap-2">
                {student?.specialNeeds?.map((need, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20"
                  >
                    {need}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onEditProfile}
                  iconName="Edit"
                  iconPosition="left"
                >
                  Editar Perfil
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Status Indicators */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-success/5 border border-success/20 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-success/10 rounded-full">
              <Icon name="CheckCircle" size={16} className="text-success" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Status</p>
              <p className="text-xs text-success">Ativo</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
              <Icon name="TrendingUp" size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Progresso Geral</p>
              <p className="text-xs text-primary">{student?.overallProgress}%</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 bg-accent/10 rounded-full">
              <Icon name="Calendar" size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Última Avaliação</p>
              <p className="text-xs text-accent">{student?.lastAssessment}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;