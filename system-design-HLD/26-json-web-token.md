# Json Web Token

Json Web Tokens are secure way of transmitting information between parties as JSON object
This information can be verified because its dignity signed using RSA (public/private) key pair

## Workflow

1. Client sends login credentials username and password to authorization server
2. Authorization server creates session ID and saves it in DB with payload data needed for authentication
3. Authentication server (API) generates and returns token with payload
4. Client request accesss to the resource server with token in authorization header
5. Resource server queries database to lookup session ID and do validation
6. Resource server (protected API route) authenticates user using token and send response to client

### Advantages

- Compact: Becuase of its size, it can be sent inside an HTTP header itself. And, due to its size, the transmission is fast
- Self Contained (Stateless): Payload contains all the required information about the user, and hence it avoids database query
- Can be signed using symmetric and asymetric algorithms
- Custom claim (additional data like `aud`, etc.) can be added in jwt

### Disadvantages

- Stateful: It relies on server side state management, which can cause issues in distributed systems
- Its just unique random string, when server receives id, it has to perform database query to fetch details

## JWT structure

A typical structure of json web tokens look like

**Header.Payload.Signature**

### 1. Header

- Contains metadata information of token
- `typ` is type of token which is `jwt` generally
- `alg` is signing algorithm used

Example header

```json
{
  "typ": "JWT",
  "alg": "RSA",
  "kid": "sfds34234"
}
```

### 2. Payload (claims)

- Contains claims (user information or payload)

#### 1. Registered claims

Registered claims have predefined meaning

```json
{
  "iss": "http://example.com/api/v1/auth",
  "sub": "1234567890",
  "exp": 1711945909,
  "email": "example@gmail.com",
  "jti": "unique_id_94934856"
}
```

`iss`(issuer): entity that issue the json web token
`sub`(subject): identifies the user
`aud`(audience): identifies recipient for which token is intended
`exp`(expiration time): sets expiry time after which token becomes invalid
`nbf`(not before): token should not be accepted before this time
`iat`(issued at): time at which token is issued
`jti`(jwt id): unique JWT ID

#### 2. Public claims

It is a custom claim which can be shared and understood by multiple parties

#### 3. Private claim

It's custom claim, which are intended for internal use only and not standardized, nor expected that other parties understand this

### 3. Signature example

```json

```

> Header, Payload and Signature are base64 encoded