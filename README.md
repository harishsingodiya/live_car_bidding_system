# live_car_bidding_system

## About this project
The Live Car Bidding System is a real-time auction platform for cars where users can:
  1. Participate in auctions.
  2. Place bids in real-time.
  3. View the highest bid instantly.
  4. Monitor active auctions and their status.

This system handles high-frequency bid placement and ensures data consistency while being scalable and secure.

This is a React + web socket + Express.js + MySQL live car bidding system.

## Prerequisites
Make sure the following dependencies are installed
1. Node.js
2. MySQL

## Setup for backend
1. Clone this project to your development machine
2. Open a console in the cloned directory(car-bidding-backend) and run `npm install` 
4. Now setup the database by running `node install.js` in the car-bidding-backend directory.
6. Start the express app by running `node server` in the server directory.
7. You can now open http://localhost:3001 to view your React app.

## Setup for frontend
1. Clone this project to your development machine
2. Open a console in the cloned directory(car-bidding-frontend) and run `npm install` 
4. Now start the app by running `npm run dev` in the car-bidding-frontend directory.
5. You can now open http://localhost:3000 to view your Next app.


## Note:
The .env file in the server directory can be used to specify the options for MySQL database such as host, port, etc.


## Credentials

username: harish

pass: 123
