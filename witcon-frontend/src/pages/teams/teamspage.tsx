import React from 'react';
import TeamSection from './teams';
import { TEAM_SECTIONS } from './teamsdata';

const TeamsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-10">
      {TEAM_SECTIONS.map((section, i) => (
        <TeamSection
          key={i}
          title={section.title}
          color={section.color}
          members={section.members}
        />
      ))}
    </div>
  );
};

export default TeamsPage;
