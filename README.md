# WTWR (What to Wear?): Back End

## Project Description
This is the backend server for the "What to Wear?" application, designed to manage user data and clothing items. It provides a RESTful API for creating, reading, updating, and deleting users and clothing items, as well as handling item likes. The server integrates with a MongoDB database for persistent storage and includes robust error handling and data validation.

## Technologies Used
*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web application framework for Node.js.
*   **MongoDB**: NoSQL database for data storage.
*   **Mongoose**: MongoDB object data modeling (ODM) for Node.js, simplifying interactions with MongoDB.
*   **Validator**: Library for string validation and sanitization.
*   **ESLint with Airbnb config**: Linter for enforcing code style and best practices.
*   **Nodemon**: Utility that automatically restarts the Node.js application when file changes are detected during development.
*   **CORS**: Middleware for enabling Cross-Origin Resource Sharing.

## Setup and Running the Project

### Prerequisites
*   Node.js (LTS version recommended)
*   npm (Node Package Manager)
*   MongoDB instance (local or remote)

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository_url>
    cd se_project_express
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Environment Variables
Create a `.env` file in the root of the `se_project_express` directory with the following variables:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/wtwr_db
```
*   `PORT`: The port on which the server will run (e.g., 3001).
*   `MONGODB_URI`: The connection string for your MongoDB database.

### Running the Server
*   **Development Mode (with hot reload):**
    ```bash
    npm run dev
    ```
*   **Production Mode:**
    ```bash
    npm start
    ```

## API Endpoints

The API provides endpoints for managing users and clothing items. All endpoints are prefixed with `/`.

### Users

*   **`GET /users`**
    *   **Description**: Retrieves all users.
    *   **Response**: `200 OK`
        ```json
        [
            {
                "_id": "60d5ec49f8e9a20015b7c8d1",
                "name": "Jane Doe",
                "avatar": "https://example.com/avatar1.jpg"
            }
        ]
        ```

*   **`GET /users/:_id`**
    *   **Description**: Retrieves a single user by ID.
    *   **Parameters**: `_id` (string, MongoDB ObjectId)
    *   **Response**: `200 OK`
        ```json
        {
            "_id": "60d5ec49f8e9a20015b7c8d1",
            "name": "Jane Doe",
            "avatar": "https://example.com/avatar1.jpg"
        }
        ```
    *   **Error**: `404 Not Found` if user does not exist. `400 Bad Request` if invalid ID format.

*   **`POST /users`**
    *   **Description**: Creates a new user.
    *   **Request Body**:
        ```json
        {
            "name": "John Doe",
            "avatar": "https://example.com/avatar2.jpg"
        }
        ```
    *   **Response**: `201 Created`
        ```json
        {
            "_id": "60d5ec49f8e9a20015b7c8d2",
            "name": "John Doe",
            "avatar": "https://example.com/avatar2.jpg"
        }
        ```
    *   **Error**: `400 Bad Request` for validation errors (e.g., missing name, invalid avatar URL).

### Clothing Items

*   **`GET /items`**
    *   **Description**: Retrieves all clothing items.
    *   **Response**: `200 OK`
        ```json
        [
            {
                "_id": "60d5ec49f8e9a20015b7c8d3",
                "name": "T-Shirt",
                "weather": "hot",
                "imageUrl": "https://example.com/tshirt.jpg",
                "owner": "60d5ec49f8e9a20015b7c8d1",
                "likes": [],
                "createdAt": "2023-10-27T10:00:00.000Z"
            }
        ]
        ```

*   **`GET /items/:itemId`**
    *   **Description**: Retrieves a single clothing item by ID.
    *   **Parameters**: `itemId` (string, MongoDB ObjectId)
    *   **Response**: `200 OK`
        ```json
        {
            "_id": "60d5ec49f8e9a20015b7c8d3",
            "name": "T-Shirt",
            "weather": "hot",
            "imageUrl": "https://example.com/tshirt.jpg",
            "owner": "60d5ec49f8e9a20015b7c8d1",
            "likes": [],
            "createdAt": "2023-10-27T10:00:00.000Z"
        }
        ```
    *   **Error**: `404 Not Found` if item does not exist. `400 Bad Request` if invalid ID format.

*   **`POST /items`**
    *   **Description**: Creates a new clothing item. Requires authentication (user ID from `req.user._id`).
    *   **Request Body**:
        ```json
        {
            "name": "Summer Dress",
            "weather": "warm",
            "imageUrl": "https://example.com/dress.jpg"
        }
        ```
    *   **Response**: `201 Created`
        ```json
        {
            "_id": "60d5ec49f8e9a20015b7c8d4",
            "name": "Summer Dress",
            "weather": "warm",
            "imageUrl": "https://example.com/dress.jpg",
            "owner": "60d5ec49f8e9a20015b7c8d1",
            "likes": [],
            "createdAt": "2023-10-27T10:05:00.000Z"
        }
        ```
    *   **Error**: `400 Bad Request` for validation errors (e.g., missing name, invalid weather, invalid image URL).

*   **`DELETE /items/:itemId`**
    *   **Description**: Deletes a clothing item by ID. Requires authentication (owner check).
    *   **Parameters**: `itemId` (string, MongoDB ObjectId)
    *   **Response**: `200 OK`
        ```json
        {
            "message": "Item deleted successfully"
        }
        ```
    *   **Error**: `404 Not Found` if item does not exist. `400 Bad Request` if invalid ID format. `403 Forbidden` if user is not the owner.

*   **`PUT /items/:itemId/likes`**
    *   **Description**: Adds a user's like to a clothing item. Requires authentication.
    *   **Parameters**: `itemId` (string, MongoDB ObjectId)
    *   **Response**: `200 OK`
        ```json
        {
            "_id": "60d5ec49f8e9a20015b7c8d3",
            "name": "T-Shirt",
            "weather": "hot",
            "imageUrl": "https://example.com/tshirt.jpg",
            "owner": "60d5ec49f8e9a20015b7c8d1",
            "likes": ["60d5ec49f8e9a20015b7c8d1"],
            "createdAt": "2023-10-27T10:00:00.000Z"
        }
        ```
    *   **Error**: `404 Not Found` if item does not exist. `400 Bad Request` if invalid ID format.

*   **`DELETE /items/:itemId/likes`**
    *   **Description**: Removes a user's like from a clothing item. Requires authentication.
    *   **Parameters**: `itemId` (string, MongoDB ObjectId)
    *   **Response**: `200 OK`
        ```json
        {
            "_id": "60d5ec49f8e9a20015b7c8d3",
            "name": "T-Shirt",
            "weather": "hot",
            "imageUrl": "https://example.com/tshirt.jpg",
            "owner": "60d5ec49f8e9a20015b7c8d1",
            "likes": [],
            "createdAt": "2023-10-27T10:00:00.000Z"
        }
        ```
    *   **Error**: `404 Not Found` if item does not exist. `400 Bad Request` if invalid ID format.

## Screenshots / Demo
[Include screenshots of the application in action or a link to a short video demo here.]

## Testing
Before committing your code, make sure you edit the file `sprint.txt`
in the root folder. The file `sprint.txt` should contain the number of
the sprint you're currently working on. For ex. 12
