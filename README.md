# ScholarSync - Class Management Website

## Project Description
ScholarSync is a comprehensive class management website for educators and students. It simplifies the process of managing class rosters, tracking assignments and grades, scheduling classes, and sharing resources. This project was created as a class assignment for the Vibe Coding Course.

## Features
- **Class Scheduling**: Visualize and manage your weekly class schedule with color-coded blocks.
- **Roster Management**: Add, edit, and delete students(please scroll **right**). View student status (excelling, stable, at-risk) at a glance.
- **Gradebook**: A dynamic gradebook to track student performance across different assignments and exams.
- **Assignment Tracking**: Create, update, and manage assignments with due dates and total points.
- **Resource Sharing**: Upload and download documents (notes, assignments, etc.) for your classes.
- **Notifications**: Real-time notifications for actions like adding students or classes.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Data Persistence**: All changes (students, classes, grades, files) are saved locally in your browser's LocalStorage, so your data persists across sessions.

## How to Install and Run Locally

To get this project up and running on your local machine, follow these steps:

### Prerequisites
- **Node.js**: Ensure you have Node.js installed. You can check by running `node -v` in your terminal. If not installed, download it from [nodejs.org](https://nodejs.org/).
- **Git**: Ensure you have Git installed to clone the repository.

### Installation Steps

1.  **Clone the Repository**
    Open your terminal or command prompt and run:
    ```bash
    git clone <repository-url>
    cd Class-Management-Website/scholar-sync
    ```
    *(Note: Replace `<repository-url>` with the actual URL of this GitHub repository.)*

2.  **Install Dependencies**
    Install the required npm packages:
    ```bash
    npm install
    ```

3.  **Start the Development Server**
    Run the following command to start the application in development mode:
    ```bash
    npm run dev
    ```

4.  **Open in Browser**
    The terminal will show a local URL, typically:
    `http://localhost:5173/`
    Open this link in your web browser to use the application.

## How to Use

1.  **Dashboard**: The landing page gives you an overview of your total students, class average, and recent activity.
2.  **Roster**: Go here to add new students. Click "Add Student" to create a profile. You can also search for students or filter them by status. Scroll **right** to edit and delete students.
3.  **Schedule**: Add your classes here. Click "Add Class" to define the course title, code, time, and days. Click on a class card to edit its details.
4.  **Gradebook**:
    - **Add Exam**: Click "Add Exam" to create a new assignment column.
    - **Enter Grades**: Click on any cell in the grid to input a grade for a student. The cell color changes based on the score range.
    - **Edit Exam**: Click on the exam title in the table header to edit its details.
5.  **Resources**: Upload class materials by dragging and dropping files or clicking the upload area. You can download files by clicking the download icon.

## Technologies Used
- React 19
- TypeScript
- Tailwind CSS
- Vite
- Lucide React (Icons)

