<h2>Project</h2>

  An API created for saving user tasks. For API testing used Postman. This API can be user for WEB application creation with React, Vue or any front-end framework.
  App built with:<br>
 &#10687; Mongo DB;<br>
 &#10687; Moongoose;<br> 
 &#10687; Node.js (Express library);<br> 
 &#10687; JSONWebToken;<br>
 &#10687; Bcrypt;<br>
 &#10687; Sendgrid.

  
<h2>Installation and Setup Instructions</h2>

Clone down this repository. You will need node and npm installed globally on your machine.

To run this app:
  node ./src/index.js
When API starts running in terminal/command promt you will see a message: <b> Server is up on port: PORT_NUMBER </b> 


<h2>Routes:</h2>
<b>To GET, DELETE, UPDATE, POST a task, avatar you have to be logged in. </b>
&#10687; /tasks - HTTP POST - Tasks -> Create a task<br>
&#10687; /tasks/:id - HTTP GET - Tasks -> Get specific task by ID<br>
&#10687; /tasks/:id - HTTP DELETE - Tasks -> Delete a specific task by ID<br>
&#10687; /tasks/:id - HTTP UPDATE - Task (By ID) -> Update a specific task <br>
<br>
&#10687; /users/me/avatar - HTTP POST - Avatar -> Upload an avatar<br>
&#10687; /users/me/avatar - HTTP DELETE - Avatar -> Delete user accounts avatar<br>
&#10687; /users/:id/avatar - HTTP GET - Avatar -> Get user avatar<br>
<br>
For User authentication JSONWebtoken was used;<br>
&#10687; /users/myaccount - HTTP GET - Account -> Get user account information<br>
&#10687; /users - HTTP POST - Users -> Create a new user<br>
&#10687; /users/myaccount - HTTP PATCH - User (By ID) -> Update user account information<br>
&#10687; /users/myaccount - HTTP DELETE - User (By ID) -> Delete user account<br>
&#10687; /users/login - HTTP POST - User -> Login route<br>
&#10687; /users/logout - HTTP POST - User -> Logout route<br>
&#10687; /users/logoutAll -HTTP POST - User -> Logout all users<br>
