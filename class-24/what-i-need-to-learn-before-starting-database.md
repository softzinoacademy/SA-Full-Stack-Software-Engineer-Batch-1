## before start the database connection backend engineer should know?
1. What is backend and frontend development
2. what is server? listen for requests and process them to provide responses
3. client server architecture ? 
    - Client sends requests to server
    - Server processes requests and sends back responses
4. How client and server communicate over network 
5. Request -> Processing -> Response following
6. What happens when you type a URL in the browser

-----------------------------------------
## before learning db need to learn in nodejs / express js

7. What is nodejs?
    - JavaScript runtime environment
    - Event-driven, non-blocking I/O model
8. how nodejs run without browser
    - Uses V8 engine to execute JavaScript
    - Provides APIs for file system, networking, etc.
    - Can handle multiple concurrent connections efficiently
9. what is npm and package.json
    - npm: Node Package Manager for managing dependencies
    - package.json: Configuration file for Node.js projects

    ** home task? what is cjs and mjs in nodejs or js explains
10. module require and import?

11. env variables?
12. middleware? What is middleware
    - Middleware is a common function that is reuse in application routes and endpoints

13. read and write file operations in nodejs
    - File system module (fs) for reading/writing files
    - Synchronous vs asynchronous operations
14. http methods (GET, POST, PUT / PATCH, DELETE, etc.)
    - GET: Retrieve data
    - POST: Create new data
    - PUT: Update existing data
    - PATCH: Partial update
    - DELETE: Remove data
15. Status code (200, 201, 400, 401, 403, 404, 500, etc.)
    - 200: OK
    - 201: Created
    - 400: Bad Request
    (authentication and authorization)
    - 401: Unauthorized
    - 403: Forbidden
    - 404: Not Found
    - 500: Internal Server Error

16. Header and Body
    - Headers: Metadata about the request/response (content-type, authorization, etc.)
    - Body: Actual data being sent (JSON, form data, etc.)
    - Common headers: Content-Type, Authorization, Accept, User-Agent, Cache-Control, Origin, X-Requested-With, etc.

17. Express js
    - Why express is needed for building web applications with Node.js
    - create server with express
    * routing *
    - request params
        - req.params: Access route parameters from URL 
            example: /users/123 where 123 is the id
            example: /products/abc123 where abc123 is the product ID
    - request.query: Access query parameters from URL
        - example: /users?page=1&limit=10
            - Access via req.query.page, req.query.limit
    - req.body: Access request body data (for POST/PUT requests)
        - Used to access JSON data sent in request body
        - Requires body-parser middleware or express.json() middleware
        - Example: { "name": "John", "email": "john@example.com" }

18. Architecture Pattern
    - MVC (Model-View-Controller): Separates application into Model (data), View (UI), Controller (logic)
    
    - MVT (Model-View-Template): Django's pattern, similar to MVC but with Template for presentation
    
    - Layered Architecture: Organizes application into distinct layers (presentation, business logic, data access)
        - Presentation Layer: Handles user interface and user interactions
        - Business Logic Layer: Contains the core application logic and rules
        - Data Access Layer: Manages database operations and data persistence
        - Example: In a web application, the presentation layer might be HTML/CSS/JavaScript, the business logic layer contains your application rules, and the data access layer handles database queries.

19. validation and error handling 
20. authentication and authorization

---------- scaling / Optimization ----------

    - Horizontal Scaling: Adding more servers to handle increased load
    - Vertical Scaling: Upgrading existing server hardware
    - Load Balancing: Distributing traffic across multiple servers
    - Caching: Storing frequently accessed data in memory for faster retrieval
    - Database Optimization: Indexing, query optimization, connection pooling
    - Connection Pooling: Reusing database connections to improve performance

    
