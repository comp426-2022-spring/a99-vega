# Covid Compliance Tracker

## Summary 

Have you planned a trip during the pandemic and wondered, "Are people in [some city] taking this pandemic seriously?" Look no further than this web app.

This project was designed and engineered by Elad Ohana, Peter Jackson, and Andrew Buchanan. The Covid Compliance Tracker enables easy logging, fetching, and crowdsourcing of Covid-19 social compliance behavior. CCT aims to allow easy reporting and exploration of data surrounding mask usage, vaccination status, social distancing, etc. Early release 1.0.0 is just the scaffolding of this project. While front-end GUI is one key pillar of this project-–so everyday travelers can use this platform––we also aim to support COVID researchers by providing an easy-to-use API to fetch the raw data. 


### Team Vega Workflow Instructions

For contributing to this project, please fork the repository and issue a pull requests. Vega project administrators will review all pull requests. Visit docs/adminworkflow.md to see workflow for those with administrative access. 

### Issues:
Please open an issue to track bugs and bug fixes. 

### Running Covid Compliance Tracker
1. Clone the repository
```
git clone https://github.com/comp426-2022-spring/a99-vega
```
2. Open the project in VSCode with npm installed and run the commands
```
npm install; npm start
```

## API Endpoints

### /app GET (endpoint for the main page)
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

### /data GET
API endpoing allows people to fetch the entire COVID database as a json object. 
#### Request cURL
```
curl http://localhost:5000/data
```
#### Response body
```
[{"__pkid":1,"userid":2,"date":"27713","zip":"2022-04-26","overall_score":50,"mask_score":50,"supplies_score":50,"distancing_score":50}]
```
#### Response headers
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 2467
ETag: W/"9a3-Va1cM74BM0lJ2nFuAaJ/doMoxKI"
Date: Sun, 01 May 2022 14:48:24 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
