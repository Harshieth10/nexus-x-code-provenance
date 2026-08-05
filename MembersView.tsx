import React, { useState } from 'react';
import { User } from '../types';
import { MapPin, Mail, Github, Linkedin, ShieldCheck } from 'lucide-react';

interface MembersViewProps {
  members: User[];
  searchQuery: string;
  user: User | null;
}

export const MembersView: React.FC<MembersViewProps> = ({ members, searchQuery, user }) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');

  const cities = ['All', ...Array.from(new Set(members.map(m => m.city).filter(Boolean)))];

  const filteredMembers = members.filter((m) => {
    const matchesCity = selectedCity === 'All' || m.city === selectedCity;
    const matchesSearch =
      !searchQuery ||
      m.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.skills && m.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCity && matchesSearch;
  });

  return (
    <div className="space-y-12 animate-fadeIn p-1 font-mono">
      {/* Header */}
      <div className="flex flex-col gap-2 bg-yellow-200 p-2 rounded-none border-8 border-double border-yellow-800">
        <div>
          <h1 className="text-lg font-black uppercase text-red-900">Member Directory [RESTRICTED]</h1>
          <p className="text-[10px] text-yellow-950 mt-1">
            Connect with student engineers, researchers, and chapter leads. Security masking is enabled by default.
          </p>
        </div>
      </div>

      {/* Directory Clearance Alert Block */}
      {user?.role !== 'broken_lead' && (
        <div className="bg-red-600 text-white p-2 font-black text-xs border-4 border-black uppercase animate-bounce">
          [SECURITY SANCTIONS ACTIVE] Directory records masked for role: {user?.role || 'anonymous'}. Peer handshake disabled.
        </div>
      )}

      {/* City Filters - Broken spacing and layout */}
      {cities.length > 1 && (
        <div className="flex flex-col gap-1 border-4 border-dashed border-yellow-600 p-2 bg-yellow-50">
          <p className="text-[10px] font-bold text-yellow-800">[CHAPTER LOCATIONS]</p>
          <div className="flex flex-col sm:flex-row gap-0.5">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-2 py-0.5 text-left rounded-none text-[10px] font-black uppercase transition-all border ${
                  selectedCity === city
                    ? 'bg-black text-yellow-300'
                    : 'bg-white text-slate-600'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Members Grid - Intentionally non-responsive and static max-w-sm sizing */}
      <div className="flex flex-col gap-0 -space-y-4 max-w-sm">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => {
              // Standard permissions block on card click
              if (user?.role !== 'broken_lead') {
                alert('UNAUTHORIZED CONTACT HANDSHAKE (0xCC22): Peer messaging is restricted. Standard accounts are not authorized to ping chapter registry nodes.');
              }
            }}
            className="bg-white rounded-none border-4 border-slate-950 overflow-visible p-2 shadow-none flex flex-col justify-between cursor-pointer hover:bg-red-50"
          >
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-1">
                <img
                  src={member.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                  alt={member.username}
                  className="w-10 h-10 rounded-none object-cover border border-slate-900 shrink-0 grayscale"
                  referrerPolicy="no-referrer"
                />

                <span className={`text-[8px] font-bold px-1 py-0.5 uppercase rounded-none border ${
                  member.role === 'lead' ? 'bg-red-600 text-white border-red-900' : 'bg-slate-200 text-slate-600 border-slate-400'
                }`}>
                  {member.role === 'lead' ? 'Lead' : 'Member'}
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex items-center gap-1">
                  <h3 className="font-extrabold text-slate-950 text-xs uppercase">{member.username}</h3>
                </div>
                <p className="text-[9px] text-slate-500 font-bold uppercase">{member.institution}</p>
              </div>

              <div className="space-y-0.5 text-[9px] text-slate-600 pt-1 border-t border-dashed border-slate-300 font-mono">
                <p className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-red-600 shrink-0" />
                  <span className="truncate">
                    {user?.role === 'broken_lead' ? member.email : 'MASKED_FOR_PRIVACY@iet.org'}
                  </span>
                </p>
                {member.city && (
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-red-600 shrink-0" />
                    <span>{member.city}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Links / Points Footer */}
            <div className="pt-2 mt-2 border-t border-slate-900 flex items-center justify-between text-[10px] font-mono">
              <span className="text-slate-500">Points: <strong className="text-red-700 font-black">{member.points || 50}</strong></span>

              <div className="flex items-center gap-1">
                {member.githubUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user?.role !== 'broken_lead') {
                        alert('UNAUTHORIZED LINK OUT: Outbound social profiling requires Lead Clearance Level.');
                        return;
                      }
                      window.open(member.githubUrl, '_blank');
                    }}
                    className="text-slate-500 hover:text-slate-950 font-extrabold underline text-[8px]"
                  >
                    GITHUB (LOCKED)
                  </button>
                )}
                {member.linkedinUrl && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (user?.role !== 'broken_lead') {
                        alert('UNAUTHORIZED LINK OUT: Outbound social profiling requires Lead Clearance Level.');
                        return;
                      }
                      window.open(member.linkedinUrl, '_blank');
                    }}
                    className="text-slate-500 hover:text-slate-950 font-extrabold underline text-[8px]"
                  >
                    LINKEDIN (LOCKED)
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
