# Setup
```bash
chmod +x startup.sh
chmod +x run.sh

./startup.sh
./run.sh
```

# API Endpoints
## `/accounts`
- `/`
  - `POST` (create user)
     - ```json
       {"username":"seeker1", "password":"seeker1", "role":"seeker"}
       ```
     - ```json
       {"username":"shelter1", "password":"shelter1", "role":"shelter", "address":"123 Main St, City, State, Zip"}
       ```
- `/<id:user_id>/`
  - `GET` (get user)
  - `PUT` (update user)
    - ```json
      {"first_name":"John", "last_name":"Doe"}
      ```
  - `DELETE` (delete user)
      


- `/auth/` (user login)
  - `POST`
  - ```json
    {"username":"seeker1", "password":"seeker1"}
    ```
  - ```json
    {"username":"shelter1", "password":"shelter1"}
    ```



## `/pets`

## `/comments`

## `/applications`

## `/notifications`


