---
runme:
  id: 01HPAJC552GMKWKBEBA49MSSCP
  version: v2.2
---

# Project setup steps:

1] Clone the repository.
For updated code, check branch: ProductionDeployment

2] Intitial requirements:

```sh {"id":"01HPAJC54ZKD0RXY2P1HDJJNPH"}
NodeJS, NPM

```

3] Install all project dependencies:

```sh {"id":"01HPAJC54ZKD0RXY2P1N80QGZB"}
npm install

```

4] Add .env file. Replace '*******' with credentials.

Sample-

```vba {"id":"01HPAJC54ZKD0RXY2P1NFHD151"}
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

   ACCEPTED_ORIGINS = '["http:localhost:3000"]'


   //DB credentials if intend to use SQL Implementation
   DB_NAME = "**************"
   DB_USERNAME = "root"
   DB_PASSWORD = "*************"
   DB_HOST = "*************"

   APP_PORT = "3000"

```

5] Start the server

```sh {"id":"01HPAJC550261DEKEHJW9VDR7H"}
npm start app.js

```

Note: Ensure database is already setup in mongodb.

Tech stack used : JavaScript, HTML, CSS <br/>
Frameworks used : Express, Bootstrap <br/>
Deployment : AWS ec-2 <br/>
CI-CD : Jenkins <br/>
Storage : MongoDB(Production Deployment branch), MySQL(old deployment on master branch, deployment AWS RDS), AWS S3 bucket <br/>
ODM library: Mongoose <br/>
ORM library: Sequelize (old deployment on master branch) <br/>
Token based authentication : JWT <br/>

App features : <br/>
Integrated payment module : Razorpay API <br/>
Dynamic data visualization : chart.js <br/>
Dynamic pagination <br/>
Report generation <br/>
Leaderboard and expense categorization <br/>
