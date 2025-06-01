# 📚 Book Review API – Node.js Project

Welcome! This is a simple backend application that lets users **sign up**, **log in**, **add books**, and **write reviews** for them. The system also supports **searching books**, **ratings**, and **review updates**. It’s built using **Node.js**, **Express.js**, and **MongoDB**.

---

## ✅ Features

- 👤 User registration and login (secure with tokens)
- 📘 Add and view books
- ✍️ Write one review per book
- 🗑️ Update or delete your review
- 🔍 Search books by title or author
- ⭐ Get average ratings for each book
- 📄 Paginated review listing

---

## 🛠️ Project Setup Instructions

### 1. Prerequisites

You should have the following installed:

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas/database))

### 2. Clone this repository

```bash
git clone https://github.com/your-username/book-review-api.git
cd book-review-api
```

## 3. Install dependencies

```bash
npm install
```

## 4. Create .env file

Create a .env file in the root folder and add:
```bash
PORT=5000 
MONGO_URI=mongodb://127.0.0.1:27017/book-review
JWT_SECRET=your_jwt_secret_key
```
## 5. Start the server

```bash
npm run dev
```

If everything works, you'll see:

```bash
MongoDB Connected
Server running on port 5000
```

## 📬 API Testing (Using Postman or curl)
Base URL: http://localhost:5000/api

### 👤 User APIs
#### 🔹Sign Up

```bash
POST /api/signup
```
Request Body:
```bash
{
"username": "nitik",
"email": "nitik@example.com",
"password": "123456"
}
```

#### 🔹Login

```bash
POST /api/login
```
Request Body:
```bash
{
"email": "nitik@example.com",
"password": "123456"
}
```
Returns a __JWT token__ to use in Authorization headers.

### 📘 Book APIs
#### 🔹Add Book (requires token)

```bash
POST /api/books
```
Headers:
```bash
Authorization: Bearer <your_token>
```
Request Body:
```bash
{
"title": "The Alchemist",
"author": "Paulo Coelho",
"genre": "Fiction"
}
```
#### 🔹Get All Books

```bash
GET /api/books?page=1&limit=5&author=Paulo
```
**Optional Query Parameters:**

- `author`
- `genre`
- `page`
- `limit`

#### 🔹Get Single Book by ID (with reviews)

```bash
GET /api/books/<book_id>?page=1&limit=3
```
Includes paginated reviews and average rating.

### ✍️ Review APIs
#### 🔹Add a Review

```bash
POST /api/books/<book_id>/reviews
```
Headers:
```bash
Authorization: Bearer <your_token>
```
Request Body:
```bash
{
"rating": 5,
"comment": "Amazing book!"
}
```
#### 🔹Update a Review

```bash
PUT /api/reviews/<review_id>
```
Headers:
```bash
Authorization: Bearer <your_token>
```
Request Body:
```bash
{
"rating": 4,
"comment": "Changed my mind, it's good but not the best."
}
```
#### 🔹Delete a Review

```bash
DELETE /api/reviews/<review_id>
```
Headers:
```bash
Authorization: Bearer <your_token>
```
### 🔍 Search Books
```bash
GET /api/search?q=alchemist
```
Searches by title or author (case-insensitive).

## ⚙️ Design Decisions & Assumptions
One user can submit only one review per book.

Authentication is done using JWT tokens for security.

Reviews are paginated to improve performance for books with many reviews.

Ratings are averaged to show a score per book.

We chose MongoDB for flexibility in managing data like reviews and users.


## 📊 Database Schema Overview
### 1. User
```bash
{
  _id: ObjectId,
  username: String,
  email: String,
  password: String, // Hashed
  createdAt: Date,
  updatedAt: Date
}
```
### 2. Book
``` bash
{
  _id: ObjectId,
  title: String,
  author: String,
  genre: String,
  createdAt: Date,
  updatedAt: Date
}
```
### 3. Review
``` bash
{
  _id: ObjectId,
  user: ObjectId (ref to User),
  book: ObjectId (ref to Book),
  rating: Number (1–5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```
## 🔗 Relationships
A User can write many Reviews

A Book can have many Reviews

A Review belongs to one User and one Book

A User can post only one review per Book

## ER Diagram

## 📦 Tech Stack
Node.js

Express.js

MongoDB

Mongoose

JSON Web Tokens (JWT)

dotenv

Postman (for API testing)
