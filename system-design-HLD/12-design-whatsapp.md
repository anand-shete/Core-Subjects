## Requirement Analysis

Functional requirements

- One-to-One send and receive message (text)
- Group chat support
- Last seen / Online-Offline functionality
- User Login / authentication

Non-functional requirements

- Scalability (Handles high traffic)
- Low latency Read / Writes
- High avaialability

## Back of Envelope

- Total users: 2 Billion
- 1 user sends 10 messages to 4 people in a day
-

1. DAU = 50 Million
2. Total messages in a day = 40 x 50 Million = 2 Billion messages/day
3. 1 Message = 100 chars = 200 Bytes
   2 Billion messages = 200 Bytes x 2 Billion = 400 GB/day

   To save chat history of users upto 10 years,
   10 years = 4000 days
   Total storage = 400 GB x 4000 days = = 1600 TB storage

4. Write QPS for 2 Billion messages,
   2 Billion / 86400 sec = 20 K Write QPS
   Peak QPS = 40 K Writess

## User Chat functionality

- Polling and Long Polling use HTTP (TCP)

- Use timestamp + UUID to generate message IDs in database
- In case network loss, re-route user to new chat server, and check the database for unread messages

## Group Chat functionality

- Group Table contains: Group ID (Partition Key), User, Message, Timestamp, etc.

- Chat server will get users of same group via Group Management service
- Ask User mapping service for the servers of respective group members
- Send the message to selected servers to which group members are connected
