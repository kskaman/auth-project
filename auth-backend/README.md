# auth-backend

## Structure

auth-backend/
├── src/
| ├── config/
│ ├── controllers/
| ├── middlewares/
│ ├── models/
│ ├── routes/
| ├── services/
│ └── utils/
├── .env.example
├── .gitignore
├── package-lock.json
├── package.json
├── README.md
└── server.js

- **config/** $\leftarrow$ database connection, environment setup, constants
- **models/** $\leftarrow$ MongoDB data shapes (User, Token, Notification…)
- **services/** $\leftarrow$ the “business logic” layer (register/login rules live here)
- **controllers/** $\leftarrow$ handles HTTP request/response (thin layer)
- **routes/** $\leftarrow$ maps URLs to controllers
- **middlewares/** $\leftarrow$ JWT checks, role guards, validation, error handling
- **utils/** $\leftarrow$ helper functions (token signing, hashing helpers, email helpers)

- **.env** $\leftarrow$ environment variables (DB connection string, JWT secret, etc.)
