# CourseSphere

CourseSphere is a comprehensive university course registration system that streamlines the process of course selection, registration, and management for students, advisors, and administrators. Built with Next.js and MySQL, the platform offers an intuitive interface for various stakeholders in the academic ecosystem.

## Team Members and Roles

- **Jakaria Chowdhury Tajwone** - Team Lead, Backend Developer, Database Administrator
- **Md Masum Pradhania** - Frontend Developer (Admin Interface)
- **Mohammad Oli** - Frontend Developer (Student/User Interface)

## Features

- **Student Portal**:
  - Course browsing and selection with filtering options
  - Course registration with prerequisite verification
  - Payment processing for tuition and fees
  - Registration status tracking
  - Dashboard with important dates and registration updates
  - Notice board for important announcements


## Administrative Roles

- **Super Admin**:
  - Management of all administrative accounts (HODs, Exam Controllers, Accounts Admins)
  - User role assignment and permission control
- **Head of Department (HOD)**:
  - Department-specific course management (add/edit/activate/deactivate)
  - Advisor account management within department
  - Student account approval and management
  - Course registration review and approval
  - Deadline setting for department registration periods
  - Department notice creation and publication

- **Accounts Admin**:
  - Financial calculation for student registrations
  - Tuition fee management based on credit hours
  - Various fee management (semester fees, library fees, etc.)

- **Exam Controller**:
  - Result entry and management
  - Grade processing 
  - Academic record maintenance


- **Advisor System**:
  - Course approval workflow
  - Student advisement and guidance
  - Comment and feedback system for student registrations

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL
- **Authentication**: Custom JWT-based authentication

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- MySQL Server
- PNPM package manager (recommended)

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/tajwone17/coursesphere.git
   cd coursesphere
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   - Create a `.env.local` file in the root directory
   - Add the following variables:

   ```
   DATABASE_URL="mysql://username:password@localhost:3306/coursesphere"
   JWT_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
   EMAIL_FROM="noreply@coursesphere.com"
   ```

4. **Set up the database**
   - Import the database schema from `Schema/CourseSphere.sql`

   ```bash
   mysql -u username -p coursesphere < Schema/CourseSphere.sql
   ```

5. **Run the development server**

   ```bash
   pnpm dev
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment

The application can be deployed on platforms like Vercel or any other hosting service that supports Next.js applications.

## Learn More

For more information about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
