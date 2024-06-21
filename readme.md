

## Running Docker Containers

1. **PostgreSQL:**
   - Navigate to the `database-docker` directory.
   - Run the following command:
     ```bash
     docker-compose up -d
     ```

## Installing Dependencies

3. **To install all necessary packages, run the following command in the root of the project:**

```bash
npm install
```
## Running server
4. **Run the server:**
```bash
node ./index.js
```

#### Get history with pagination

```http
  GET /history?userId=&page=pageNumber&limit=limitNumber
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `userId` | `string` | id of user |
| `pageNumber` | `number` | total page |
| `limitNumber` | `number` | total record count |



