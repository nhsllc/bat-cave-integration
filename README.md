# bat-cave-integration

This project is for basic api testing. Follow the steps below to start.

> Use any programming language you are comfortable with. Just keep in mind the length of time project setup takes.

# bat-cave-api

The bat-cave api handles requests. [Bat Cave API V1](https://batcavepublic.blob.core.windows.net/$web/index.html)

>  Follow the steps under the `Token Authentication` section to get your access token to make any requests to other endpoints.

# environment variables

Environment variables will be provided by an administrator to you before testing starts.

Variable | Description
---------- | -----------
`clientId` | This is your client id to generate your authentication token.
`clientSecret` | This is your client secret used to generate your authentication token.
`Subscription` | This is a key that is required to make any requests to the bat-cave api endpoints besides `auth`.
`apiUrl` | This is the url to the bat-cave api.
`requestor` | This is your unique app identifier for your client.

# setup

* Clone down the repository.
* Create a new branch and name it your GitHub username.
* Create an environment file and add it to `.gitignore` so environment variables are not pushed to GitHub.
* Add your environemnt variables to this environment file.
* Complete the tests below.
* Once finished, make your commits, and push to your branch.

# tests

Complete the following tests in order of apprearance. Use the value in `ID` as the `test_case` header. 

> Your last request made for each test will be assessed.

ID | Acceptace
-- | ---------
`connect` | Get all contacts and post them back to the `contacts` endpoint.
`heist` | Get all alive villains, update their location to the bank, and post the results to the `contacts` endpoint.
`powers` | For Superman, add a property called `powers` as a string array, and add `Laser Eyes` and `X-Ray Vision` to it. For Scarecrow, add a property called `powers` as a string array, add `Toxic Immunity` to it, add another property called `abilities`, add `Pedagogy` to it, and post the results to the `contacts` endpoint.
`birthdays` | For all contacts that have an age not `Unknown`, calculate their birth year into a new property called `birthYear` as a date string in the format `MM-dd-yyyy`, and post the oldest result to the `contacts` endpoint.
`sorting` | For all contacts, sort them by `title` and post the results back to the `contacts` endpoint.
