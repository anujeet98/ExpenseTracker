Project setup steps:
1] Clone the repository. For latest changes, check branch: ProductionDeployment
2] Intitial requirements: NodeJS, NPM, nodemon on local environment.
3] Install all project dependencies: npm install
4] Add .env file. Replace '*******' with credentials. 
   Sample- 
   //JWT secret
   AUTH_KEY = "************************"

   //Razorpay credentials
   RAZORPAY_KEY = "************************"
   RAZORPAY_SECRET = "************************"

   //mail client credentials
   MJ_APIKEY_PUBLIC = "************************"
   MJ_APIKEY_PRIVATE = "************************"
   SIB_SENDER_EMAIL = "**********@*****.com"
   SIB_SENDER_NAME = "ExpenseTracker*****"

   //AWS S3 credentials
   AWS_S3_KEY = "************************"
   AWS_S3_SECRET = "************************"
   AWS_S3_BUCKET = "************************"
   EXPENSE_PER_PAGE = 5

   BACKEND_ADDR = "http://**********:3009"
   
   //MongoDB credentials for NoSQL implementation
   MONGODB_CONN_STR = "mongodb+srv://*******************@cluster0.ijrpm3b.mongodb.net/expenseTracker?retryWrites=true&w=majority"

   //DB credentials for SQL Implementation
   DB_NAME = "**************"
   DB_USERNAME = "root"
   DB_PASSWORD = "*************"
   DB_HOST = "*************"
   APP_PORT = "3000"
5] npm start app.js

