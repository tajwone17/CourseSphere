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

## Project Documentation

For detailed information about the project design, implementation, and usage:

- [Project Documentation (PDF)](https://drive.google.com/file/d/1ZqgAR5cJnVFl3vImLK9OXw4VMLBC3fPZ/view?usp=drive_link)
- [Presentation Slides](https://docs.google.com/presentation/d/1b1cLRVDV8ChjcqbLyvh-j7U-7FdD2lY1/edit?usp=drive_link&ouid=112036969322105322633&rtpof=true&sd=true)

## Screenshots

### Student Interface

|                     Student Dashboard                     |                   Course Catalog                    |                  Course Cart                  |
| :-------------------------------------------------------: | :-------------------------------------------------: | :-------------------------------------------: |
| ![Student Dashboard](Screenshots/student%20dashboard.png) | ![Course Catalog](Screenshots/Course%20Catalog.png) | ![Course Cart](Screenshots/Course%20Cart.png) |

|                 Registration Status                  |                       Status After Payment                        |                       Profile Change Password                       |
| :--------------------------------------------------: | :---------------------------------------------------------------: | :-----------------------------------------------------------------: |
| ![Registration Status](Screenshots/reg%20status.png) | ![Status After Payment](Screenshots/status%20after%20payment.png) | ![Profile Change Password](Screenshots/profile-change-password.png) |

### Admin Login & Dashboard

![Admin Login](Screenshots/admin-login.png)

### Super Admin Interface

|                       Managing HODs                       |                            Managing Accounts Admin                             |                              Managing Exam Controllers                              |
| :-------------------------------------------------------: | :----------------------------------------------------------------------------: | :---------------------------------------------------------------------------------: |
| ![Managing HODs](Screenshots/superadmin-managing-hod.png) | ![Managing Accounts Admin](Screenshots/superadmin-managing-accounts-admin.png) | ![Managing Exam Controllers](Screenshots/super-admin-managing-exam-controllers.png) |

### Head of Department (HOD) Interface

|                  HOD Dashboard                  |                     Managing Courses                      |                     Managing Advisors                      |
| :---------------------------------------------: | :-------------------------------------------------------: | :--------------------------------------------------------: |
| ![HOD Dashboard](Screenshots/HOD-dashboard.png) | ![Managing Courses](Screenshots/hod-managing-courses.png) | ![Managing Advisors](Screenshots/hod-managing-advisor.png) |

|                          Student Account Activation                           |                        Managing Notices & Deadlines                        |               Reviewing Registration Requests                |
| :---------------------------------------------------------------------------: | :------------------------------------------------------------------------: | :----------------------------------------------------------: |
| ![Student Account Activation](Screenshots/hod-student-account-activation.png) | ![Managing Notices](Screenshots/hod-managing-notices%20and%20deadlnes.png) | ![Reviewing Requests](Screenshots/hod-reviewing-request.png) |

### Advisor Interface

|                    Reviewing Registration Requests                    |                           Registration Review                           |
| :-------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| ![Reviewing Requests](Screenshots/advisor%20reviewing%20requests.png) | ![Registration Review](Screenshots/Registration%20review%20advisor.png) |

### Accounts Admin Interface

![Accounts Admin Review](Screenshots/accounts%20admin%20review.png)

### Exam Controller Interface

|                             Managing Results                              |                              Updating Results                              |
| :-----------------------------------------------------------------------: | :------------------------------------------------------------------------: |
| ![Managing Results](Screenshots/exam%20ontroller%20managing%20result.png) | ![Updating Results](Screenshots/exam-controller%20-updating%20results.png) |

### General Pages

|                 About Page                  |                  Contact Page                   |               Notices               |
| :-----------------------------------------: | :---------------------------------------------: | :---------------------------------: |
| ![About Page](Screenshots/About%20Page.png) | ![Contact Page](Screenshots/Contact%20page.png) | ![Notices](Screenshots/Notices.png) |

## Learn More

For more information about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
