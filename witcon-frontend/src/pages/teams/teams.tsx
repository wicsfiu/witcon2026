import React from "react";
import Title from '../components/text/Title';
import Text from '../components/text/Text';
  
  interface Member {
    name: string;
    position: string;
    image?: string;
  }
  
  interface TeamSectionProps {
    title: string;
    color: string; // e.g. 'pink' or 'teal'
    members: Member[];
  }
  
  const TeamSection: React.FC<TeamSectionProps> = ({ title, color, members }) => {
    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Section Title */}
        <Title className="text-2xl font-semibold text-[color:var(--color-primary)]">
          {title}
        </Title>
  
        {/* Card */}
        <div
          className={`w-full rounded-2xl bg-${color}-300/70 p-6 md:p-8 shadow-md`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6 place-items-center">
            {members.map((m, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-gray-300 overflow-hidden mb-3" />
                <Text className="font-medium leading-tight">{m.name}</Text>
                <Text className="text-sm opacity-80">{m.position}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  export default TeamSection;
  