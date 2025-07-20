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
  - Account credentials are sent to users via email upon creation
- **Head of Department (HOD)**:
  - Department-specific course management (add/edit/activate/deactivate)
  - Advisor account management within department
  - Student account approval and management
  - Course registration review and approval
  - Deadline setting for department registration periods
  - Department notice creation and publication
  - Advisor account credentials are sent via email upon creation

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

## Account Management

All administrative users (HODs, Advisors, Accounts Admins, and Exam Controllers) receive their account credentials via email when their accounts are created by their respective administrators:

- Super Admin creates accounts for HODs, Accounts Admins, and Exam Controllers
- HODs create accounts for Advisors within their department
- All created accounts receive login details via the email address provided during account creation

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

### Landing Page

<img src="Screenshots/landing-page.png" width="800">

### Student Interface

### Authentication Pages

|                    Student Sign In                     |                    Student Sign Up                     |
| :----------------------------------------------------: | :----------------------------------------------------: |
| <img src="Screenshots/student-signin.png" width="500"> | <img src="Screenshots/student-signup.png" width="500"> |

|                      Student Dashboard                      |                      Course Catalog                      |                      Course Cart                      |
| :---------------------------------------------------------: | :------------------------------------------------------: | :---------------------------------------------------: |
| <img src="Screenshots/student%20dashboard.png" width="500"> | <img src="Screenshots/Course%20Catalog.png" width="500"> | <img src="Screenshots/Course%20Cart.png" width="500"> |

|                 Registration Status                  |                       Status After Payment                       |                     Profile/Change Password                     |
| :--------------------------------------------------: | :--------------------------------------------------------------: | :-------------------------------------------------------------: |
| <img src="Screenshots/reg%20status.png" width="500"> | <img src="Screenshots/status%20after%20payment.png" width="500"> | <img src="Screenshots/profile-change-password.png" width="500"> |

### Admin Login & Dashboard

<img src="Screenshots/admin-login.png" width="700">

### Super Admin Interface

|                          Managing HODs                          |                          Managing Accounts Admin                           |                           Managing Exam Controllers                           |
| :-------------------------------------------------------------: | :------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| <img src="Screenshots/superadmin-managing-hod.png" width="500"> | <img src="Screenshots/superadmin-managing-accounts-admin.png" width="500"> | <img src="Screenshots/super-admin-managing-exam-controllers.png" width="500"> |

### Head of Department (HOD) Interface

|                     HOD Dashboard                     |                       Managing Courses                       |                      Managing Advisors                       |
| :---------------------------------------------------: | :----------------------------------------------------------: | :----------------------------------------------------------: |
| <img src="Screenshots/HOD-dashboard.png" width="500"> | <img src="Screenshots/hod-managing-courses.png" width="500"> | <img src="Screenshots/hod-managing-advisor.png" width="500"> |

|                       Student Account Activation                       |                         Managing Notices & Deadlines                          |                Reviewing Registration Requests                |
| :--------------------------------------------------------------------: | :---------------------------------------------------------------------------: | :-----------------------------------------------------------: |
| <img src="Screenshots/hod-student-account-activation.png" width="500"> | <img src="Screenshots/hod-managing-notices%20and%20deadlnes.png" width="500"> | <img src="Screenshots/hod-reviewing-request.png" width="500"> |

|                      HOD Review                      |                           Student Registration Management                           |
| :--------------------------------------------------: | :---------------------------------------------------------------------------------: |
| <img src="Screenshots/HOD%20Review.png" width="500"> | <img src="Screenshots/hod-managing-student-regsitration%20request.png" width="500"> |

### Advisor Interface

|                    Reviewing Registration Requests                     |                           Registration Review                           |
| :--------------------------------------------------------------------: | :---------------------------------------------------------------------: |
| <img src="Screenshots/advisor%20reviewing%20requests.png" width="500"> | <img src="Screenshots/Registration%20review%20advisor.png" width="500"> |

### Accounts Admin Interface

<img src="Screenshots/accounts%20admin%20review.png" width="700">

### Exam Controller Interface

|                               Managing Results                               |                               Updating Results                                |
| :--------------------------------------------------------------------------: | :---------------------------------------------------------------------------: |
| <img src="Screenshots/exam%20ontroller%20managing%20result.png" width="500"> | <img src="Screenshots/exam-controller%20-updating%20results.png" width="500"> |

### General Pages

|                      About Page                      |                      Contact Page                      |                     Notices                     |
| :--------------------------------------------------: | :----------------------------------------------------: | :---------------------------------------------: |
| <img src="Screenshots/About%20Page.png" width="500"> | <img src="Screenshots/Contact%20page.png" width="500"> | <img src="Screenshots/Notices.png" width="500"> |

## Learn More

For more information about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
