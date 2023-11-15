# Setup

```bash
chmod +x startup.sh
chmod +x run.sh

./startup.sh
./run.sh
```

# Model Design

![Class Diagram](UML.jpg)

# APIs

## Accounts Endpoints

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

## Pets Endpoints

## Comments Endpoints

## Applications Endpoints

-   `/applications/seeker/`

    -   `GET` Retrieve the list of applications that were submitted by the login user whose role is seeker

        -   **Example Response**

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

        -   **Additional Notes**

            1.  Support pagination by passing parameters `page_size` (number of results to return per page, default value is set to 10) and `page` (a page number within the paginated result set). <br>

                > Eg. `/applications/seeker/?page_size=5&page=1`

            2.  Support filtering applications by status. The parameter `status` is passed in and it takes one of these values `['pending', 'accepted', 'denied', 'withdrawn']`. Others will be ignored. <br>

                > Eg. `/applications/seeker?status=pending`

            3.  Support sorting applications by creation time or last update time. The parameter `sort` is passed in and it takes one of these values `['creation', '-creation', 'updated', '-updated']`. For creation time in an ascending order, use value `'creation'`; for the most recent update, use value `'update'`. The `'-'` sign reverses the order.

                > Eg. `/applications/seeker?sort=update`

            4.  Authentication and permission are required. A **401 UNAUTHORIZED** response is returned for non-logged-in users, while a **403 FORBIDDEN** response is returned for logged-in users whose `role` field is not set to `'seeker'`.

-   `/applications/shelter/`

    -   `GET` Retrieve the list of applications that were received by the login user whose role is shelter

        -   **Example Response**
            ```json
            {
            	"count": 2,
            	"next": null,
            	"previous": null,
            	"results": [
            		{
            			"id": 16,
            			"seeker": 6,
            			"petpost": 5,
            			"status": "pending",
            			"last_updated": "2023-11-14T20:18:31.411855-05:00",
            			"created_at": "2023-11-14T20:18:31.411802-05:00"
            		},
            		{
            			"id": 5,
            			"seeker": 8,
            			"petpost": 4,
            			"status": "pending",
            			"last_updated": "2023-11-14T20:16:58.349515-05:00",
            			"created_at": "2023-11-10T16:49:45.324047-05:00"
            		}
            	]
            }
            ```
        -   **Additional Notes**

            1.  Support pagination, filtering, and sorting. For details see `/applications/seeker/`

            2.  Authentication and permission are required. A **401 UNAUTHORIZED** response is returned for non-logged-in users, while a **403 FORBIDDEN** response is returned for logged-in users whose `role` field is not set to `'shelter'`.

            3.  A shelter user can only view the applications that were submitted for their own pets, not that of applications associated with other shelters' pets.

-   `/applications/seeker/<application_id>`

    -   `GET` Retrieve the application whose `id` is passed in as path parameter `application_id`, which was submitted by the login user with role seeker

        -   **Example Response**

            ```json
            {
            	"id": 4,
            	"created_at": "2023-11-10T16:48:11.002137-05:00",
            	"last_updated": "2023-11-14T20:22:24.452411-05:00",
            	"seeker": 6,
            	"petpost": 4,
            	"status": "pending",
            	"adopter_firstname": "Chan",
            	"adopter_lastname": "Yu",
            	"adopter_email": "chan@email.com",
            	"co_adopter_firstname": null,
            	"co_adopter_lastname": null,
            	"co_adopter_email": null,
            	"addr_street": "1 Main St.",
            	"addr_city": "Toronto",
            	"addr_province": "ON",
            	"addr_postal": "M1K 1K1",
            	"phone": "+12125552368",
            	"phone_type": "cell",
            	"have_pet_currently": false,
            	"have_pet_notes": "",
            	"family_members": "me 3000 years old"
            }
            ```

        -   **Additional Notes**

            1. **401 UNAUTHORIZED** response received when an unauthenticated user accesses.

            2. **403 FORBIDDEN** response is returned for login user whose `role` field is not `'seeker'`, or the retrieved application was not submitted by the login user.

    -   `PUT` or `PATCH` Update the status of the application with the `id` matching the path parameter `application_id` from '**pending**'/'**accepted**' to '**withdrawn**'.

        -   **Example Response**

            ```json
            {
            	"id": 3,
            	"seeker": 6,
            	"petpost": 2,
            	"status": "withdrawn",
            	"last_updated": "2023-11-15T10:04:40.922500-05:00",
            	"created_at": "2023-11-10T16:11:03.244508-05:00"
            }
            ```

        -   **Additional Notes**

            1. Authentication and permission are required, details are the same as the `GET` request.

            2. **400 BAD_REQUEST** response received when the original status of the application is not '**pending**' or '**accepted**'.

            3. Succeed request triggers the creation of two notifications—one for the seeker and one for the shelter.

-   `/applications/shelter/<application_id>`

    -   `GET` Retrieve the application whose `id` is passed in as path parameter `application_id`, which was received by the login user with role shelter

        -   **Example Response**

            ```json
            {
            	"id": 8,
            	"created_at": "2023-11-13T18:28:23.233855-05:00",
            	"last_updated": "2023-11-14T18:23:50.826386-05:00",
            	"seeker": 6,
            	"petpost": 5,
            	"status": "denied",
            	"adopter_firstname": "Chan",
            	"adopter_lastname": "Yu",
            	"adopter_email": "chan@email.com",
            	"co_adopter_firstname": null,
            	"co_adopter_lastname": null,
            	"co_adopter_email": null,
            	"addr_street": "1 Main St.",
            	"addr_city": "Toronto",
            	"addr_province": "ON",
            	"addr_postal": "M1K 1A1",
            	"phone": "+12125552368",
            	"phone_type": "cell",
            	"have_pet_currently": true,
            	"have_pet_notes": "",
            	"family_members": "myself 3000 years old"
            }
            ```

        -   **Additional Notes**

            1. **401 UNAUTHORIZED** response received when an unauthenticated user accesses.

            2. **403 FORBIDDEN** response is returned for a logged-in user whose `role` field is not set to `'shelter'`, or if the retrieved application does not correspond to a pet owned by the logged-in shelter.

    -   `PUT` or `PATCH` Update the status of the application with the `id` matching the path parameter `application_id` from '**pending**' to '**accepted**'/'**denied**'.

        -   **Example Request Body**

            ```json
            {
            	"status": "accepted"
            }
            ```

        -   **Example Response**

            ```json
            {
            	"id": 8,
            	"seeker": 6,
            	"petpost": 5,
            	"status": "accepted",
            	"last_updated": "2023-11-15T10:23:38.377243-05:00",
            	"created_at": "2023-11-13T18:28:23.233855-05:00"
            }
            ```

        -   **Additional Notes**

            1. Authentication and permission are required, details are the same as the `GET` request.

            2. **400 BAD_REQUEST** response received when the original status of the application is not '**pending**', or the new status is not '**accepted**'/'**denied**'.

            3. Succeed request triggers the creation of two notifications—one for the seeker and one for the shelter.

-   `/applications/pet/<pet_id>/`

    -   `POST` Create a new adoption application for the logged-in seeker with the pet status set to '**available**'.

        -   **Example Request Body**

            ```json
            {
            	"adopter_firstname": "Chan",
            	"adopter_lastname": "Yu",
            	"adopter_email": "chan@email.com",
            	"addr_street": "1 Main St.",
            	"addr_city": "Toronto",
            	"addr_province": "ON",
            	"addr_postal": "M1K 1A1",
            	"phone": "+12125552368",
            	"phone_type": "cell",
            	"have_pet_currently": true,
            	"family_members": "myself 3000 years old",
            	"co_adopter_lastname": "OPTIONAL"
            }
            ```

        -   **Example Response**

            ```json
            {
            	"id": 18,
            	"created_at": "2023-11-15T10:34:40.608857-05:00",
            	"last_updated": "2023-11-15T10:34:40.608925-05:00",
            	"seeker": 6,
            	"petpost": 5,
            	"status": "pending",
            	"adopter_firstname": "Chan",
            	"adopter_lastname": "Yu",
            	"adopter_email": "chan@email.com",
            	"co_adopter_firstname": null,
            	"co_adopter_lastname": "OPTIONAL",
            	"co_adopter_email": null,
            	"addr_street": "1 Main St.",
            	"addr_city": "Toronto",
            	"addr_province": "ON",
            	"addr_postal": "M1K 1A1",
            	"phone": "+12125552368",
            	"phone_type": "cell",
            	"have_pet_currently": true,
            	"have_pet_notes": null,
            	"family_members": "myself 3000 years old"
            }
            ```

        -   **Additional Notes**

            1. **401 UNAUTHORIZED** response received when an unauthenticated user accesses.

            2. **403 FORBIDDEN** response received for logged-in users whose `role` field is not set to `'seeker'` (shelter cannot submit application).

            3. **400 BAD_REQUEST** response received when the pet status is not `'available'`, or when the logged-in seeker has an existing application in '**pending**' or '**accepted**' status.

            4. A successful request triggers the creation of two notifications—one for the seeker to confirm the submitted application and another for the shelter indicating a new application received.

-   `/applications/<application_id>/conversations/`

    -   `GET` Retrieve the list of conversations between the seeker and shelter for the submitted application with the `id` matching the path parameter `application_id`.

        -   **Example Response**

            ```json
            {
            	"count": 9,
            	"next": "http://localhost:8080/applications/8/conversations/?page=2&page_size=3",
            	"previous": null,
            	"results": [
            		{
            			"id": 21,
            			"created_at": "2023-11-14T17:34:52.403900-05:00",
            			"created_by": 6,
            			"application": 8,
            			"content": "no worries"
            		},
            		{
            			"id": 20,
            			"created_at": "2023-11-14T17:30:12.826089-05:00",
            			"created_by": 9,
            			"application": 8,
            			"content": "Thanks for your reply"
            		},
            		{
            			"id": 19,
            			"created_at": "2023-11-14T17:27:09.847350-05:00",
            			"created_by": 9,
            			"application": 8,
            			"content": "That's reasonable"
            		}
            	]
            }
            ```

        -   **Additional Notes**

            1. Support pagination by passing parameters `page_size` (number of results to return per page, default value is set to 10) and `page` (a page number within the paginated result set).

                > Eg. /applications/8/conversations/?page_size=3&page=1

            2. The list of conversation is sorted by creation time in descending order.

            3. **401 UNAUTHORIZED** response received when an unauthenticated user accesses.

            4. **403 FORBIDDEN** response received when the logged-in user is neither the seeker who submitted the application nor the shelter who received the application.

    -   `POST` Create a conversation from the logged-in user for the submitted application with the `id` matching the path parameter `application_id`.

        -   **Example Request Body**

            ```json
            {
            	"content": "Good day! Any update on this application would be appreciated!"
            }
            ```

        -   **Example Response**

            ```json
            {
            	"id": 26,
            	"created_at": "2023-11-15T11:26:47.773185-05:00",
            	"created_by": 6,
            	"application": 4,
            	"content": "Good day! Any update on this application would be appreciated!"
            }
            ```

        -   **Additional Notes**

            1. Authentication and permission are required, details are the same as the `GET` request.

            2. The last update time for the corresponding application is set to the time of conversation creation.

            3. Triggers the creation of a notifications. If the logged-in user is the seeker of this application, the notification recipient would be the shelter; if the logged-in user is the shelter, the notification recipient would be the seeker.

## Notifications Endpoints

-   `/notifications`

    -   `GET` Retrieve

        -   **Example Response**

            ```json

            ```

        -   **Additional Notes**

            1.

            2.

-   `/notifications/<notification_id>`

    -   `GET`

        -   **Example Response**

            ```json

            ```

        -   **Additional Notes**

            1.

            2.

    -   `PUT` or `PATCH`

        -   **Example Request Body**

            ```json

            ```

        -   **Example Response**

            ```json

            ```

        -   **Additional Notes**

            1.

            2.

            3.

    -   `DELETE`

        -   **Example Response**

            ```json

            ```

        -   **Additional Notes**

            1.

            2.
