Here’s a **professional `README.md`** for your Parcel Management System (PackNGo) that matches industry standards, clearly explains setup, features, and API usage.

---

```markdown
# 📦 PackNGo - Parcel Management System

PackNGo is a RESTful API built with **Node.js**, **Express**, and **TypeScript** for managing parcel deliveries.  
It supports **tracking IDs**, **status logs**, and **role-based operations** for senders, delivery personnel, and admins.

---

## 🚀 Features

- **Authentication & Authorization** using JWT
- **Create & Manage Parcels** (Senders)
- **Track Parcel Status** with complete status history
- **Cancel Parcels** before delivery
- **Assign Parcels to Delivery Personnel** (Admin)
- **Update Parcel Status** (Delivery Personnel)
- **View Parcel Details with Status Log**
- **Error Handling** with meaningful HTTP status codes

---

## 📂 Project Structure

```

src/
│── app/
│   ├── modules/
│   │   ├── parcel/
│   │   │   ├── parcel.controller.ts
│   │   │   ├── parcel.routes.ts
│   │   │   ├── parcel.model.ts
│   │   │   ├── parcel.interface.ts
│   │   │   └── parcel.service.ts
│   ├── middlewares/
│   ├── utils/
│── server.ts
│── app.ts

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/packngo.git
cd packngo
````

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/packngo
NODE_ENV=development

JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES=7d
BCRYPT_SALT_ROUND=10
```

### 4️⃣ Start the Development Server

```bash
npm run dev
```

---

## 📌 API Endpoints

### 📮 Parcel Routes

| Method    | Endpoint                  | Description                         | Auth Required        |
| --------- | ------------------------- | ----------------------------------- | -------------------- |
| **POST**  | `/parcels`                | Create a new parcel                 | ✅ Sender             |
| **GET**   | `/parcels/me`             | Get parcels of logged-in sender     | ✅ Sender             |
| **PATCH** | `/parcels/cancel/:id`     | Cancel a parcel                     | ✅ Sender             |
| **GET**   | `/parcels/:id/status-log` | Get status log of a parcel          | ✅ Sender/Admin       |
| **PATCH** | `/parcels/:id/assign`     | Assign parcel to delivery personnel | ✅ Admin              |
| **PATCH** | `/parcels/:id/status`     | Update parcel status                | ✅ Delivery Personnel |

---

## 📦 Parcel Status Flow

```
REQUESTED → ACCEPTED → PICKED → IN_TRANSIT → DELIVERED
```

* **REQUESTED**: Initial status when a parcel is created
* **ACCEPTED**: Delivery personnel accepts the task
* **PICKED**: Parcel picked from sender
* **IN\_TRANSIT**: Parcel is on the way
* **DELIVERED**: Parcel successfully delivered
* **CANCELLED**: Parcel cancelled before delivery

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express.js
* **Language**: TypeScript
* **Database**: MongoDB + Mongoose
* **Auth**: JWT (Access & Refresh Tokens)
* **Validation**: Zod / Joi
* **Password Hashing**: bcrypt.js

---

## 📜 Error Handling

* All errors return a JSON response with:

```json
{
  "success": false,
  "message": "Error message here",
  "statusCode": 400
}
```

---

## 👨‍💻 Author

**kyoChiwow**
📧 Email: [shafiqulislamweb101@gmail.com](mailto:shafiqulislamweb101@gmail.com)
🔗 GitHub: [kyoChiwow](https://github.com/kyoChiwow)

---

```
