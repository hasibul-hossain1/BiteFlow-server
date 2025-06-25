# 🍽️ Flowbite - Restaurant Food Item Management API (Backend)

This is the **server-side API** for the **Flowbite** restaurant food item management web application. It handles authentication, CRUD operations for food items, and order management. Built using **Express**, **MongoDB**, and **Firebase Admin SDK**.

---

## 🌐 Base URL

http://localhost:3030


Or use your deployed server URL.

---

## ⚙️ Environment Variables

Create a `.env` file in the root of your project with the following keys:

```env
PORT=3030
USER_NAME=your_mongodb_username
PASS=your_mongodb_password
SERVICE_ACCOUNT_KEY=base64_encoded_firebase_admin_sdk_json
```

🔐 You must base64 encode your Firebase service account JSON file and assign it to SERVICE_ACCOUNT_KEY.

Example:
```
base64 serviceAccountKey.json

```

🔐 Authentication
This server uses Firebase Authentication via ID tokens. After login:

It stores a secure session cookie (httpOnly, secure, SameSite=None)

All protected routes require a valid session cookie

🧪 API Endpoints
🔓 Public Routes
Method	Endpoint	Description
GET	/	Root route, returns "Hello World"
GET	/searchFoods	Search food items by name (?search=...)
GET	/foods	Get count of all foods

🔐 Authenticated Routes (require valid session)
Method	Endpoint	Description
POST	/login	Verify Firebase ID token and set session cookie
POST	/logout	Clear the session cookie
GET	/myfoods?email=	Get foods added by the logged-in user
GET	/myorders?email=	Get orders placed by the user
POST	/purchase	Purchase a food item (updates stock)
POST	/newfood	Add a new food item
DELETE	/myfoods/:id	Delete a food added by the user
DELETE	/myorders/:id	Cancel an order and update stock
PUT	/updatefood/:id	Update an existing food item

📦 Project Dependencies
Package	Version	Purpose
express	^5.1.0	Backend framework
mongodb	^6.17.0	MongoDB native driver
firebase-admin	^13.4.0	Firebase Admin SDK for auth
cookie-parser	^1.4.7	Cookie parsing middleware
cors	^2.8.5	Cross-Origin Resource Sharing
dotenv	^16.5.0	Environment variable loader

	^16.5.0	Environment variable loader

Install dependencies with:
```
pnpm install

```

🛠 Setup & Run
1️⃣ Clone the repository
```
git clone https://github.com/yourusername/flowbite-backend.git
cd flowbite-backend

```
2️⃣ Install dependencies
```
pnpm install

```
3️⃣ Setup .env file
```
PORT=3030
USER_NAME=your_db_user
PASS=your_db_pass
SERVICE_ACCOUNT_KEY=your_base64_firebase_admin_json

```
4️⃣ Run the server
```
node index.js
```
🔐 Firebase Setup
To generate a Firebase Admin SDK key:

Go to Firebase Console

Select your project → Project settings → Service accounts

Generate new private key (download the .json)

Encode the file using:
```
base64 serviceAccountKey.json

```
Copy and paste the result into .env under SERVICE_ACCOUNT_KEY


📁 MongoDB Collections
foods: All food items

purchase: Orders placed by users

👨‍💻 Author
Hasibul Hossain Shanto
📧 hasibul.hossain.dev@gmail.com
🌐 GitHub - hasibul-hossain1

⭐️ Show Your Support
If you found this project helpful, consider giving it a ⭐️ on GitHub!

---

You can add this directly as your `README.md`.  
If you want me to help with any additional formatting or badges, just ask!









