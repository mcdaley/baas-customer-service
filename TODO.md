# BaaS Customer Microservice Requirments

## Bugs
- [x] For the UpdateCustomerDto the OmitType function does not filter
      out the 'ssn' when it is sent in a request. It also does not
      perform any validation on the ssn. NEED TO ADD THE WHITELIST OPTIONS
- [x] Above problem also does not filter out extra properties in the
      request object. For example, if I add "extra_data": "Not Defined"
      then the response contains the "extra_data" and a validation
      error is not thrown.
- [ ] Figure out HttpExceptionFilter is called when I reject and axios
      request.

## Customer Enhancements
- [x] Refactor the CustomerException classes to BaasException.
      => Just changed the name of customerServiceError param.
- [x] Create Factory method to handle exceptions caught in the 
      BankSimulatorCustomerService API that is more elegant than the
      current build exception. It should look like:

      ```javasript
      let baasError = makeBaasException(error)
      reject(baasError)
      ```
- [ ] Set the Simulator variables in the .env files
- [ ] See if I can dynamically load the "Bank Service" so I can toggle
      between the services by changing the environment or as scripts
      in the package.json
- [ ] Create Customer OpenAPI specification
- [ ] Define the different Customer states

## Error Handling
Look at reformatting the error response to:

{
  "error": {
    "id":           "unique identifier",
    "httpStatus":   "Http Status",
    "code":         "Internally defined app error code",
    "name":         "Internally defined app error name",
    "message":      "Detailed error message",
    "details": [
      {
        "target":   "Name of field for BadRequest errors",
        "message":  "Detailed validation message for the target field",
      },
      ...
    ]
    "stack":        "stack trace",
    "timestamp":    "Timestamp error occurred"
  }
}

- []  Update ValidationErrors[] to include all of the error details which
      are helpful for UIs to format the errors. Currently, I'm using the
      NestJS BadRequest exception which returns all of the messages.