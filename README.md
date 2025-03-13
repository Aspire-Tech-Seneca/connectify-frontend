Connectify Frontend


This README provides detailed instructions for setting up the Connectify frontend repository. It is intended for developers who wish to run or test the application locally for development purposes.


Repository Information


Repository URL: https://github.com/Aspire-Tech-Seneca/connectify-frontend.git


Branch: The development work is maintained on the dev branch

Prerequisites:


Before beginning the setup, ensure that you have the following installed on your system:


Node.js (LTS version recommended)



NPM (Node Package Manager)


You can download Node.js (which includes npm) from https://nodejs.org/.


Setup Instructions


Clone the Repository


Open a terminal and execute the following command to clone the repository:


git clone https://github.com/Aspire-Tech-Seneca/connectify-frontend.git


Navigate to the Repository Directory


After cloning, change into the project directory:


cd connectify-frontend


Install Dependencies

Run the following command to install all required Node.js packages:



npm install


Install Additional Material UI Icons


In addition to the primary dependencies, install the Material UI icons package:


npm install @mui/icons-material


React Dependencies


The project utilizes the following dependencies with specified versions:


@emotion/react==11.14.0


@emotion/styled==11.14.0


@mui/material==6.4.3


axios==1.7.9


cra-template==1.2.0


react==19.0.0


react-dom==19.0.0


react-router-dom==7.1.5


react-scripts==5.0.1


sass==1.84.0


web-vitals==4.2.4



Running the Application:


To start the application in development mode, run:


npm start


Upon successful execution of this command, a browser window will automatically open at http://localhost:3000. This URL displays the homepage of the application, which serves as the entry point before a user logs in to the interest matchmaking web app, Connectify.


Navigation and Routing:


The application uses React Router for client-side navigation. Below is an outline of the available routes and the corresponding components:


Homepage (Welcome):


URL: /

Component: Login:


URL: /login


Component: Home (Post-login)


URL: /Home


Component: Notifications


URL: /notifications


Component: About Us 

URL: /about

Component: Profile


URL: /profile

Component: Signup


URL: /signup

Component Matches

URL: /matches

Component: Chat

URL: /ChatPage

Component: User Settings


URL: /UserSettings


Component: View Events 


URL: /ViewEvents

Component: Create Event


URL: /createevent

Component: Policy Compliance


URL: /PolicyCompliance
