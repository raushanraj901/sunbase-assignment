# Sunbase-Assignment

Assignment given by Sunbase Pvt. Ltd.

## Overview

The Customer Management System is a comprehensive web application designed to efficiently manage customer data. It provides functionalities for user authentication, CRUD operations for customer information, and advanced search capabilities. Additionally, it supports synchronization of customer data with an external API.

## Features

- **Authentication**: Secure login and token-based session management.
- **CRUD Operations**: Add, Edit, Delete, and View Customer Data.
- **Search**: Search for customers by using first name, city, email, and phone.
- **Pagination**: View customer lists with pagination.
- **Sync**: Synchronize customer data with an external API (Sunbase API) and update the database accordingly.

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Spring Boot
- **Database**: MySQL

## Getting Started

### Prerequisites

- Java JDK 17+
- Springboot
- MySQL

- ### Installation

1. **Clone the Repository**

   ```bash
   https://github.com/raushanraj901/sunbase-assignment

2. **Set Up the Database**

- Create a MySQL database "sunbase" and update the database credentials in the `application.properties` file.

3. **Build and Run the Application**

- Open the project in your IDE (e.g., STS, Eclipse).
- Configure application.properties with your MySQL database credentials.
- Build and run the Spring Boot application.

4. **Access the Application**
- Open your web browser and navigate to http://localhost:8080 to access the application.

## Usage
### Register a New User

**POST** `http://localhost:8080/api/auth/registerCustomer`

**Headers:**
- Content-Type: application/json
- Accept: application/json

**Body:**
```json
{
  "email": "test@sunbasedata.com",
  "password": "Test@123",
  "firstName": "Raushan",
  "lastName": "Raj",
  "phone": "1236547890",
  "street": "Street-5",
  "address": "Patna",
  "city": "Patna",
  "state": "Bihar"
}
```
![img](https://github.com/raushanraj901/sunbase-assignment/blob/main/images/1.png)

### Login
**POST** `http://localhost:8080/api/auth/loginCustomer`

**Headers:**
- Content-Type: application/json
- Accept: application/json

**Body:**
```json
{
  "email": "test@sunbasedata.com",
  "password": "Test@123"
}
```
![img](https://github.com/raushanraj901/sunbase-assignment/blob/main/images/2.png)

### Add New Customer

**POST** `http://localhost:8080/api/customers/saveCustomer`

**Headers:**
- Content-Type: application/json
- Accept: application/json
- Authorization: Bearer [Your_JWT_Token_Here]

**Body:**
```json
{
  "email": "raushanraj@gmail.com",
  "password": "123456789",
  "firstName": "Raushan",
  "lastName": "Raj",
  "phone": "1236547890",
  "street": "Street-5",
  "address": "Patna",
  "city": "Patna",
  "state": "Bihar"
}
```
![img](https://github.com/raushanraj901/sunbase-assignment/blob/main/images/3.png)

### Edit a Customer

**PUT** `http://localhost:8080/api/customers/updateCustomer`

**Headers:**
- Content-Type: application/json
- Accept: application/json
- Authorization: Bearer [Your_JWT_Token_Here]

**Body:**
```json
{
  "email": "raushanraj@gmail.com",
  "password": "123456789",
  "firstName": "Raushan",
  "lastName": "Raj",
  "phone": "1236547890",
  "street": "Street-5",
  "address": "Patna",
  "city": "Patna",
  "state": "Bihar"
}
```

### Delete a Customer

**DELETE** `http://localhost:8080/api/customers/deleteCustomerByUuid?uuid=3`

**Headers:**
- Accept: application/json
- Authorization: Bearer [Your_JWT_Token_Here]


### Search
- Use the search functionality to filter customers based on criteria like first name, city, email, and phone. Designed in front-end

![img](https://github.com/raushanraj901/sunbase-assignment/blob/main/images/4.png)

### Sync Button And Pagination
- Located on the customer list screen, this button fetches customer data from a remote API and updates your database. If a customer already exists, their details are updated rather than creating a duplicate entry.
- Pagination functionality add

![img](https://github.com/raushanraj901/sunbase-assignment/blob/main/images/5.png)

## Contact
For further suggestions, enquiries, or issues, please contact `raushanraj901@gmail.com`
