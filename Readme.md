# Redis Learning

## Redis:
Redis (Remote Dictionary Server) is an open-source, in-memory data structure store, used as a distributed cache, message broker, and database. It is known for its high performance, versatility, and wide range of use cases. Redis supports various data structures like strings, hashes, lists, sets, and sorted sets, and allows for data persistence, replication, and clustering.

## Key Features:
- **In-memory storage**: Offers extremely fast data access and processing.
- **Data structures**: Supports diverse data structures like strings, hashes, lists, sets, sorted sets, and bitmaps.
- **Persistence**: Supports point-in-time snapshots (RDB) and append-only file (AOF) logging for data durability.
- **Replication**: Supports master-slave replication for high availability and read scaling.
- **Clustering**: Allows for horizontal scaling through Redis Cluster for distributed data management.
- **Transactions**: Supports atomic execution of multiple commands.
- **Pub/Sub**: Built-in support for publish-subscribe messaging.
- **Lua scripting**: Allows executing custom logic on the server side.

## Use Cases:
1. **Caching**: Caching frequently accessed data to reduce database load and improve response times.
2. **Session management**: Storing user session data for web applications.
3. **Real-time analytics**: Real-time data processing and analytics with features like time-series data and geospatial indexing.
4. **Message queues**: Implementing message queues for distributed systems with pub/sub and list-based queues.
5. **Rate limiting**: Implementing rate limiting and access control mechanisms.
6. **Leaderboards**: Maintaining real-time leaderboards using sorted sets.
7. **Job scheduling**: Implementing job scheduling and task management.
8. **Distributed locks**: Implementing distributed locks for coordinating access to shared resources.

## Redis Installation:

### Windows:
```bash
# Using Docker (recommended for Windows)
docker run -d -p 6379:6379 --name my-redis redis:latest
```

## Connecting to Redis:

```bash
# Using redis-cli
redis-cli
```

## 🚀 Project Overview & Commands Used

This repository contains multiple mini-projects demonstrating different Redis use cases in Node.js. Here is a quick analysis of the projects and the specific Redis commands they use:

| Project | Description | Redis Commands Used |
|---------|-------------|---------------------|
| **02_Setup_Local_Redis** | Basic local Redis setup and testing connection. | `SET`, `GET` |
| **03_Website_Banner_Redis** | Caching website banner data to avoid frequent DB hits. | `SET`, `GET` |
| **04_OTP_Login_with_TTL** | Generating an OTP and expiring it automatically after a set time. | `SET` (with `EX`), `GET`, `DEL`, `TTL` |
| **05_User_Profile_Cache_JSON_vs_Hash** | Comparing storing user profiles as JSON strings vs Redis Hashes. | `SET`, `GET`, `HSET`, `HGETALL` |
| **06_Email_Queue_with_Redis_List** | Using Redis Lists to implement a basic message queue. | `LPUSH`, `RPOP` |
| **07_Order_Confirmation_Jobs_with_BullMQ** | Using BullMQ (which runs on Redis) for background jobs. | *(BullMQ internals)* |
| **08_Live_Admin_Notification_PubSub** | Real-time messaging using Redis Pub/Sub mechanism. | `SUBSCRIBE`, `PUBLISH`, `ON("message")` |
| **09_Live_Leaderboard_with_Redis** | Real-time leaderboard and view counter using Sorted Sets and counters. | `INCR`, `ZINCRBY`, `ZREVRANK`, `ZREVRANGE` |

---

## 🔥 Important Redis Commands (Revision Guide)

### 📌 General & Key Management
| Command | Description | Example |
|---------|-------------|---------|
| `KEYS pattern` | Find keys matching a given pattern. | `KEYS *` or `KEYS user:*` |
| `DEL key` | Delete a key. | `DEL user:1` |
| `EXPIRE key seconds` | Set an expiration time on a key. | `EXPIRE otp:123456 60` |
| `TTL key` | Get the remaining time to live (in seconds). | `TTL otp:123456` |
| `INFO` | Get information and statistics about the server. | `INFO` |
| `PING` | Test if the server is running. | `PING` |
| `FLUSHALL` | Delete ALL keys from ALL databases (use with caution). | `FLUSHALL` |

### 📌 Strings (Caching, Counters, Simple Values)
Used in OTP generation, simple caching, and counting.
```bash
SET user:1:name "Alice" EX 60   # Set value with 60s expiration
GET user:1:name                 # Retrieve value
INCR post:100:views             # Increment integer value by 1
DECR inventory:item:1           # Decrement integer value by 1
```

### 📌 Hashes (Objects, User Profiles)
Perfect for storing objects like user profiles.
```bash
HSET user:1 name "Bob" age 30 city "New York"  # Set multiple fields
HGET user:1 name                               # Get single field
HGETALL user:1                                 # Get all fields and values
HDEL user:1 age                                # Delete a specific field
```

### 📌 Lists (Queues, Recent Items)
Used for basic message queues or keeping a list of recent items.
```bash
LPUSH queue:emails "job1"       # Push to the left (start of list)
RPUSH queue:emails "job2"       # Push to the right (end of list)
LPOP queue:emails               # Pop from the left
RPOP queue:emails               # Pop from the right
LRANGE queue:emails 0 -1        # Get all elements in the list
```

### 📌 Sets (Unique Items, Tags)
Used when you need to ensure uniqueness, like user tags or active sessions.
```bash
SADD users:active "user1" "user2"  # Add members to set
SMEMBERS users:active              # Get all members
SISMEMBER users:active "user1"     # Check membership (returns 1 if exists)
SREM users:active "user1"          # Remove a member
```

### 📌 Sorted Sets (Leaderboards, Priority Queues)
Used heavily in the live leaderboard project.
```bash
ZADD leaderboard 100 "player1"           # Add member with a score
ZINCRBY leaderboard 50 "player1"         # Increment member's score by 50
ZREVRANK leaderboard "player1"           # Get rank (highest score = rank 0)
ZREVRANGE leaderboard 0 9 WITHSCORES     # Get top 10 members with scores
```

### 📌 Pub/Sub (Real-time Messaging)
Used in the live admin notification project.
```bash
PUBLISH notifications "Admin logged in"  # Send a message to a channel
SUBSCRIBE notifications                  # Listen to a channel
```

## Advanced Features:

### Persistence:
- **RDB (Redis Database)**: Point-in-time snapshots (automatic or manual) for disaster recovery.
- **AOF (Append-Only File)**: Logs every write operation for better durability.

### Transactions:
Executes a group of commands as a single isolated operation.
```bash
MULTI            # Start transaction
SET key1 value1
SET key2 value2
EXEC             # Execute all commands
```

## Common Configurations:
```properties
# redis.conf
port 6379
maxmemory 2gb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## Redis vs Memcached:

| Feature | Redis | Memcached |
|---------|-------|-----------|
| **Data structures** | Strings, Hashes, Lists, Sets, Sorted Sets | Strings only |
| **Persistence** | Yes (RDB, AOF) | No (in-memory only) |
| **Replication** | Master-Slave with Sentinel | Slave-only replication |
| **Clustering** | Built-in Redis Cluster | External client-based sharding |
| **Memory management** | LRU, LFU, TTL, overflow policies | LRU only |
| **Use cases** | Caching, sessions, queues, real-time apps | Simple caching |

## Additional Resources:

### Official Documentation:
- [Redis Documentation](https://redis.io/docs)
- [Redis Commands](https://redis.io/commands)
- [Redis Recipes](https://redis.io/topics/recipes)

### Tutorials:
- [Redis for Beginners](https://redis.io/topics/quickstart)
- [Redis Data Structures](https://redis.io/topics/data-structures)
- [Redis Patterns](https://redis.io/topics/patterns)

### Tools:
- [RedisInsight](https://redis.com/redis-for-developers/redisinsight/): Official GUI tool for Redis
- [KeyDB](https://keydb.dev/): High-performance Redis fork with multi-master replication
- [RESP.app](https://resp.app/): Modern Redis client for macOS and Windows

## Best Practices:
1. **Use appropriate data structures** - Choose the right data structure for your use case to optimize performance.
2. **Implement proper expiration** - Use TTL to automatically expire stale data and prevent memory leaks.
3. **Use persistence only when needed** - Enable persistence only if data durability is required, as it impacts performance.
4. **Monitor memory usage** - Keep track of memory usage and configure `maxmemory` to prevent OOM errors.
5. **Implement proper error handling** - Handle Redis connection errors and implement retry logic.
6. **Use pipelining for multiple commands** - Combine multiple commands into a single round trip to reduce latency.
7. **Implement monitoring** - Monitor key metrics like memory usage, hit rate, and command latency.
8. **Use Redis Sentinel for high availability** - Deploy Sentinel for automatic failover in production.

