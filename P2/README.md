# Setup
```bash
chmod +x startup.sh
chmod +x run.sh

./startup.sh
./run.sh
```

# API Endpoints
## `/accounts`
- `/registration`
  - `POST`
  - ```json
    {"username":"seeker1", "password":"seeker1", "role":"seeker"}
    ```
  - ```json
    {"username":"shelter1", "password":"shelter1", "role":"shelter", "address":"123 Main St, City, State, Zip"}
    ```
- `/auth`
  - `POST`
  - ```json
    {"username":"seeker1", "password":"seeker1"}
    ```
  - ```json
    {"username":"shelter1", "password":"shelter1"}
    ```
- `/update`
  - `PATCH`
  - ```json
    {"first_name":"John", "last_name":"Doe"}
    ```
- `/delete`
  - `DELETE`

- 
- `/view/?role=<role>&user_id=<id>`
  - `GET`


## `/pets`

## `/comments`

## `/applications`

## `/notifications`


