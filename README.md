# FE-NC-NEWS

NC News is a News, Content Rating, and Forum Social Network website built with React.

NC News is hosted here on Netlify: https://joseph-nc-news.netlify.app/

## Northcoders News API

NC News interacts with a Backend API hosted on Supabase and Render.
Link to the location where the API is hosted below (/api endpoint provides a list of endpoints for users to interact with):

https://be-nc-news-q4om.onrender.com/api

Link to my Github project for the Backend API is below:
https://github.com/Joseph-Lee98/BE-NC-NEWS

## About

Inspired by Reddit, the app allows users to:

- Register for an account.
- Log into an account.
- Log out of an account.
- Delete their account.
- View articles (including filtering by topic, with sorting and ordering options).
- Post an article.
- Vote on articles.
- Delete their article.
- View comments of an article.
- Post a comment to an article.
- Vote on comments.
- Delete their comments.

*User page functionality, and Admin dashboard functionality, are still in development*

### Registering and logging in

Upon initially accessing the app, you will be using the app as a guest (not logged in). You will be able to access all pages accessable to authorised users, but with limited access to only being able to view articles, filter and sort the articles, and view comments for an article.

To gain full access to the App's rich functionality, you will need to be logged in as a user. 

You can register for an account, or alternatively, below are some demo user accounts that can be used to log into the application:

| Username       | Password          | Role |
|----------------|-------------------|------|
| tickle122      | Tickle@2024#       | user |
| grumpy19       | Grumpy19@#2024     | user |
| happyamy2016   | H@ppyAmy2024!      | user |
| cooljmessy     | C00l_Jm3ssy#23     | user |
| weegembump     | W33gemBump@2024    | user |
| jessjelly      | J3ss_J3lly#21      | user |

Feel free to use any of these accounts to explore the full features of the application.

### Admin Access

This application has an admin account that offers the highest level of access, including the ability to delete any article or comment (admin account will also be able to view app metrics, view all users, and delete/suspend user accounts in the future). For security reasons, the admin account credentials are not publicly available.

If you would like to experiment with the admin features, please feel free to contact me directly. We can arrange secure access to the admin account for testing purposes.

### JWT handling and Local Storage

Upon successful login or registration, the backend provides a JWT (JSON Web Token) and a user object with non-sensitive details. The JWT and user details are stored in local storage, with the user details in local storage used to manage the user's session and personalize the app experience, whilst the JWT is stored for use in future requests requiring authorisation.

For any request to an endpoint requiring authorization, the stored JWT is automatically included in the request headers. The JWT has an expiration time of 1 hour, after which any request to a protected endpoint will result in the user being logged out and the JWT and user details being cleared from local storage. At that point, the user will be redirected to the login page.

This process ensures secure, time-limited access to protected resources.

## How to run NC News locally

### Requirements

Ensure you have Node.js software installed (Minimum version required is v21.7.1)

### Installation

In your terminal, clone the NC News repository by executing:

git clone https://github.com/joseph-lee98/FE-NC-NEWS.git

Next, enter the repository directory.

To download all the necessary dependencies, run the command:

npm install

### Running NC News

Navigate to the repository directory in your terminal.

Execute the following command:

npm run dev

This should start a local server where you can visit the application via your web browser. The URL will be provided in the output from the above command.

# Northcoders Ownership Declaration

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by Northcoders
