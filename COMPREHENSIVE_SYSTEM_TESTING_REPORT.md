# Pushpak O2 - Comprehensive System Testing & Architecture Report
## Full Project Walkthrough & Route Flow Analysis

---

## 1. Executive Summary
**Pushpak O2** is an advanced, multi-role aerospace and hackathon management ecosystem built on Next.js 15. The platform integrates complex project lifecycles, role-based access control (RBAC), real-time email notifications, and enterprise-grade SEO. This report details every dashboard, flow, and technical implementation.

---

## 2. Authentication & Security Architecture

### The Gatekeeper: Dual Authentication
The system uses a hybrid authentication model to ensure maximum security and cross-platform compatibility.

1.  **NextAuth (Primary)**: Handles session management, Google OAuth, and Credentials login.
2.  **Custom JWT (Secondary)**: Syncs with NextAuth to provide an `auth-token` HttpOnly cookie used by the middleware for sub-millisecond route protection.

### Middleware Route Protection
Defined in `middleware.js`, the system intercepts every request to `/dashboards/:path*`.

| Target Path | Required Role | Redirect if Unauthorized |
| :--- | :--- | :--- |
| `/dashboards/admin/*` | `admin` | `/dashboards/admin` (internal check) or `/sign-in` |
| `/dashboards/hackathon-managers/*` | `hackathon_manager` | `/dashboards/hackathon-managers` or `/manager-login` |
| `/dashboards/investors/:id/*` | `investor` | `/dashboards/investors/:id` (own ID only) |
| `/dashboards/student/*` | `hackathon_user` | `/dashboards/student` |

---

## 3. Dashboard Access & Account Lifecycle

This section details how different users access their respective portals and how accounts are provisioned.

### A. Admin Dashboard
*   **Access Route**: `/dashboards/admin`
*   **Login Page**: `/sign-in` (Select **Investor / Admin** tab)
*   **Credentials**: Email and Password (or Google OAuth).
*   **Account Creation**: Admin accounts are typically created via direct database seeding or by an existing Admin promoting an Investor account through the User Management tab.
*   **Requirements**: User role must be strictly `admin`.

### B. Hackathon Manager Dashboard
*   **Access Route**: `/dashboards/hackathon-managers`
*   **Login Page**: `/manager-login` (Dedicated secure portal)
*   **Credentials**: Email and Password. Uses `userType: 'manager'` for authentication.
*   **Account Creation**:
    1.  User signs up as an **Investor** via `/sign-in`.
    2.  **Admin** goes to the Admin Dashboard → **Managers Management** or **Website Management (Users)**.
    3.  Admin promotes the user by setting their role to `hackathon_manager`.
*   **Requirements**: User role must be strictly `hackathon_manager`.

### C. Investor Dashboard
*   **Access Route**: `/dashboards/investors/[id]`
*   **Login Page**: `/sign-in` (Select **Investor / Admin** tab)
*   **Credentials**: Email and Password (or Google OAuth).
*   **Account Creation**: Users can self-register via the "Sign Up" toggle on the `/sign-in` page under the Investor tab.
*   **Requirements**: Default role `investor`. Access is restricted to the specific ID belonging to the user.

### D. Student / Participant Dashboard
*   **Access Route**: `/dashboards/student`
*   **Login Page**: `/sign-in` (Select **Hackathon Participant** tab)
*   **Credentials**: Email and Password (or Google OAuth).
*   **Account Creation**: Users can self-register via the "Sign Up" toggle on the `/sign-in` page under the Participant tab.
*   **Requirements**: Role will be automatically set to `hackathon_user`.

---

## 4. Public Route Flows (User Experience)

### A. The Landing Page (`/`)
*   **Purpose**: Brand awareness and aerospace authority.
*   **Key Features**: Hero sections, fleet showcase, technology overview.
*   **Result**: High conversion point for both investors and students.

### B. Hackathon Discovery (`/hackathons`)
*   **Flow**: User visits → System fetches all `isPublished: true` hackathons → Displays dynamic grid.
*   **SEO Excellence**: ItemList schema allows Google to show a carousel of hackathons directly in search results.
*   **Status Indicators**: Live badges for active events, Blue for upcoming.

### C. Hackathon Details (`/hackathons/[slug]`)
*   **Deep Dive**: Shows full overview, timeline, rules, and prizes.
*   **Interaction Logic**:
    *   **Live**: "Register Now" or "Submit Project" buttons active.
    *   **Upcoming**: Shows info toast "Hackathon is not live yet".
    *   **Ended**: Buttons disabled with "Hackathon Ended" text.
*   **Rich Snippets**: Full `Event` schema for Google Rich Results.

---

## 4. Dashboard deep Dive: User Roles

### I. Student / Participant Dashboard (`/dashboards/student`)
*   **Target User**: Students and developers.
*   **Key Features**:
    *   **My Participations**: Tab showing status of all registered hackathons (Pending, Approved, Submitted).
    *   **Direct Actions**: Submit project directly from dashboard.
    *   **Participation History**: Track past hackathon performance.
*   **Result**: Centralized hub for participant engagement.

### II. Investor Dashboard (`/dashboards/investors/[id]`)
*   **Target User**: Stakeholders and VCs.
*   **Tabs**:
    *   **Overview/Performance**: Real-time charts of project traction.
    *   **Portfolio**: List of backed projects.
    *   **Hackathons**: High-level view of innovation pipelines.
    *   **Profile**: Professional details management.
*   **Result**: Transparency and data-driven decision making for investors.

### III. Hackathon Manager Dashboard (`/dashboards/hackathon-managers`)
*   **Target User**: Event organizers.
*   **The Powerhouse**:
    *   **Hackathons Tab**: Full CRUD (Create, Read, Update, Delete) for hackathons.
    *   **Participations Tab**: Approval/Rejection workflow. Click "Mail" to send access tokens.
    *   **Submissions Tab**: View Project code, GitHub links, and Demo videos. Send custom acknowledgment emails.
*   **Result**: End-to-end management of the hackathon lifecycle.

### IV. Admin Dashboard (`/dashboards/admin`)
*   **Target User**: Super-users.
*   **Comprehensive Control**:
    *   **User Management**: Promote users to Managers or Admins.
    *   **Investors Management**: Approve new investor accounts.
    *   **Website Management**: Edit Blogs, Fleet, Technologies, Team, and Footer directly from the UI.
    *   **Analytics**: View sitewide traffic and engagement metrics.
*   **Result**: Total platform governance.

---

## 6. Hackathon Management: Functional Deep Dive

This is the core engine of the platform, managed primarily by **Hackathon Managers** and supervised by **Admins**.

### A. Lifecycle Phase 1: Creation & Configuration
*   **The Tool**: Manager Dashboard → **Hackathons Tab**.
*   **How it Works**:
    *   **Initial Setup**: Manager enters Title (Slug auto-generates), Overview, and Detailed Markdown Description.
    *   **Visuals**: Supports direct file upload for Banners/Logos via **Vercel Blob Storage** or external URL input.
    *   **Timeline Logic**: Precise date pickers for Start, End, Registration Deadline, and Submission Deadline.
    *   **Team Dynamics**: Toggle between **Individual (SOLO)** or **Team Based** with configurable member limits.
    *   **Economics**: Modular prize pool configuration (Total pool, 1st, 2nd, 3rd, and additional prizes).
    *   **Resources**: Structured input for Rules, Eligibility, Allowed Technologies, and Resource Links.
*   **Result**: A comprehensive metadata object stored in MongoDB, ready for public discovery.

### B. Lifecycle Phase 2: Registration & Gatekeeping
*   **The User**: Public visitor/logged-in Student.
*   **How it Works**:
    *   User navigates to `/hackathons/[slug]`.
    *   System performs a status check: If `status !== 'LIVE'`, registration button is disabled with a "Hackathon not live" toast.
    *   If `LIVE`, user clicks "Register Now". System creates a `Participation` model entry with `PENDING` status.
*   **Result**: Registration is recorded but restricted until human approval.

### C. Lifecycle Phase 3: Review & Approval Workflow
*   **The Tool**: Manager Dashboard → **Participations Tab**.
*   **How it Works**:
    *   Manager views a real-time list of applicants filtered by Hackathon.
    *   **Action "Approve"**: Updates status to `APPROVED`. System instantly generates a unique **32-char hex Participation Code** and a matching **Token** record (30-day expiry).
    *   **Action "Reject"**: Updates status to `REJECTED`, notifying the user in their dashboard.
*   **Result**: Quality control over participant intake.

### D. Lifecycle Phase 4: Secure Accessory (The Token Email)
*   **The Tool**: Manager Dashboard → Participations Tab → **Mail Icon**.
*   **How it Works**:
    *   Clicking the icon triggers a server-side request to the Email API.
    *   System uses **Nodemailer** + **Gmail SMTP** to deliver a professional HTML token email.
    *   **Security Tracker**: Once sent, the UI icon turns **Green** (indicating `tokenSent: true`).
*   **Result**: Secure delivery of credentials for project submission.

### E. Lifecycle Phase 5: Submission & Verification
*   **The User**: Approved Student with Access Token.
*   **How it Works**:
    *   Student opens the hackathon detail page.
    *   If `APPROVED`, "Submit Project" button is visible.
    *   Submission form requires: **Access Token**, **GitHub Repo**, **Demo Video Link**, and **Description**.
    *   **Validation**: System verifies:
        1. Token is correct.
        2. Token is not yet used (`isUsed: false`).
        3. Token has not expired.
        4. Participation belongs to the logged-in user and is `APPROVED`.
*   **Result**: High-integrity submission process preventing fraudulent entries.

### F. Lifecycle Phase 6: Review & Final Acknowledgment
*   **The Tool**: Manager Dashboard → **Submissions Tab**.
*   **How it Works**:
    *   Manager reviews the project code and demo.
    *   **Acknowledge Feature**: Manager clicks the Mail icon. A modal pops up with a **Custom Email Composer**.
    *   Manager can type a personalized thank-you or feedback message.
    *   Systems deliver the acknowledgment email via SMTP.
*   **Result**: Personalized closure of the student journey, enhancing platform professionality.

---

## 6. Technical & SEO Implementation

### SEO Strategy
*   **Structured Data**: Implemented `Event`, `Organization`, `ItemList`, and `BreadcrumbList` schemas.
*   **Dynamic Assets**: `sitemap.js` and `robots.js` auto-generate based on database content.
*   **Social Preview**: Full Open Graph (OG) and Twitter Card support for every hackathon.

### Performance & PWA
*   **PWA**: `manifest.json` allows the site to be installed on mobile/desktop.
*   **Optimization**: Next/Image for banner optimization, SSR for SEO critical pages, and Turbopack for fast builds.

### Testing Results
*   ✅ **Authentication**: No infinite loops (Ref-guard fixed).
*   ✅ **RBAC**: Unauthorized users are strictly redirected.
*   ✅ **Email**: Nodemailer transport successfully handles Gmail SMTP.
*   ✅ **Data Population**: Fixed deep population to ensure Participant names show correctly in Submissions.
*   ✅ **Build**: Resolved "id undefined" error by refactoring API route dependencies.

---

## 7. Conclusion
The Pushpak O2 ecosystem is now a fully integrated, high-performance platform. It successfully bridges the gap between aerospace innovation and community engagement through its robust hackathon management system. All dashboards are functional, flows are secured, and the system is ready for production-scale traffic.

**Report Version**: 1.1  
**Last Updated**: January 23, 2026  
**Status**: ✅ **System Fully Operational**
