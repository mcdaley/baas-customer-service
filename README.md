# BaaS Customer Microservice

## Overiew
The BaaS Customer Microservice provides a set of Rest APIs to create,
manage, and delete BaaS Customers, where a Customer is a person that 
is attempting to open either a consumer or business account.

The Customer Microservice does not connect to a core banking engine,
but is designed to be a framework that can plug into a core banking
engine in the future.

Currently, the APIs will connect to a fake service that will provide 
the expected response. Since there isn't a core bank engine the request
and responses will be based on current BaaS providers.

## Rest API
The customer microservice implements the following CRUD API endpoints.

### POST /v1/customers
Creates a new Customer with a status of "Pending", so the customer has
not passed KYC yet.

### GET /v1/customers
Fetches a list of Customers for a specific Client.

### GET /v1/customers/:customerId
Fetches a single Customer and returns it in the response.

### PUT /v1/customers/:customerId
Updates attributes of a Customer and returns the updated Customer in
the response.

### DELETE /v1/customers/:customerId
Deletes a Customer from the app. In the future this should not delete 
a Customer but should "lock" a Customers account.

## Articles
- [Managing multiple environments in NestJS](https://dev.to/pitops/managing-multiple-environments-in-n)

