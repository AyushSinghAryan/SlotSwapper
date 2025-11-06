
````markdown
# 🕒 SlotSwapper 

A **peer-to-peer time-slot scheduling application** built for the ServiceHive technical challenge.  
Users can mark their calendar slots as **SWAPPABLE**, browse others’ swappable slots, and request swaps.

---

## ✨ Features

- 🔐 **User Authentication** — Secure registration and login using JWT  
- 🗓️ **Event Management** — Full CRUD for calendar events  
- 🔄 **Event Status Toggle** — Switch between `BUSY` and `SWAPPABLE`  
- 🏪 **Marketplace View** — Browse all swappable slots from other users  
- ⚙️ **Atomic Swap Logic** — Safe multi-document transactions  
- 🔔 **Request Management** — Handle incoming and outgoing swap requests  

---

## 🛠️ Tech Stack & Design Choices

### Backend (Node.js / Express.js)
- **Framework:** Express.js (REST API)
- **Database:** MongoDB with Mongoose
- **Auth:** JWT + bcryptjs
- **Validation:** express-validator
- **Atomicity:** Mongoose Transactions for `/api/swap-request` and `/api/swap-response`

### Frontend (React)
- **Framework:** React (Vite)
- **Styling:** Tailwind CSS (utility-first)
- **State Management:** React Context API (`useAuth`)
- **UX:** Single-Page App with dynamic updates (no reloads)

---

## 🚀 Getting Started (Local Setup)

Follow these steps to run both backend and frontend locally.

### 🧩 Prerequisites
- Node.js (v18+)
- Git
- MongoDB Atlas account (or local MongoDB)
- Postman (optional, for API testing)

---

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/AyushSinghAryan/SlotSwapper.git
cd SlotSwapper
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/slot-swapper?retryWrites=true&w=majority
JWT_SECRET=mysecretjwtkey12345
PORT=5000
```

Run the backend server:

```bash
npm run dev
# or
npm start
```

Server should now be running at:
➡️ **[http://localhost:5000](http://localhost:5000)**

---

### 3️⃣ Frontend Setup

Open a new terminal window:

```bash
cd SlotSwapper
npm install
```

Update API URL inside `src/App.jsx`:

```js
const BASE_URL = 'http://localhost:5000/api';
```

Run the frontend:

```bash
npm run dev
```

App available at:
➡️ **[http://localhost:5173](http://localhost:5173)**

---

## 📚 API Endpoints

All protected routes require a **Bearer Token** in the `Authorization` header.

---

### 🔐 Authentication

| Method | Endpoint             | Description                      | Protected | Request Body                      |
| :----- | :------------------- | :------------------------------- | :-------: | :-------------------------------- |
| POST   | `/api/auth/register` | Registers a new user             |     ❌     | `{ "name", "email", "password" }` |
| POST   | `/api/auth/login`    | Logs in a user and returns a JWT |     ❌     | `{ "email", "password" }`         |

---

### 🗓️ Events

| Method | Endpoint          | Description                            | Protected | Request Body                                      |
| :----- | :---------------- | :------------------------------------- | :-------: | :------------------------------------------------ |
| GET    | `/api/events/`    | Gets all events for the logged-in user |     ✅     | (none)                                            |
| POST   | `/api/events/`    | Creates a new event                    |     ✅     | `{ "title", "startTime", "endTime" }`             |
| PUT    | `/api/events/:id` | Updates an event (e.g., status)        |     ✅     | `{ "title"?, "status"? ("BUSY" or "SWAPPABLE") }` |

---

### 🔄 Swap Logic

| Method | Endpoint                        | Description                               | Protected | Request Body                                          |
| :----- | :------------------------------ | :---------------------------------------- | :-------: | :---------------------------------------------------- |
| GET    | `/api/swappable-slots`          | Get all swappable slots from other users  |     ✅     | (none)                                                |
| POST   | `/api/swap-request`             | Submit a request to swap two slots        |     ✅     | `{ "mySlotId", "theirSlotId" }`                       |
| POST   | `/api/swap-response/:requestId` | Accept or reject an incoming swap request |     ✅     | `{ "acceptance": true }` or `{ "acceptance": false }` |
| GET    | `/api/swap-requests/incoming`   | Get all incoming requests                 |     ✅     | (none)                                                |
| GET    | `/api/swap-requests/outgoing`   | Get all outgoing requests                 |     ✅     | (none)                                                |

---

## 🤔 Assumptions & Challenges

### 🧠 Assumptions

* Time stored in **UTC**, client converts to local.
* Overlapping swaps are not prevented automatically.
* No DELETE endpoints (not required in challenge).

### ⚔️ Challenges

* Implementing **atomic transactions** with Mongoose.
* Managing two separate servers (frontend + backend) in monorepo.

---

## 🧪 Example API Requests

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","password":"password123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'
```

### Fetch Swappable Slots

```bash
curl -H "Authorization: Bearer <JWT_TOKEN>" \
  http://localhost:5000/api/swappable-slots
```

### Submit Swap Request

```bash
curl -X POST http://localhost:5000/api/swap-request \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"mySlotId":"<mySlotId>", "theirSlotId":"<theirSlotId>"}'
```

---

## 💡 GitHub Markdown Tips

If tables don’t render:

* Add a **blank line before** the table
* Ensure header separator row: `|:---|---|`
* Avoid extra indentation

---

## 🧩 Recommended Improvements

* Add timezone conversion on client
* Prevent overlapping swaps
* Add comprehensive test coverage
* Improve marketplace filtering (by time/date/user)

---

## 👨‍💻 Author

**Ayush Singh Aryan**
🔗 [GitHub Profile](https://github.com/AyushSinghAryan)

---


