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

### POST /v1/customers

## Articles
- [Managing multiple environments in NestJS](https://dev.to/pitops/managing-multiple-environments-in-n)

