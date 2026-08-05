import React, { useState } from 'react';
import { Project, User } from '../types';
import {
  Github,
  ExternalLink,
  Star,
  PlusCircle,
  Sparkles,
  X,
} from 'lucide-react';

interface ProjectsViewProps {
  projects: Project[];
  user: User | null;
  onLikeProject: (projectId: string) => void;
  onSubmitProject: (projectData: Partial<Project>) => Promise<boolean>;
  searchQuery: string;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  user,
  onLikeProject,
  onSubmitProject,
  searchQuery,
}) => {
  const [selectedDomain, setSelectedDomain] = useState('All');

  const [selectedTimeline, setSelectedTimeline] = useState<
    'all' | 'present' | 'past' | 'future'
  >('all');

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [newProjData, setNewProjData] = useState({
    title: '',
    tagline: '',
    description: '',
    domain: 'AI / ML' as Project['domain'],
    githubUrl: '',
    demoUrl: '',
    teamMembersStr: '',
    imageUrl: '',
    status: 'Active' as 'Active' | 'Completed' | 'Research',
    timeline: 'present' as 'past' | 'present' | 'future',
  });

  const domains = [
    'All',
    'AI / ML',
    'Web Development',
    'IoT & Embedded',
    'Robotics',
    'Cybersecurity',
    'Mobile App',
  ];

  const timelines = [
    { id: 'all', label: 'All Projects' },
    { id: 'present', label: 'Ongoing' },
    { id: 'past', label: 'Completed' },
    { id: 'future', label: 'Research' },
  ] as const;

  const filteredProjects = projects.filter((proj) => {
    const matchesDomain =
      selectedDomain === 'All' || proj.domain === selectedDomain;

    const projectTimeline =
      proj.timeline ??
      (proj.status === 'Completed'
        ? 'past'
        : proj.status === 'Research'
        ? 'future'
        : 'present');

    const matchesTimeline =
      selectedTimeline === 'all' ||
      projectTimeline === selectedTimeline;

    const matchesSearch =
      !searchQuery ||
      proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return (
      matchesDomain &&
      matchesTimeline &&
      matchesSearch
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !newProjData.title ||
      !newProjData.description ||
      !newProjData.githubUrl
    ) {
      return;
    }

    const teamMembers =
      newProjData.teamMembersStr.trim() !== ''
        ? newProjData.teamMembersStr
            .split(',')
            .map(member => member.trim())
        : [user?.username || 'Author'];

    const success = await onSubmitProject({
      ...newProjData,
      teamMembers,
    });

    if (success) {
      setShowSubmitModal(false);

      setNewProjData({
        title: '',
        tagline: '',
        description: '',
        domain: 'AI / ML',
        githubUrl: '',
        demoUrl: '',
        teamMembersStr: '',
        imageUrl: '',
        status: 'Active',
        timeline: 'present',
      });
    }
  };
  return (
  <div className="space-y-6 animate-fadeIn">

    {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-['Poppins']">
          Member Innovation Showcase
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Discover innovative projects created by IET CONNECT members.
        </p>
      </div>

      {user && (
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center gap-2 bg-[#622569] hover:bg-[#7d3293] text-white px-5 py-3 rounded-xl font-semibold transition"
        >
          <PlusCircle className="w-5 h-5" />
          Submit Project
        </button>
      )}
    </div>

    {/* Timeline Filter */}
    <div className="flex flex-wrap gap-2">
      {timelines.map((timeline) => (
        <button
          key={timeline.id}
          onClick={() => setSelectedTimeline(timeline.id)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            selectedTimeline === timeline.id
              ? 'bg-[#622569] text-white'
              : 'bg-white border border-slate-300 hover:bg-slate-100'
          }`}
        >
          {timeline.label}
        </button>
      ))}
    </div>

    {/* Domain Filter */}
    <div className="flex flex-wrap gap-2">
      {domains.map((domain) => (
        <button
          key={domain}
          onClick={() => setSelectedDomain(domain)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
            selectedDomain === domain
              ? 'bg-purple-100 text-[#622569] border border-purple-300'
              : 'bg-white border border-slate-300 hover:bg-slate-100'
          }`}
        >
          {domain}
        </button>
      ))}
    </div>

    {/* Projects */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {filteredProjects.map((project) => {

        const isLiked = user
          ? project.likedByUserIds.includes(user.id)
          : false;

        const timeline =
          project.timeline ??
          (project.status === 'Completed'
            ? 'past'
            : project.status === 'Research'
            ? 'future'
            : 'present');

        return (
          <div
            key={project.id}
            className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition"
          >
            {/* Image */}
            <div className="relative h-52">
              <img
                src={
                  project.imageUrl ||
                  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900'
                }
                alt={project.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

              <div className="absolute top-4 left-4 flex gap-2">

                <span className="bg-white text-[#622569] text-xs font-bold px-3 py-1 rounded-full">
                  {project.domain}
                </span>

                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    timeline === 'present'
                      ? 'bg-yellow-400 text-black'
                      : timeline === 'past'
                      ? 'bg-green-600 text-white'
                      : 'bg-purple-600 text-white'
                  }`}
                >
                  {timeline === 'present'
                    ? 'Ongoing'
                    : timeline === 'past'
                    ? 'Completed'
                    : 'Research'}
                </span>
              </div>

              <button
                onClick={() => onLikeProject(project.id)}
                className={`absolute top-4 right-4 flex items-center gap-1 px-3 py-2 rounded-full transition ${
                  isLiked
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/90 hover:bg-white'
                }`}
              >
                <Star
                  className={`w-4 h-4 ${
                    isLiked ? 'fill-current' : ''
                  }`}
                />

                <span className="text-sm font-semibold">
                  {project.likes}
                </span>
              </button>

              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm font-semibold">
                  {project.authorName}
                </p>

                <p className="text-xs opacity-90">
                  {project.authorInstitution}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">

              <h2 className="text-xl font-bold text-slate-900">
                {project.title}
              </h2>

              <p className="text-[#622569] italic mt-1">
                {project.tagline}
              </p>

              <p className="text-slate-600 mt-4">
                {project.description}
              </p>

              {project.achievements && (
                <div className="mt-4 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span className="text-sm">
                    {project.achievements}
                  </span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-100 text-slate-600 text-xs px-3 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-3 mt-6">

                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-xl text-sm font-medium"
                >
                  <Github className="w-4 h-4" />
                  Repository
                </a>

                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 bg-purple-50 hover:bg-purple-100 text-[#622569] px-4 py-2 rounded-xl text-sm font-medium"
                  >
                    Live Demo
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

              </div>
            </div>
          </div>
        );
      })}
    </div>
          
      {showSubmitModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl p-8 relative max-h-[90vh] overflow-y-auto">

      {/* Close Button */}
      <button
        onClick={() => setShowSubmitModal(false)}
        className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 transition"
      >
        <X className="w-5 h-5 text-slate-600" />
      </button>

      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Submit New Project
      </h2>

      <p className="text-sm text-slate-500 mb-6">
        Share your innovation with the IET CONNECT community.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Project Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Project Title
          </label>

          <input
            type="text"
            required
            value={newProjData.title}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                title: e.target.value,
              })
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tagline
          </label>

          <input
            type="text"
            value={newProjData.tagline}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                tagline: e.target.value,
              })
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* Domain */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Domain
          </label>

          <select
            value={newProjData.domain}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                domain: e.target.value as Project["domain"],
              })
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          >
            <option>AI / ML</option>
            <option>Web Development</option>
            <option>IoT & Embedded</option>
            <option>Robotics</option>
            <option>Cybersecurity</option>
            <option>Mobile App</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Description
          </label>

          <textarea
            rows={5}
            required
            value={newProjData.description}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                description: e.target.value,
              })
            }
            className="w-full border border-slate-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-sm font-medium mb-2">
            GitHub Repository
          </label>

          <input
            type="url"
            required
            value={newProjData.githubUrl}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                githubUrl: e.target.value,
              })
            }
            placeholder="https://github.com/username/project"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* Live Demo */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Live Demo (Optional)
          </label>

          <input
            type="url"
            value={newProjData.demoUrl}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                demoUrl: e.target.value,
              })
            }
            placeholder="https://yourproject.com"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Team Members
          </label>

          <input
            type="text"
            value={newProjData.teamMembersStr}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                teamMembersStr: e.target.value,
              })
            }
            placeholder="Alice, Bob, Charlie"
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Image URL (Optional)
          </label>

          <input
            type="url"
            value={newProjData.imageUrl}
            onChange={(e) =>
              setNewProjData({
                ...newProjData,
                imageUrl: e.target.value,
              })
            }
            placeholder="https://..."
            className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#622569]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">

          <button
            type="button"
            onClick={() => setShowSubmitModal(false)}
            className="px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-100 font-medium"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-[#622569] hover:bg-[#7b2d85] text-white font-semibold transition"
          >
            Submit Project
          </button>

        </div>

      </form>

    </div>
  </div>
)}
</div>
);
};