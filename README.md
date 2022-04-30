# Covid Compliance Tracker

## Summary 

Have you planned a trip during the pandemic and wondered, "Are people in [some city] taking this pandemic seriously?" Look no further than this web app.

This project was designed and engineered by Elad Ohana, Peter Jackson, and Andrew Buchanan. The Covid Compliance Tracker enables easy logging, fetching, and crowdsourcing of Covid-19 social compliance behavior. CCT aims to allow easy reporting and exploration of data surrounding mask usage, vaccination status, social distancing, etc. Beta release 0.0.1 is just the scaffolding of this project. While front-end GUI is one key pillar of this project-–so everyday travelers can use this platform––we also aim to support COVID research by providing an easy-to-access API to fetch the raw data. 


### Team Vega Workflow Instructions

For contributing to this project, please fork the repository and issue a pull requests. Vega project administrators will review all pull requests. Visit docs/adminworkflow.md to see workflow for those with administrative access. 

### Issues:
Please open an issue to track bugs and bug fixes. 

## API Endpoints

### / GET (endpoint for the main page)
#### Request cURL

```
$ curl http://localhost:5000/
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
        
  <table>
    <tr>
      <th>Date</th>
      <th>ZIP</th>
      <th>Overall Score</th>
      <th>Mask Score</th>
      <th>Supplies Score</th>
      <th>Distancing Score</th>
    </tr>
    [Repeat <tr> for raw all]
  </table>
    </body>
</html>
```

#### Response headers

```
HTTP/1.1 200 OK
X-Powered-By: Express
Date: Sat, 30 Apr 2022 01:30:35 GMT
Connection: keep-alive
Keep-Alive: timeout=5
Content-Length: 4524
```

### /session GET (main page for established users)
See /docs/session for detailed documentation of how CCT validates users using express sesssions and cookies, and how to make API calls. 

#### Request cURL

```
curl http://localhost:5000/session
```

#### Response body

```
"Found. Redirecting to /login"
```

#### Response headers

```
 HTTP/1.1 302 Found
 X-Powered-By: Express
 Location: /login
 Vary: Accept
 Content-Type: text/plain; charset=utf-8
 Content-Length: 28
 Date: Sat, 30 Apr 2022 01:33:50 GMT
 Connection: keep-alive
 Keep-Alive: timeout=5
 
```

### /submitdata POST
See /docs/sessions for usage of this API. This endpoint is only available for valid sessions (logged-in users).

### /data GET (not yet implemented)
This API endpoing will allow people to fetch the COVID data as a json object. 


