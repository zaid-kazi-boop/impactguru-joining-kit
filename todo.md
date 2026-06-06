# ImpactGuru Joining Kit - Project TODO

## Core Features

### Database & Backend
- [x] Design and create database schema for joining kit submissions
- [x] Create tRPC procedures for form submission and retrieval
- [x] Implement owner notification system on new submissions
- [x] Add search and filter functionality for HR dashboard

### Employee Form (Multi-Step)
- [x] Step 1: Personal & Contact Details (18 fields)
- [x] Step 2: Employment Details (9 fields)
- [x] Step 3: KYC & Bank Details (6 fields)
- [x] Step 4: Family & PF Details (12 fields)
- [x] Step 5: Digital Signature Pad
- [x] Step 6: Review & Generate Summary
- [x] Fix alignment issues in form layout
- [x] Implement responsive grid layout across all steps
- [x] Add auto-fill logic (permanent address copies from current address)
- [x] Implement field population across form sections
- [x] Add progress bar showing completion percentage
- [x] Add sidebar navigation with step indicators
- [x] Add top pill navigation for quick step access
- [x] Implement form validation for mandatory fields
- [x] Add form submission to database with timestamp

### Digital Signature
- [x] Implement canvas-based signature pad
- [x] Add clear and save signature functionality
- [x] Store signature as base64 in database

### HR Admin Dashboard
- [x] Create HR dashboard layout with sidebar
- [x] Implement submissions list view with pagination
- [x] Add search functionality for employee names and emails
- [x] Add filter by submission date
- [x] Add download individual joining kit as PDF
- [x] Add bulk download functionality (CSV export implemented)
- [x] Display submission status and timestamps
- [x] Add view/edit submission details

### Notifications
- [x] Trigger owner notification on form submission
- [x] Include employee details in notification
- [x] Add notification history/log (with dedicated notifications_log table and UI)

### UI/UX Improvements
- [x] Design professional color scheme and typography
- [x] Implement responsive design for mobile and desktop
- [x] Add loading states and spinners
- [x] Add success/error toast notifications
- [x] Add empty states for dashboard
- [x] Implement smooth transitions between steps

### Testing & Quality
- [x] Write vitest tests for backend procedures (4 tests passing)
- [x] Test form submission flow with validation
- [x] Test HR dashboard functionality
- [x] Test auto-fill logic for permanent address
- [x] Test signature capture and storage
- [x] All vitest tests passing (4/4)

## Bugs Fixed
- [x] Fixed alignment issues in form layout with proper Tailwind grids
- [x] Ensured all form fields are properly aligned in 2-column grid layout
- [x] Implemented responsive layout for mobile and desktop devices
- [x] Added animated loading spinners in HR dashboard
- [x] Added smooth fade-in transitions between form steps

## Enhancements Made
- [x] Enhanced search to support email and employee ID
- [x] Added date range filtering for submissions
- [x] Improved Family & PF step with additional fields
- [x] Added animated loading states
- [x] Implemented smooth step transitions

## Completed Items
- [x] Project initialization with web-db-user scaffold
- [x] Created todo.md tracking file
- [x] Database schema design and migration
- [x] Multi-step joining kit form with all 6 steps
- [x] Digital signature pad implementation
- [x] HR admin dashboard with submissions management
- [x] Backend notification system
- [x] Form submission and retrieval procedures
- [x] Search and filtering functionality
- [x] Responsive design for all devices
- [x] Loading states and animations

## PDF Generation Feature (New)
- [ ] Create PDF generation service to populate official joining kit template
- [ ] Map form fields to PDF template fields
- [ ] Add PDF download button in Review & Generate step
- [ ] Add PDF download in HR dashboard submissions
- [ ] Test PDF generation with sample data
- [ ] Ensure all fields are properly populated in PDF
- [ ] Add signature image to PDF
