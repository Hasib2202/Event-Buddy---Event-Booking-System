---

# 🎉 Event Booking System

A **Full Stack Event Booking System** where users can browse and book seats for events and admins can manage events with full CRUD operations. The application is built with **Next.js**, **Tailwind CSS**, **NestJS**, **PostgreSQL**, and **TypeORM**, supporting full **authentication**, **authorization**, and **seat booking logic**.

---

## 🚀 Features

### 👤 User Features

* Browse upcoming and past events
* View full event details
* Book 1–4 seats per event
* View booking history in the dashboard
* Secure JWT-based login and registration

### 🛠️ Admin Features

* Full CRUD for events (create, update, delete)
* Manage total and available seats
* Dashboard to manage all events

### 🔐 Authentication & Authorization

* JWT-based login system
* Role-based guards (`admin` and `user`)
* Bcrypt password hashing
* Protected routes for admin and user

### ✅ Booking Logic

* Bookings restricted to upcoming events only
* Cannot exceed available seats
* Real-time seat availability updates

### 💻 Tech Stack

| Frontend              | Backend             | Database           |
| --------------------- | ------------------- | ------------------ |
| Next.js (TypeScript)  | NestJS (TypeScript) | PostgreSQL         |
| Tailwind CSS          | TypeORM             | pgAdmin (optional) |
| React Hook Form + Zod | JWT + Bcrypt        |                    |

---

## 🗂️ Folder Structure

```
event-booking-system/
├── backend/         # NestJS Backend API
│   ├── src/
│   │   ├── auth/
│   │   ├── user/
│   │   ├── event/
│   │   └── booking/
│   └── .env
├── frontend/        # Next.js Frontend
│   ├── pages/
│   ├── components/
```
---

## 🛠️ Getting Started

### ✅ Prerequisites

* Node.js ≥ 18.x
* PostgreSQL ≥ 13.x
* npm or yarn

---

## ⚙️ Backend Setup (NestJS)

### 1️⃣ Clone & Navigate

```bash
git clone https://github.com/your-username/event-booking-system.git
cd event-booking-system/backend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment

Create `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/event_db
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Run Migrations & Start Server

```bash
npm run start:dev
```

---

## 💻 Frontend Setup (Next.js)

### 1️⃣ Navigate to Frontend

```bash
cd ../frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 4️⃣ Start Development Server

```bash
npm run dev
```

---

## ✅ API Endpoints

### 🔐 Auth

* `POST /auth/register` – Register as user or admin
* `POST /auth/login` – Login and get JWT

### 👤 User

* `GET /user/bookings` – Get all bookings for current user

### 🎫 Events

* `GET /events` – Get all events (upcoming & past)
* `GET /events/:id` – Get single event details
* `POST /events` – (Admin only) Create event
* `PATCH /events/:id` – (Admin only) Update event
* `DELETE /events/:id` – (Admin only) Delete event

### 📅 Bookings

* `POST /bookings` – Create new booking
* `GET /bookings/me` – Get current user's bookings
* `DELETE /bookings/me/:id` – (User only) Cancel event Booking

---

## 🎨 UI Screens

### Public Pages

* Homepage with upcoming/past events
* Event details page
* Redirects to login when booking without auth

### Auth Pages

* Login
* Register

### User Dashboard

* View bookings
* Book event seats

### Admin Dashboard

* List, create, update, delete events

---

## ✅ Validation

* 🔐 Backend validation using `class-validator` and DTOs
* 💡 Frontend form validation using **React Hook Form** + **Zod**
* 🍳 Toaster used to show all messages

---

## 📱 Responsive Design

* Fully responsive for **mobile**, **tablet**, and **desktop**
* Styled with **Tailwind CSS**

---


## 🖼️ Project Screenshot

Here’s a preview of the **Event Booking System**:

### 🚀 Landing Page (Homepage)
![Image](https://github.com/user-attachments/assets/f8e548b3-39f8-4de2-bc40-0e2a8fad3529)

### 🔒 Login Page
![Image](https://github.com/user-attachments/assets/6d89a980-7aaa-4b02-bacb-63eb8878b2c6)

### 🔒 Register Page
![Image](https://github.com/user-attachments/assets/1a4e590f-7da2-4ba7-8a80-38b893c7bfe2)


### 📅 Event Details Page
![Image](https://github.com/user-attachments/assets/6f2be336-217f-49b8-a42b-d8b017376eda)

### 🧑‍💼 Admin Dashboard (Event Management)
![Image](https://github.com/user-attachments/assets/b0d8042a-efe0-49f8-b874-62088aae81f3)

![Image](https://github.com/user-attachments/assets/f37be5ff-2374-4211-a23c-7895835ae385)

![Image](https://github.com/user-attachments/assets/b931075b-875e-4ec0-a2be-482c136425a3)

![Image](https://github.com/user-attachments/assets/2403f1cf-3d7f-4b42-9903-387ca9472e55)

![Image](https://github.com/user-attachments/assets/604c3280-d6c9-49f4-b023-3dce8aadfa23)

### 👤 User Dashboard (My Bookings)
![Image](https://github.com/user-attachments/assets/82a8fb20-9beb-452a-bff8-b6451a679e0f)
Cancel Event Booking
![Image](https://github.com/user-attachments/assets/72ce702f-507e-4f47-af6e-d27ad02ccd05)



## 📃 License



---

## 🙌 Acknowledgments

Thanks to the contributors, open-source packages, and frameworks that made this project possible.

---

## 📞 Contact

For any questions or suggestions, feel free to reach out:

* 💼 LinkedIn: [Md. Mostofa Hasib] ((https://www.linkedin.com/in/md-mostofa-hasib-5b4027184/))
* 📧 Email: (hasibammostofahasib@gmail.com)

---

