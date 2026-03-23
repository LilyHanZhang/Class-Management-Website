Project Specification: ScholarSync (Local Class Management System)

1. Project Overview

ScholarSync is a professional, locally-run class management dashboard designed for teachers. It focuses on a clean, "sidebar-first" UI to manage students, schedules, assignments, and grades efficiently.

2. Technical Stack (Recommended)

Frontend: React with Tailwind CSS (for modern, responsive UI).

Icons: Lucide-React.

State Management: React Context API or standard useState/useEffect.

Backend/Storage: - Initial Phase: In-memory state / LocalStorage.

Persistence Upgrade: SQLite (for local Python/Node backends) or Firestore (for cloud).

3. Core Data Models (Schema)

Student

{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "avatar": "url_or_initials",
  "status": "at-risk | stable | excelling",
  "enrollmentDate": "iso-date"
}


Class/Subject

{
  "id": "uuid",
  "title": "string",
  "code": "string",
  "schedule": { "days": ["Mon", "Wed"], "time": "10:00 AM" },
  "color": "hex-code"
}


Assignment

{
  "id": "uuid",
  "classId": "uuid",
  "title": "string",
  "dueDate": "iso-date",
  "totalPoints": "number",
  "submissions": [{ "studentId": "uuid", "grade": "number", "status": "submitted | missing" }]
}


4. UI/UX Architecture

Layout: The "Command Center" Shell

Sidebar (Fixed Left):

Logo & App Name.

Navigation: Dashboard, Roster, Schedule, Gradebook, Resources.

Bottom: User Profile & Dark Mode Toggle.

Header (Top):

Search bar (Global student/class search).

Quick Action Button: "Add Student" or "New Assignment".

Notifications Bell.

Main View (Scrollable Center):

Card-based layout with ample whitespace.

Module Breakdown

A. Dashboard (The Summary)

Metric Cards: 3-4 cards showing: Total Students, Class Average (%), Upcoming Deadlines, Attendance Rate.

Activity Feed: List of recent events (e.g., "Liam submitted Essay 1").

Quick Schedule: Today's classes in a vertical timeline.

B. Roster (Student Management)

Search & Filter: Filter by status (At-Risk) or Grade Level.

Data Table: - Columns: Name, Email, Status Badge, Actions (Edit/Delete).

Modal: "Add Student" form with validation.

C. Gradebook (The Grid)

Spreadsheet UI: Sticky first column (Student Name).

Inline Editing: Click a cell to enter a grade.

Visual Cues: Cells color-coded by grade (Red < 60, Green > 90).

D. Schedule (The Calendar)

Monthly Grid: Integration of class times and assignment due dates.

Sidebar List: "Coming up this week" summary.

5. Implementation Roadmap (Vibe Coding Steps)

Step 1: Layout Setup - Create the App component with the Sidebar and Topbar. Use a currentView state to toggle between modules.

Step 2: State Initialization - Create mock data for Students and Classes to visualize the UI immediately.

Step 3: Roster Logic - Build the student table with add and delete functions. Implement a modal for student entry.

Step 4: Gradebook Grid - Build a horizontal scrolling table where columns represent assignments and rows represent students.

Step 5: Dashboard Analytics - Write helper functions to calculate averages and counts from the student/assignment arrays and display them in cards.

Step 6: Dark Mode & Polish - Implement Tailwind dark: classes and transition effects for a premium feel.

6. Professional Design Principles

Rounded Corners: Use rounded-xl for cards and rounded-lg for buttons.

Typography: Primary: Inter/Sans-serif (14px for body, 18px-24px for headers).

Interactive States: Hover effects on sidebar items and table rows.

Empty States: Clear "No students added yet" messages with an action button to reduce user confusion.