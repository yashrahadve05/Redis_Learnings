## Commands in Redis

1. Set: Stores single key-value pair in Redis.
   - Example: `SET key value`
2. Get: Retrieves the value associated with a key.
    - Example: `GET key`
3. Del: Deletes a key-value pair from Redis.
    - Example: `DEL key`
4. Exists: Checks if a key exists in Redis.
    - Example: `EXISTS key`
5. Incr: Increments the value of a key by 1.
    - Example: `INCR key`
6. Decr: Decrements the value of a key by 1.
    - Example: `DECR key`
7. Expire: Sets a timeout on a key, after which it will be deleted.
    - Example: `EXPIRE key seconds`
8. TTL: Returns the remaining time to live of a key that has an expiration.
    - Example: `TTL key`
9. Keys: Returns all keys matching a pattern.
    - Example: `KEYS pattern`
10. Flushall: Deletes all keys from all databases.
    - Example: `FLUSHALL`
11. HSet: Sets a field in a hash stored at key to value (Stores Object).
    - Example: `HSET key field value`
12. HGet: Retrieves the value associated with a field in a hash.
    - Example: `HGET key field`
13. HDel: Deletes a field from a hash.
    - Example: `HDEL key field`
14. HExists: Checks if a field exists in a hash.
    - Example: `HEXISTS key field`  
15. Hgetall: Retrieves all fields and values of a hash (used for getting entire object).
    - Example: `HGETALL key`