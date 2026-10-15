# IBM Instant Consultation integration

Adapted from IBM Skills Network, Front-End Development Capstone, **Integrate Existing Functionality**, `InstantConsultationBooking.zip`:

https://cf-courses-data.s3.us.cloud-object-storage.appdomain.cloud/IBMSkillsNetwork-CD0322EN-Coursera/labs/m3/l4/InstantConsultationBooking.zip

The supplied `InstantConsultation`, `FindDoctorSearchIC`, `DoctorCardIC`, and `AppointmentFormIC` structures are incorporated as React JSX components. The doctor card retains `reactjs-popup`, UUID booking identifiers, controlled form state, booking and cancellation handlers. The search retains specialty suggestions shown on focus and hidden when focus leaves the search area.

Changes for this project: shared fictional local catalogue instead of an external endpoint; React Router search parameters without page reloads; remove unused hooks/state; accessible labels and `className`; require authenticated `user.id`; reset doctor booking state between users; clearly identify academic simulation. Queue bookings are page-local demonstration state and do not create backend appointments.

Original course attribution: © IBM Corporation. All rights reserved.
