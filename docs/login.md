# API endpoints for user authentication 

## /login GET
This request loads the login landing page consisting of a sign-in form. 
#### Request cURL
```
$ curl -v http://localhost:5000/login
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
        <placeholder id="message"></placeholder>

<div id="form">

    <form action="/login" method="post">
        <label for="username">Username</label>
        <input id = "username" type="text" name="username"><br/>
        <label for="password">Password</label>
        <input id = "password" type="password" name="password"><br/>
        <input type="submit" value="Log In">
    </form>
</div>

<p> Not a member? <a href="/signup">Sign up!</a>
        <div id="map" class="active">
            Insert Map
        </div>
    </body>
```
#### Response headers
```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 16:23:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 913
```
## /login POST

#### Request cURL
```
curl -X POST -H 'Content-Type: application/json' -d '{"username":"[username]", "password": "[password]"}' http://localhost:5000/login
```
#### Valid response body
```
Found. Redirecting to /session
```
#### Invalid response body
```
Found. Redirecting to /login/error
```

#### Valid credentials response headers
 ```
 HTTP/1.1 302 Found
X-Powered-By: Express
Location: /session
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 30
Set-Cookie: connect.sid=s%3AP4EfJWto_p5DJWP2RawLhLsvhnzb5dEe.%2BSh4VZBaQG5YhNq8OP7QSkNzzbfIU5GiOQlct7wJuyg; Path=/; HttpOnly
Date: Sat, 30 Apr 2022 16:42:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 ```

 #### Invalid credentials headers
 ```
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /login/error
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 34
Set-Cookie: connect.sid=s%3AE0r2jVNLHdnHnJaX196rPwcI_3P_DejS.giRNFEQP1oFAOZLCEFBbKWZKnuOVkSwW2vVt4vtCrEA; Path=/; HttpOnly
Date: Sat, 30 Apr 2022 16:43:53 GMT
Connection: keep-alive
Keep-Alive: timeout=5
 ```

## login/error GET
This loads the HTML page for an invalid login attempt.
#### Request cURL
```
curl -v http://localhost:5000/login/error
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
        <placeholder id="message"></placeholder>

<div id="form">

    <form action="/login" method="post">
        <label for="username">Username</label>
        <input id = "username" type="text" name="username"><br/>
        <label for="password">Password</label>
        <input id = "password" type="password" name="password"><br/>
        <input type="submit" value="Log In">
    </form>
</div>

<p> Not a member? <a href="/signup">Sign up!</a>
        <div id="map" class="active">
            Insert Map
        </div>
    </body>
```
 
#### Response headers
```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 16:45:47 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 913
```

## /signup GET
Fetches the signup page
#### Request cURL

```
curl -v http://localhost:5000/signup
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
        <div id="form">
    <form action="/signup" method="post">
        <label for="email">Email</label>
        <input id = "email" type="email" name="email"><br> 
        <label for="username">Username</label>
        <input id = "username" type="text" name="username"><br/>
        <label for="password">Password</label>
        <input id = "password" type="password" name="password"><br/>
        <input type="submit" value="Sign up">
    </form>
</body>
```
#### Response headers
```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 16:48:14 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 912
```

## /signup POST
Allows a user to sign up. Note: This API has room for improvement. Email format verification currently happens at the client side running the email form text through a regex filter. Clients can sign-up with invalid emails at the cURL level. We also intend to check for duplicate usernames in later versions. 

#### Request cURL
```
curl -v -X POST -H 'Content-Type: application/json' -d '{"email": "[email]","username":"[username]", "password":"[password]"}' http://localhost:5000/signup
```
#### Response body
```
HTTP/1.1 302 Found
X-Powered-By: Express
Location: /login
Vary: Accept
Content-Type: text/plain; charset=utf-8
Content-Length: 28
Date: Sat, 30 Apr 2022 16:58:56 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```