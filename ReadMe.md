
# TCG Backend with Elasticsearch


## Features
- **Search Cards**: Query cards using complex Elasticsearch queries.
- **RESTful API**: Exposes endpoints for querying card data.
- **TypeScript**: Strongly typed backend for robust development.
- **Dockerized**: Automatically seeds and indexes data during container build.

---

## Prerequisites
- **Node.js**: Version 16 or higher (if running locally).
- **Docker**: Installed and running.
- **Docker Compose**: Installed and configured.

---

## Installation

### Clone the Repository
```bash
git clone https://github.com/your-repo/tcg-backend.git
cd tcg-backend
```

### Install Dependencies (For Local Development)
```bash
npm install
```

---

## Configuration

### Environment Variables
Create a `.env` file in the root directory and set the following variables:

```plaintext
MONGO_URI=mongodb://mongo:27017/cards
ELASTICSEARCH_URI=http://localhost:9200
```

---

## Running the Application

### Using Docker
The Dockerfile is configured to automatically seed and index data during the build process.

Run the application and its dependencies using Docker Compose:
```bash
docker-compose up --build
```

This will:
1. Start the MongoDB and Elasticsearch services.
2. Start the Node.js backend on `http://localhost:3000`.

### Without Docker
1. Start MongoDB and Elasticsearch locally.
2. Seed and index the card data manually:
   ```bash
   npm run card:feed
   npm run card:index
   ```
3. Start the backend server:
   ```bash
   npm run dev
   ```

---

## API Endpoints

### **POST /cards**
Execute an Elasticsearch query to fetch card data.

#### Request
- **Method**: POST
- **Body**: Raw Elasticsearch query

Example:
```json
{
  "bool": {
    "must": [
      { "match": { "name": "fire" } }
    ],
    "filter": [
      { "term": { "rarity": "common" } },
      { "range": { "ink_cost": { "gte": 2, "lte": 5 } } }
    ]
  }
}
```

#### Response
- **200 OK**: Returns matching cards.
- **400 Bad Request**: If no query is provided.
- **500 Internal Server Error**: If Elasticsearch query fails.

Example Response:
```json
[
  {
    "id": "1",
    "name": "Fireball",
    "rarity": "common",
    "color": "R",
    "ink_cost": 3,
    "game": "MTG"
  }
]
```

---

## Development

### Scripts
- **Seed Data**:
  ```bash
  npm run card:feed
  ```
- **Index Data**:
  ```bash
  npm run card:index
  ```
- **Run the Server**:
  ```bash
  npm run dev
  ```

---

## Testing

### Example Request
Use curl or Postman to test the `/cards` endpoint:

```bash
curl -X POST http://localhost:3000/cards   -H "Content-Type: application/json"   -d '{
    "bool": {
      "must": [
        { "match": { "name": "fire" } },
        { "match": { "game": "Lorcana" } }
      ],
      "filter": [
        { "term": { "rarity": "common" } },
        { "range": { "ink_cost": { "gte": 2, "lte": 5 } } }
      ]
    }
  }'
```

## Extending the System for New Games or Attributes

The system is designed to be flexible and easily extensible. Here’s how you can extend it:

### 1. Adding a New Game
- **Data Ingestion**: Update the `feedCards.ts` script to handle the new game's data format and add relevant transformations.
- **Database Schema**: MongoDB supports schema-less documents. Add new fields dynamically or extend the Mongoose model for validation.
- **Indexing**: Modify `indexCards.ts` to include the new game’s data and update Elasticsearch mappings with relevant attributes.
- **API Enhancements**: Extend the `/cards` endpoint to filter by new game-specific attributes or accept queries relevant to the new game.

### 2. Adding New Attributes
- **Database**: MongoDB will automatically accommodate new fields. Update the Mongoose model to validate and normalize these fields.
- **Elasticsearch Mappings**: Update the Elasticsearch index mappings to include new fields and specify appropriate data types (e.g., `integer`, `text`, `keyword`).
- **API Filters**: Add support for querying by the new attributes in the API, ensuring backward compatibility.