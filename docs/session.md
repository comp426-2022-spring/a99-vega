### /session GET (main page for established users)
CCT uses express sessions to validate login credentials. Users are redirected to the login page if they simply try to access the /session endpoint. 

#### Request cURL
To access the sessions page, go through the /login page, follow re-directs, and keep the cookies stored.  
```
curl --cookie nada -vL -H 'Content-Type: application/json' -d '{"username":"a", "password": "a"}' http://localhost:5000/login 
```

#### Response body

```
<!DOCTYPE html>
<html>
    <head>
        <link rel= "stylesheet" href="/styles.css"></style>
    </head>

    <body>
        <nav><a href="/">Home</a> <a href="/login">Log In</a> <a href="/signup">Sign Up</a></nav>
        <h1>COVID Compliance Tracker</h1>
        <p><i>Log in to access the submissions page and edit profile page</i></p>
                <p><a href="/logout">Log out</a></p>

        <h1>Directory</h1>

        <form action="/submitdata" method="POST">
                <input type="text" value="3" name="userid" id="userid" readonly hidden>
                <input type="submit" value="Create Submission">
        </form>
        <br>
        <form action="/profile" method="POST">
                <input type="text" value="3" name="userid" id="userid" readonly hidden>
                <input type="submit" value="Edit Profile">
        </form>
    </body>
</html>
```

#### Response headers

```
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /session
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 30
* Added cookie connect.sid="s%3AICisFEJxypOYsXh8aKfu_YJWbUGv1RnE.gj6VmjIMz%2BobKNarS5gcNlTkN%2FD6j3Csb4wqQBhJQXc" for domain localhost, path /, expire 0
Set-Cookie: connect.sid=s%3AICisFEJxypOYsXh8aKfu_YJWbUGv1RnE.gj6VmjIMz%2BobKNarS5gcNlTkN%2FD6j3Csb4wqQBhJQXc; Path=/; HttpOnly
Date: Sat, 30 Apr 2022 21:17:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5

HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 21:17:55 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 996
```

### /submitdata POST
This endpoint displays a form where users can fill out compliance data. 

#### Request cURL
```
curl -v -X POST http://localhost:5000/submitdata
```

#### Response body
```
<!DOCTYPE html>
<html>
    <head>
        <link rel= "stylesheet" href="/styles.css"></style>
    </head>

    <body>
        <nav><a href="/">Home</a> <a href="/login">Log In</a> <a href="/signup">Sign Up</a></nav>
        <h1>COVID Compliance Tracker</h1>
        <p><i>Log in to access the submissions page and edit profile page</i></p>
        
        <p><a href="/logout">Log out</a></p>

        <h1>Submission</h1>

        <form action="/submit" method="POST">
            <input type="text" value="undefined" name="userid" readonly hidden>

            <!-- Zip Code Entry -->
            <label for="zip">Zip Code</label>
            <input id = "zip" type="text" name="zip" inputmode="numeric" minlength="5" maxlength="5" pattern="[0-9]{5}" placeholder="Enter your zip code"><br/>
            
            <!-- Date Entry -->
            <label for="date">Date</label>
            <input id = "date" type="date" name="date" placeholder="Enter the date"><br/>

            <!-- Overall Rating -->
            <label for="overall_score">How well did this area adhere to COVID protocol?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="overall_score" name="overall_score"><br>

            <!-- Mask Usage Rating -->
            <label for="mask_score">What proportion of people wore masks?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="mask_score" name="mask_score"><br>

            <!-- Health Supplies Rating -->
            <label for="supplies_score">How well did this area provide health supplies (cleansing wipes, masks, etc.)?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="supplies_score" name="supplies_score"><br>

            <!-- Social Distancing Rating -->
            <label for="distancing_score">How well did this area social distance?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="distancing_score" name="distancing_score"><br>

            <input type="submit" value="Submit data">
        </form>
    </body>
* Connection #0 to host localhost left intact
</html>* Closing connection 0
```

#### Response headers
```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 21:36:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 2237
```

### /submit POST
API for posting compliance data to the database

#### Request cURL
```
curl -v -X POST -H 'Content-Type: application/json' -d '{"userid":"[username]","zip":"[zip]","date":"[date]","overall_score":"[score]","mask_score":"[score]","supplies_score":"[score]","distancing_score":"[score]"}' http://localhost:5000/submitdata
```
#### Response body
```
<!DOCTYPE html>
<html>
    <head>
        <link rel= "stylesheet" href="/styles.css"></style>
    </head>

    <body>
        <nav><a href="/">Home</a> <a href="/login">Log In</a> <a href="/signup">Sign Up</a></nav>
        <h1>COVID Compliance Tracker</h1>
        <p><i>Log in to access the submissions page and edit profile page</i></p>
        
        <p><a href="/logout">Log out</a></p>

        <h1>Submission</h1>

        <form action="/submit" method="POST">
            <input type="text" value="undefined" name="userid" readonly hidden>

            <!-- Zip Code Entry -->
            <label for="zip">Zip Code</label>
            <input id = "zip" type="text" name="zip" inputmode="numeric" minlength="5" maxlength="5" pattern="[0-9]{5}" placeholder="Enter your zip code"><br/>
            
            <!-- Date Entry -->
            <label for="date">Date</label>
            <input id = "date" type="date" name="date" placeholder="Enter the date"><br/>

            <!-- Overall Rating -->
            <label for="overall_score">How well did this area adhere to COVID protocol?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="overall_score" name="overall_score"><br>

            <!-- Mask Usage Rating -->
            <label for="mask_score">What proportion of people wore masks?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="mask_score" name="mask_score"><br>

            <!-- Health Supplies Rating -->
            <label for="supplies_score">How well did this area provide health supplies (cleansing wipes, masks, etc.)?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="supplies_score" name="supplies_score"><br>

            <!-- Social Distancing Rating -->
            <label for="distancing_score">How well did this area social distance?</label><br>
            <input type="range" min="1" max="100" value="50" class="slider" id="distancing_score" name="distancing_score"><br>

            <input type="submit" value="Submit data">
        </form>
    </body>
* Connection #0 to host localhost left intact
</html>* Closing connection 0
```
#### Response headers
```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 21:49:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 2229
```

### /adminsubmit POST
Allows administrators to activate or deactivate other users. TODO: require cookie verification to get into this endpoint. 

#### Request cURL
```
curl -v -X POST -H 'Content-Type: application/json' -d '{"status":"[active/inactive]", "username":"[username]"}' http://localhost:5000/adminsubmit
```

curl -v -X POST -H 'Content-Type: application/json' -d '{"status":"active", "username":"a"}' http://localhost:5000/adminsubmit