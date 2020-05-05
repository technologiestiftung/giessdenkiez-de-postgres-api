# Internet of Trees API

This repo demonstrates how to setup express to run on v2 of now.sh.
There's also a [blog post](BLOG.md) with more details on setting it up.

This repo deploys the API for the trees PostGRES database.

To deploy adjustments you need:

1. an account at ZEIT
2. the credentials of an existing db (these have to be stored in a ```.env``` file of the root directory)

```
user=dbUsername
database=dbTableName
password=dbUserPassword
port=dbPort
host=dbUrl
jwt_secret=jwtAuthentificationSecret
# you can find the values below in your auth0 api settings
jwksUri=
audience=
issuer=
```