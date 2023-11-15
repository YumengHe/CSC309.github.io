# Setup

```bash
chmod +x startup.sh
chmod +x run.sh

./startup.sh
./run.sh
```

# Model Design

![Class Diagram](UML.jpg)

# API Endpoints

## `Accounts Endpoints`

-   `/accounts/`
    -   `POST` (create user)
        -   ```json
            { "username": "seeker1", "password": "seeker1", "role": "seeker" }
            ```
        -   ```json
            {
            	"username": "shelter1",
            	"password": "shelter1",
            	"role": "shelter",
            	"address": "123 Main St, City, State, Zip"
            }
            ```
-   `/accounts/<id:user_id>/`

    -   `GET` (get user)
    -   `PUT` (update user)
        -   ```json
            { "first_name": "John", "last_name": "Doe" }
            ```
    -   `DELETE` (delete user)

-   `/accounts/auth/` (user login)
    -   `POST`
    -   ```json
        { "username": "seeker1", "password": "seeker1" }
        ```
    -   ```json
        { "username": "shelter1", "password": "shelter1" }
        ```

## `Pets Endpoints`

## `Comments Endpoints`

## `Applications Endpoints`

-   `/applications/seeker/` 
    - `GET` Retrieve list of application for the login pet seeker 
        - **Example Response**
            ```json
                {    
                  "count": 3,
                  "next": null,
                  "previous": null,
                  "results": [
                      {
                          "id": 5,
                          "seeker": 8,
                          "petpost": 4,
                          "status": "pending",
                          "last_updated": "2023-11-14T20:16:58.349515-05:00",
                          "created_at": "2023-11-10T16:49:45.324047-05:00"
                      },
                      {
                          "id": 6,
                          "seeker": 8,
                          "petpost": 2,
                          "status": "pending",
                          "last_updated": "2023-11-12T14:44:54.192166-05:00",
                          "created_at": "2023-11-12T00:41:27.110517-05:00"
                      },
                      {
                          "id": 7,
                          "seeker": 8,
                          "petpost": 5,
                          "status": "withdrawn",
                          "last_updated": "2023-11-12T14:44:13.948556-05:00",
                          "created_at": "2023-11-12T00:42:12.010093-05:00"
                      }
                  ]
              }
            ```
        - **Additional Notes**
-   `/applications/seeker/<application_id>`
-   `/applications/shelter/`
-   `/applications/shelter/<application_id>`
-   `/applications/pet/<pet_id>/`
-   `/<application_id>/conversations/`

## `Notifications Endpoints`

-   `/notifications`
-   `/notifications/<notification_id>`
