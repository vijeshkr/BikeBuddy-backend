# BIKEBUDDY - Two-Wheeler Garage Management System

## Table of Contents
- [Introduction](#introduction)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

**BIKEBUDDY** is a comprehensive garage management system designed for two-wheelers, aimed at streamlining service bookings, vehicle management, and operational efficiency. The platform supports three user roles—customers, mechanics, and admins—each equipped with dedicated features to simplify processes and enhance user experience.

## Features

### Customer Section
- **Service Booking:** Book services and request breakdown assistance through an intuitive interface.
- **Service Offers:** Display current service packages and charges to keep customers informed.
- **Current Booking Status:** Track booking statuses in real-time, enhancing transparency.
- **Service History:** Access detailed records of previous services performed on their vehicles.
- **Vehicle Management:** Manage details for multiple vehicles, including free service eligibility checks.

### Admin Section
- **Booking Management:** View and filter all new bookings.
- **Job Allocation:** Allocate jobs to mechanics based on job descriptions.
- **Direct Booking:** Book services directly on behalf of customers.
- **Customer Management:** Comprehensive access to customer details and account creation.
- **Mechanic Management:** Maintain a database of mechanics with contact details and leave management.
- **Salary and Targets Management:** Track monthly labor and spare targets for mechanics.
- **Spare Parts Management:** Manage spare parts inventory.
- **Data Visualization:** Visualize key metrics using Recharts.

### Mechanic Section
- **Job Dashboard:** View allocated jobs and update job statuses.
- **Additional Work Requests:** Request customer approval for extra work.
- **Spare Parts Inventory:** Check availability for needed spare parts.
- **Service History Access:** View previous service histories for informed recommendations.

### Additional Features
- **Secure Authentication:** Implemented secure user authentication using JWT.
- **Profile Management:** Users can manage personal information securely.
- **Payment Integration:** Integrated Stripe for secure online payment processing.
- **Real-Time Updates:** Provides real-time notifications based on user actions.

## Technologies Used
- **Frontend:** React.js, Redux Toolkit, Tailwind CSS, Bootstrap
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Real-time Communication:** Socket.IO
- **Authentication:** JWT (JSON Web Token)
- **Payment Processing:** Stripe
- **Email Service:** Nodemailer
- **Data Visualization:** Recharts
