# Scaling Guide (Simplified)

Here is how we ensure the Wallet Service handles millions of users and transactions reliably.

## 1. Money Math (Precision)
*   **What**: Store money as **Integers** (cents or hundredths of a currency unit) representing the smallest unit of currency, strictly avoiding floating-point decimals.
    *   *Example*: Store `$1.50` as `150`, `$0.10` as `10`.
*   **Why**: Computers use base-2 binary logic, which cannot precisely represent certain base-10 decimals (like `0.1`).
    *   *The "Floating Point" Error*: `0.1 + 0.2` results in `0.30000000000000004` rather than exactly `0.3`.
    *   *The Fix*: Integer math is exact (`10 + 20 = 30`). By counting cents instead of dollars, we eliminate rounding errors and "missing penny" bugs entirely, only converting to decimals for display.

## 2. The Database (The Core)
*   **Connection Pooling (PgBouncer)**: Imagine the database is a building with only 100 doors. If 10,000 users try to enter, it crashes. A "Pooler" lines them up efficiently so the database handles them without crashing.
*   **Read vs. Write**: Use the main database only for moving money (Writes). Use copies (Replicas) for people just checking their balance (Reads).
*   **Sharding**: If we grow really big, split data across multiple servers. e.g., Users A-M on Server 1, Users N-Z on Server 2.

## 3. Speed (Caching)
*   **Redis**: Checking the database 1,000 times a second is slow. Store "hot" data (like active user balances) in **Redis** (fast memory). It's like keeping a note on your desk instead of walking to the filing cabinet every time.

## 4. Background Tasks (Queues)
*   **RabbitMQ**: Don't make the user wait for non-urgent things.
    *   *Example*: When a transfer finishes, tell the user "Success!" immediately. Then, put tasks like "Send Email Receipt" or "Update Analytics" into a queue to be done in the background.

## 5. Servers (App Layer)
*   **Horizontal Scaling**: Our API is "stateless" (it doesn't remember who you are between requests). This means we can run 50 copies of it. A **Load Balancer** sits in front and spreads traffic evenly to whichever copy is free.
