Digital Payment Wallet (Paytm Clone)

This is a digital payment wallet application built with the MERN stack (MongoDB, Express, React, Node.js). It is designed to simulate a Paytm-like wallet system where users can register, log in, view their wallet balance, and perform transactions (credit/debit).

Features
User Authentication: Secure registration and login using JWT-based authentication.
Wallet Balance: Users can view their current wallet balance.
Transaction Management: Users can perform credit and debit transactions with real-time updates to their wallet balance.
Secure API: All sensitive routes (transactions, balance view) are protected with JWT authentication.


Technologies Used
Frontend: React.js, HTML, CSS, JavaScript
Backend: Node.js, Express.js, MongoDB, JWT for user authentication
Database: MongoDB (using MongoDB Atlas for cloud storage)
Environment Variables: Sensitive information such as MongoDB URI and JWT Secret Key are stored securely in a .env file.


Setup Instructions
1. Clone the Repository
Clone the project repository to your local machine using the following command:
git clone https://github.com/ArthSawatkar/mern-wallet.git

3. Install Dependencies
Backend
Navigate to the server directory and install the required dependencies:

cd server
npm install

Frontend (Optional, if applicable)
If you're working with the frontend, navigate to the client directory and install the dependencies there as well:

cd client
npm install

3. Configure Environment Variables
Create a .env file in the server directory and add the following configurations:

MONGO_URI=
JWT_SECRET=
PORT=5000

Replace your_mongo_db_connection_string with your MongoDB Atlas connection URI and your_jwt_secret_key with a secret key used to sign JWT tokens.

4. Run the Application
Backend
Start the backend server:

cd server
npm start

The backend will run at http://localhost:5000.

Frontend (If applicable)
To start the frontend, run:

cd client
npm start

The frontend React app will run at http://localhost:3000.


API Endpoints

POST /register: Register a new user with the following body parameters:
name: User's full name
email: User's email address
password: User's password

POST /login: Login a user by sending the email and password to receive a JWT token.

GET /balance: Fetch the user's current wallet balance (Protected route, requires JWT token).

POST /transactions: Perform a credit/debit transaction with the following body parameters:

amount: The amount to credit/debit
type: credit or debit (Protected route, requires JWT token).


Contributing
Fork the repository.
Create a new branch (git checkout -b feature-branch).
Commit your changes (git commit -am 'Add feature').
Push to the branch (git push origin feature-branch).
Create a Pull Request with a description of the changes.

---

Contact
For any queries or suggestions, feel free to reach out:
https://in.linkedin.com/in/arthsawatkar
