import React, { useState, useEffect } from 'react';
import {
  User,
  Event,
  Project,
  Announcement,
  Opportunity,
  Resource,
} from './types';

import { api, removeStoredToken } from './api';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { ProfileView } from './components/ProfileView';
import { EventsView } from './components/EventsView';
import { ProjectsView } from './components/ProjectsView';
import { OpportunitiesView } from './components/OpportunitiesView';
import { ResourcesView } from './components/ResourcesView';
import { MembersView } from './components/MembersView';
import { AnnouncementsView } from './components/AnnouncementsView';

import {
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function App() {
  // ==========================
  // State
  // ==========================

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const [searchQuery, setSearchQuery] = useState('');

  // Dark Mode
  const [darkMode, setDarkMode] = useState(false);

  // Backend Data
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [members, setMembers] = useState<User[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success'
  ) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // ==========================
  // Load Dashboard Data
  // ==========================

  const loadAppData = async () => {
    try {
      const [summary, memRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getMembers(),
      ]);

      setEvents(summary.events);
      setProjects(summary.projects);
      setAnnouncements(summary.announcements);
      setOpportunities(summary.opportunities);
      setResources(summary.resources);

      if (memRes.success) {
        setMembers(memRes.members);
      }
    } catch (error) {
      console.error('Failed to load application data.', error);
      showToast('Failed to load application data.', 'error');
    }
  };

  // ==========================
  // Initial Load
  // ==========================

  useEffect(() => {
    const initialize = async () => {
      try {
        const meRes = await api.getMe();

        if (meRes.success && meRes.user) {
          setCurrentUser(meRes.user);
        }
      } catch (error) {
        console.warn('No active session found.');
      } finally {
        setAuthChecking(false);
      }

      loadAppData();
    };

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
      setDarkMode(true);
    }

    initialize();
  }, []);

  // ==========================
  // Save Theme
  // ==========================

  useEffect(() => {
    localStorage.setItem(
      'theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  // ==========================
  // Authentication
  // ==========================

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setActiveTab('dashboard');

    showToast(`Welcome, ${user.username}!`);

    loadAppData();
  };

  const handleLogout = () => {
    removeStoredToken();

    setCurrentUser(null);

    setActiveTab('auth');

    showToast('Logged out successfully.');
  };

  // ======================================================
  // Event Registration Handler
  // ======================================================

const handleRegisterEvent = async (eventId: string) => {
  if (!currentUser) {
    setActiveTab('auth');
    showToast('Please sign in to register for events.', 'error');
    return;
  }

  try {
    const res = await api.registerEvent(eventId);

    if (res.success && res.event) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? res.event! : event
        )
      );

      showToast('Successfully registered for the event.');
    } else {
      showToast(res.message || 'Registration failed.', 'error');
    }
  } catch (error) {
    console.error(error);
    showToast('Unable to register for the event.', 'error');
  }
};

// ==========================
// Like Project
// ==========================

const handleLikeProject = async (projectId: string) => {
  if (!currentUser) {
    setActiveTab('auth');
    showToast('Please sign in to like projects.', 'error');
    return;
  }

  try {
    const res = await api.toggleLikeProject(projectId);

    if (res.success && res.project) {
      setProjects((prev) =>
        prev.map((project) =>
          project.id === projectId ? res.project! : project
        )
      );

      showToast('Project liked successfully.');
    } else {
      showToast(res.message || 'Unable to like project.', 'error');
    }
  } catch (error) {
    console.error(error);
    showToast('Unable to like project.', 'error');
  }
};

// ==========================
// Submit Project
// ==========================

const handleSubmitProject = async (
  projectData: Partial<Project>
): Promise<boolean> => {
  try {
    const res = await api.submitProject(projectData);

    if (res.success && res.project) {
      setProjects((prev) => [res.project!, ...prev]);

      showToast('Project submitted successfully.');

      return true;
    }

    showToast(res.message || 'Project submission failed.', 'error');
    return false;
  } catch (error) {
    console.error(error);
    showToast('Unable to submit project.', 'error');
    return false;
  }
};

// ==========================
// Create Event
// ==========================

const handleCreateEvent = async (
  eventData: Partial<Event>
): Promise<boolean> => {
  try {
    const res = await api.createEvent(eventData);

    if (res.success && res.event) {
      setEvents((prev) => [res.event!, ...prev]);

      showToast('Event created successfully.');

      return true;
    }

    showToast(res.message || 'Unable to create event.', 'error');
    return false;
  } catch (error) {
    console.error(error);
    showToast('Unable to create event.', 'error');
    return false;
  }
};

// ==========================
// Create Opportunity
// ==========================

const handleCreateOpportunity = async (
  oppData: Partial<Opportunity>
): Promise<boolean> => {
  try {
    const res = await api.createOpportunity(oppData);

    if (res.success && res.opportunity) {
      setOpportunities((prev) => [res.opportunity!, ...prev]);

      showToast('Opportunity created successfully.');

      return true;
    }

    showToast(res.message || 'Unable to create opportunity.', 'error');
    return false;
  } catch (error) {
    console.error(error);
    showToast('Unable to create opportunity.', 'error');
    return false;
  }
};
// ==========================
// Create Resource
// ==========================

const handleCreateResource = async (
  resData: Partial<Resource>
): Promise<boolean> => {
  try {
    const res = await api.createResource(resData);

    if (res.success && res.resource) {
      setResources((prev) => [res.resource!, ...prev]);

      showToast('Resource added successfully.');

      return true;
    }

    showToast(res.message || 'Unable to add resource.', 'error');
    return false;
  } catch (error) {
    console.error(error);
    showToast('Unable to add resource.', 'error');
    return false;
  }
};

// ==========================
// Update Profile
// ==========================

const handleUpdateProfile = async (
  profileData: Partial<User>
): Promise<boolean> => {
  try {
    const res = await api.updateProfile(profileData);

    if (res.success && res.user) {
      setCurrentUser(res.user);

      showToast('Profile updated successfully.');

      loadAppData();

      return true;
    }

    showToast(res.message || 'Unable to update profile.', 'error');
    return false;
  } catch (error) {
    console.error(error);
    showToast('Unable to update profile.', 'error');
    return false;
  }
};