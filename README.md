# NovaCrust Wallet Service

A simple NestJS wallet service supporting:
- User creation (User + Wallet).
- Funding wallets.
- Transferring funds between wallets (Atomic/Transactional).
- Viewing wallet balance and transaction history.

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run start:dev
    ```
    The server runs on `http://localhost:3000`. Database (SQLite) will be created automatically (`db.sqlite`).

3.  **Run Tests**
    ```bash
    npm run test
    ```

## API Endpoints

### User
*   `POST /user`
    *   **Body**: `{ "email": "test@test.com", "name": "Test User", "password": "password" }`
    *   **Response**: Creates User and associated Wallet.

### Wallet
*   `GET /wallet/:id`
    *   **Response**: Wallet details + Transaction History.

*   `POST /wallet/:id/fund`
    *   **Body**: `{ "amount": 100 }`
    *   **Response**: Updated Wallet + Transaction record.

*   `POST /wallet/:id/transfer`
    *   **Body**: `{ "receiverWalletId": "2", "amount": 50, "description": "Gift" }`
    *   **Response**: Transaction record.

## Assumptions
*   **Authentication**: Omitted for simplicity (Endpoints work with IDs directly).
*   **Currency**: Fixed to 'USD'.
*   **Storage**: SQLite used for simplicity (zero-conf).
*   **Concurrency**: Uses `DataSource` transactions to ensure atomicity of transfers, preventing partial updates.

## Design Decisions
*   **TypeORM**: Chosen for easy entity management and abstraction.
*   **Structure**: standard NestJS modular architecture (`UserModule`, `WalletModule`, `TransactionModule`).
*   **Validation**: `class-validator` enforces input correctness (positive amounts, existing IDs).
