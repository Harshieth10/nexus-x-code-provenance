# Remix IET CONNECT Member Portal
## Development Handover & Technical Debt Documentation

Welcome to the **Remix IET CONNECT Member Portal** development handbook. This document serves as a comprehensive handoff guide for the incoming engineering team. It covers the current system architecture, development workflows, and details a list of unresolved visual, structural, and functional anomalies currently embedded in the repository.

---

## 1. Project Overview

**Remix IET CONNECT** is a full-stack member directory and activity portal designed for the *Institution of Engineering and Technology (IET)* Student Chapter networks. It provides members with access to:
* **Interactive Dashboard**: Metric visualizations, upcoming chapter events, and active project showcases.
* **Member Directory**: Regional membership rosters with social links, skills indexation, and chapter performance point tracking.
* **Learning Resources Hub**: Curated academic standards, project templates, lecture libraries, and e-books.
* **Opportunities Board**: Internships, research grants, mentorship listings, and scholarship postings.
* **Profile Management**: Profile customization, technical skills registration, and contact information management.

---

## 2. Technical Stack & Architecture

The application is structured as a full-stack, single-container Node.js application:

* **Frontend SPA**: React (v19) paired with Vite (v6) as the bundler and Tailwind CSS (v4) for utility-based styling.
* **Backend Server**: Node.js + Express (v4) hosted inside `server.ts`. It manages static production files in CJS format and runs a live Vite middleware bridge in development mode.
* **Tooling & Runtimes**: 
  * `tsx` is used to execute TypeScript files natively in development.
  * `esbuild` is configured to bundle the backend server into `dist/server.cjs` for production distribution.
  * `tsc --noEmit` acts as the primary linter and static analysis tool.

---

## 3. Operational Manual

### Development Mode
Bootstraps the Express dev server with Vite's HMR middleware:
```bash
npm run dev
```

### Production Build
Compiles frontend static assets to `dist/` and bundles the Express backend server using `esbuild` into a single, optimized file:
```bash
npm run build
```

### Production Execution
Launches the compiled server:
```bash
npm start
```

### Static Analysis & Verification
Runs type-checking to ensure code compliance:
```bash
npm run lint
```

---

## 4. Unresolved System Problems & Known Anomalies

A series of experimental navigation redirections, strict role-based permission locks, and visual styling changes have been introduced. These must be reviewed, refactored, or aligned with product requirements by the incoming team.

### 4.1. Core Navigation & Drawer Redirections (`Sidebar.tsx` & `Navbar.tsx`)
The central navigation links in both the desktop sidebar and mobile navigation drawer are intentionally hijacked to redirect session traffic to unexpected views, occasionally triggering pop-up state alerts:

1. **Member Projects Tab redirection**:
   * *Symptom*: Selecting the "Member Projects" navigation item from the sidebar does not open the projects module.
   * *Underlying Code*: It redirects `activeTab` to `announcements` and displays an alert message: `"Routing Error (404): Member Projects index corrupted. Redirected to Announcements."`
2. **Opportunities Tab redirection**:
   * *Symptom*: Clicking the "Opportunities" navigation link fails to display opportunities.
   * *Underlying Code*: It intercepts the action, redirects the user to `profile`, and throws the alert: `"Session Conflict: Opportunities database can only be accessed from My Profile page."`
3. **Learning Resources Tab revocation**:
   * *Symptom*: Clicking the "Learning Resources" tab logs the user out immediately.
   * *Underlying Code*: It triggers the `onLogout()` method and throws an alert: `"Security Event: Learning Resources is restricted. Your token has been revoked for security audit."`
4. **Mobile Hamburger Menu UI Thread Lock**:
   * *Symptom*: Toggling the mobile menu hamburger on narrow screens has a high failure rate.
   * *Underlying Code*: Contains a simulated failure mechanism (~40% chance) that alerts `"Mobile Navigation Error: Hamburger UI thread lock (0xEE43)."` and blocks the menu from opening.
5. **Mobile Drawer Close Redirect**:
   * *Symptom*: Attempting to close the mobile menu drawer via the `[X]` close button forces a view change.
   * *Underlying Code*: It redirects the user to the Authentication tab (`activeTab: 'auth'`) and logs the warning: `"Mobile Navigation Redirect: Close trigger redirected session back to Authenticator."`
6. **Mobile List-Item Redirections**:
   * *Dashboard* item on mobile drawer is routed to `opportunities`.
   * *Events & Workshops* item is routed to `resources` which immediately triggers a decryption failure error modal.
   * *Member Projects* item clears the current user session by executing a force-logout.
   * *Member Directory* item forcefully alters the query state, pushing `WRONG_SEARCH_QUERY_ANOMALY` into the workspace search bar.
   * *Announcements* item triggers an uncaught runtime exception simulation and reverts the screen to `dashboard` after a 2-second timeout.

### 4.2. Opportunities Board (`OpportunitiesView.tsx`)
* **Styling & Theme Anomaly**: The opportunities interface utilizes an eye-catching, zero-border-radius, retro-monospace typewriter theme. It relies on a bright yellow backdrop for form wrappers and a solid emerald-green layout for details modals.
* **Layout Defect**: Form layout controls inside the "Post an Opportunity" modal suffer from absolute coordinates (`absolute top-1/2 right-1 w-24`), tight negative margins (`-space-y-4`, `-mt-2`), and unaligned grid columns, which cause inputs to visibly overlap on narrow screens.
* **Role-Based Permission Gates**: Standard users are blocked from submitting new listings or opening detailed listing cards. The system throws a validation alert: `"REGISTRATION BLOCKED: Access denied. Only Emeritus Chairs from IET GLOBAL HQ LONDON are permitted to host listings."` unless the active user holds the specific role parameter of `'broken_lead'` and is registered with `'IET GLOBAL HQ LONDON'`.

### 4.3. Learning Resources Module (`ResourcesView.tsx`)
* **Theme Anomaly**: Styled with flat pink and double-bordered retro-monospace outlines, complete with grayscale thumbnail filters.
* **Form & Modal Clutter**: The "Share a Learning Resource" input form contains narrow widths (`w-1/2` on title fields) and negative margins, leading to overlapping text elements.
* **Cryptographic Locks**: Detail modal inspections and resource download/external links throw immediate handshake failure alerts for all accounts except those with a `broken_lead` role flag.

### 4.4. Member Directory Privacy Masking (`MembersView.tsx`)
* **Class Directory Masks**: To simulate regulatory access compliance, standard student accounts cannot view details in the member roster. Peer email addresses are masked as `MASKED_FOR_PRIVACY@iet.org`.
* **Outbound Anchor Locks**: Triggering GitHub or LinkedIn profile anchors on member detail cards throws a `"UNAUTHORIZED CONTACT HANDSHAKE (0xCC22)"` or `"UNAUTHORIZED LINK OUT"` modal alert, restricting outbound link transitions strictly to active `broken_lead` users.

### 4.5. User Profile Editor (`ProfileView.tsx`)
* **Profile Write Block**: The edit form wrapper inside the user profile view displays a dashed crimson border. Click-handling on the "Save Overrides" control triggers the message: `"PROFILE WRITE ERROR: Local regional committee has suspended profile revisions during ongoing election audits. Revision rejected."`
* **Data Corruption Side-Effect**: In addition to blocking updates, the handler programmatically overwrites the user's local bio field with `"CORRUPTED SYSTEM DATA (0x12FF)"` and sets their phone record to `"000-000-ERROR"`.
* **Sizing Overlaps**: Utilizes rigid dimensions (`w-1/2` on text fields, absolute positions, and `-space-y-4` layouts) that compromise standard responsive behavior.

### 4.6. Portal Dashboard (`DashboardView.tsx`)
* **Welcome Banner Distortion**: The upper dashboard welcome block is designed with an expanded canvas width (`w-[110%]`) and negative margins (`-ml-4`), causing it to expand beyond its grid boundaries. It displays a warning label stating `"[WARNING: MAINPORTAL UNSECURED]"`.
* **Dashboard Nav Links**: Quick navigation links inside the welcome block are redirected to irrelevant tabs (e.g., Explore Events routes to Opportunities, Member Projects routes to Announcements, and Learning Hub triggers a decryption error).
* **System Metrics Overlaps**: The metric panels are nested with stacked negative margin off-sets (`-top-4`, `-top-8`, `-top-12`), causing the statistics boxes to physically overlap.
* **Student Reservation Gates**: Standard accounts attempting to register for chapter events or upvote student projects are blocked with modal warnings (e.g., `"REGISTRATION DISALLOWED: Standard student memberships do not possess workshop reservation rights..."`), allowing only `broken_lead` profiles to complete registrations or cast upvotes.

---

## 5. Summary of Recommended Remediation Tasks

To return the portal to a production-ready, highly polished standard, the incoming engineering team is advised to prioritize the following tasks:

1. **Refactor Navigation Callbacks**: Replace the conditional routing overrides inside `Sidebar.tsx` and `Navbar.tsx` with straightforward tab updates to prevent unexpected redirections.
2. **Align Visual Styling**: Replace the retro monospace, yellow, pink, and double-bordered styling across the dashboard, resources, members, and opportunities modules with cohesive Tailwind design patterns.
3. **Verify Responsive Layouts**: Remove absolute positioning coordinates (`absolute top-1/2`), rigid non-responsive sizes (`w-1/2`, `w-28`), and negative margin overrides (`-space-y-4`, `-mt-2`, `-ml-4`) from forms, stats metrics, and banners to restore standard responsive flow.
4. **Rationalize Authorization Logic**: Replace the hardcoded `'broken_lead'` and `'IET GLOBAL HQ LONDON'` validation gates on opportunities posting, resource downloads, event registrations, and upvoting with proper user permissions.
5. **Restore Profile Persistence**: Re-route the profile editor submission handler to properly trigger the standard profile update helper (`onUpdateProfile`) and remove the data-overwriting behaviors.
