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

- **config/** $\rightarrow$ database connection, environment setup, constants
- **models/** $\rightarrow$ MongoDB data shapes (User, Token, Notification…)
- **services/** $\rightarrow$ the “business logic” layer (register/login rules live here)
- **controllers/** $\rightarrow$ handles HTTP request/response (thin layer)
- **routes/** $\rightarrow$ maps URLs to controllers
- **middlewares/** $\rightarrow$ JWT checks, role guards, validation, error handling
- **utils/** $\rightarrow$ helper functions (token signing, hashing helpers, email helpers)

- **.env** $\rightarrow$ environment variables (DB connection string, JWT secret, etc.)
