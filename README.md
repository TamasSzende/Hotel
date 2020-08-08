Created an online hotel reservation website during my time at PROGmasters Co.

Methodology

We are a group of 3 developers using Agile Scrum methodology.
To complete the project we had sprints, and therefore one sprint planning session where we assigned tickets.
Tickets were managed on our Miro board, and we also had pair programming sessions to avoid merge conflicts since features of the system are highly dependent on each other.

How to run

To run the Angular frontend section, first you have to install N ode.js on your computer:
•	Linux - type the following commands in the terminal:
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install -y nodejs
•	Windows & Mac - download the installer
Then you have to move  into the fronted directory ( ..\hotel ), and install all modules listed as dependencies in package.json, using the following command:
•	npm install


If you would like to visualize the Google maps, please use your own API key. And if you got one, create a GoogleApiKey.ts file in your frontend-environments directory, and write the follow in it: 
export const googleApiKey ={
 	 apiKey: 'YourApiKey'
};

