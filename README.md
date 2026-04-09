# Course Selling App API

A REST API for a course selling platform with dual JWT authentication — separate tokens for users and admins, role-based access control, course management, and purchase tracking. Built with Node.js, Express, and MongoDB.

## Tech Stack

- **Runtime** — Node.js
- **Framework** — Express.js v5
- **Database** — MongoDB with Mongoose
- **Auth** — JWT (separate secrets for user and admin) + bcrypt
- **Environment** — dotenv

## Project Structure

```
├── src/
│   ├── controllers/
│   │   ├── user.controllers.js    # register, login, purchases
│   │   ├── admin.controllers.js   # register, login, course CRUD
│   │   └── course.controllers.js  # preview, purchase
│   ├── database/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── user.middleware.js     # JWT verification for users
│   │   └── admin.middleware.js    # JWT verification for admins
│   ├── models/
│   │   ├── user.models.js         # User schema with bcrypt + JWT
│   │   ├── admin.models.js        # Admin schema with bcrypt + JWT
│   │   ├── course.models.js       # Course schema
│   │   └── purchase.models.js     # Purchase schema
│   ├── routes/
│   │   ├── user.routes.js         # user routes
│   │   ├── admin.routes.js        # admin routes
│   │   └── course.routes.js       # course routes
│   └── utils/
│       ├── api-errors.js          # custom ApiError class
│       ├── api-response.js        # consistent ApiResponse class
│       └── async-handler.js       # async error wrapper
├── app.js                          # Express app + error middleware
├── index.js                        # server entry point
└── .env                            # environment variables (not committed)
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### Installation

```bash
# Clone the repo
git clone https://github.com/rudrapratapsingh26/course-selling-app.git
cd course-selling-app

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/course-selling-app
PORT=8000
JWT_USER_SECRET=your_user_secret_here
JWT_ADMIN_SECRET=your_admin_secret_here
JWT_USER_EXPIRY=7d
JWT_ADMIN_EXPIRY=7d
```

### Run the Server

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:8000`

---

## How It Works

Two completely separate auth systems — users and admins have different JWT secrets, different middleware, and different routes. An admin token cannot access user routes and vice versa.

---

## API Reference

### User endpoints

#### Register

```http
POST /api/v1/user/signup
```

**Request body:**
```json
{
  "firstName": "Rudra",
  "email": "rudra@example.com",
  "password": "secret123"
}
```

**Response `201`:**
```json
{
  "statusCode": 201,
  "data": { "id": "64f1a2b3...", "email": "rudra@example.com" },
  "message": "User registered successfully",
  "success": true
}
```

---

#### Login

```http
POST /api/v1/user/signin
```

**Request body:**
```json
{
  "email": "rudra@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "statusCode": 200,
  "data": { "token": "eyJhbGc..." },
  "message": "Login successful",
  "success": true
}
```

---

#### Get purchased courses

```http
GET /api/v1/user/purchases
```

**Headers:**
```
Authorization: Bearer <userToken>
```

**Response `200`:** returns list of purchased courses with full course details.

---

### Admin endpoints

#### Register

```http
POST /api/v1/admin/signup
```

**Request body:**
```json
{
  "firstName": "Admin",
  "email": "admin@example.com",
  "password": "secret123"
}
```

---

#### Login

```http
POST /api/v1/admin/signin
```

Same as user login — returns an `adminToken` signed with a different secret.

---

#### Create a course

```http
POST /api/v1/admin/course
```

**Headers:**
```
Authorization: Bearer <adminToken>
```

**Request body:**
```json
{
  "title": "Node.js Backend Masterclass",
  "description": "Learn Node.js from scratch to production",
  "price": 999,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response `201`:** returns the created course object. `creatorId` is automatically set to the logged-in admin's ID.

---

#### Update a course

```http
PUT /api/v1/admin/course/:id
```

Only the admin who created the course can update it. Send any fields to update.

---

#### Delete a course

```http
DELETE /api/v1/admin/course/:id
```

Only the admin who created the course can delete it.

---

#### Get all admin's courses

```http
GET /api/v1/admin/course
```

Returns only courses created by the logged-in admin.

---

### Course endpoints

#### Preview all courses

```http
GET /api/v1/course/preview
```

No auth required. Returns all available courses.

---

#### Purchase a course

```http
POST /api/v1/course/purchase
```

**Headers:**
```
Authorization: Bearer <userToken>
```

**Request body:**
```json
{
  "courseId": "64f1a2b3..."
}
```

Validates the course exists. Prevents duplicate purchases. Creates a purchase record linking `userId` and `courseId`.

**Response `201`:**
```json
{
  "statusCode": 201,
  "data": { "userId": "...", "courseId": "..." },
  "message": "Course purchased successfully",
  "success": true
}
```

---

## Error Responses

```json
{
  "statusCode": 401,
  "data": null,
  "message": "Unauthorized — invalid or expired token",
  "success": false
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request — missing required fields |
| `401` | Unauthorized — missing or invalid token |
| `404` | Course not found |
| `409` | Email already registered / Course already purchased |
| `500` | Internal server error |

---

## Data Models

### User / Admin

```js
{
  firstName: String,     // required
  email: String,         // unique, required
  password: String,      // bcrypt hashed
  createdAt: Date,
  updatedAt: Date
}
```

### Course

```js
{
  title: String,         // required
  description: String,   // required
  price: Number,         // required, min 0
  imageUrl: String,
  creatorId: ObjectId,   // ref to Admin
  createdAt: Date
}
```

### Purchase

```js
{
  userId: ObjectId,      // ref to User
  courseId: ObjectId,    // ref to Course
  createdAt: Date
}
```

---

## Security

- Passwords hashed with bcrypt (10 salt rounds)
- Separate JWT secrets for users and admins — cross-role token use is impossible
- Course mutations (update/delete) filter by both `_id` AND `creatorId` — admins can't modify each other's courses
- Duplicate purchase prevention via `findOne` check before creating purchase record

---

## What I Learned Building This

- Dual JWT auth with separate secrets for different user roles
- Role-based middleware — `req.user` vs `req.admin`
- MongoDB `$in` operator — fetch multiple documents by array of IDs in one query
- Preventing duplicate purchases with existence check before create
- Data isolation — admins only see and modify their own courses
- Route-level middleware vs router-level middleware

---

## Upcoming (Project 4)

- [ ] React frontend — course listing, purchase flow
- [ ] Deploy backend to Railway
- [ ] Deploy frontend to Vercel

---

## Author

**Rudra Pratap Singh** — 1st year BTech student learning full-stack development.

- GitHub: [@rudrapratapsingh26](https://github.com/rudrapratapsingh26)
- Twitter: [@Rudrapratap2610](https://twitter.com/Rudrapratap2610)
