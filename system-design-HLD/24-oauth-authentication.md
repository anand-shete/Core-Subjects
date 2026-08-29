## OAuth

OpenAuthorization is an authorization framework which enables secure third party access to user protected data
It enables secure third party access to user protected data

## Four Actors involved

1. Resource owner
2. Client
3. Authorization server
4. Resource hosting server

## Authorization Grant Types

Authorization grant types is mechanism used by client to obtain access token

1. **Authorization Code Grant**
2. Implicit grant
3. Resource owner password credentials grant:
4. **Client credential grant** (Machine to Machine)
5. **Refresh token grant** (used to get successive access token after initial Authorization code grant)

### Cross Site Resource Forgery

Attacker intercepts user token and after owner logs in using the forged token, attacker has access to all owner details

> Most secure is Authorization Code Grant + PKCE
