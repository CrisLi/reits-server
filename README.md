# Reits Server

>

## About

This project is the Reits backend server, provide the REST API for access Reits system.


## API

### Auth
----

#### Request

  `POST /auth`

  * Body

    ```json
    {
      "email": "admin@reits.com",
      "password": "helloreits!"
    }
    ```

#### Response

  * Body

    ```json
    {
      "token": "eyJ0eXAiOiJKV...."
    }
    ```

### Create User
----

#### Request

  `POST /users`

  * Header

    `Authorization: Bearer eyJ0eXAiOiJKV....`

  * Body

    ```json
    {
      "email": "chris@reits.com",
      "password": "helloreits!",
      "tenantId": "reits",
      "roles": ["PM", "FA"]
    }
    ```