# Capstone_Udacity

Cpstone is a travel planner app which gives the image of a location and weather on a particular date when user inputs his/her travel location and date of travel.

By entering the travel location, start and return date of journey capstone will give you the following information
* Country of the Location
* Mininum and Maximum temperature at the date of travel
* Description of the weather
* image of the travel location, if location image is not available, returns the image of that country
* Trip Duration
* No. of days for the start of the trip

## Quick Start
Clone the repository and run the 'npm install'

### Run on prod environment
```npm run build-prod
npm run start
```
Application will run on **port 8000**

### Run on Dev server
```npm run build-dev
npm run start
```

Dev server will run on **port 8080**
Express server will run on **port 8000**

### Test cases
Test cases can be run by using the command
```
npm run test
```


## Restrictions
The application takes only the date of journey 16 days from the current date(Since the weather information from weatherbit api is available maximum for 16 days)

## Additional functionalities added other than minimum requirements
* Add end date and display length of trip.
* Pull in an image for the country from Pixabay API when the entered location brings up no results (good for obscure localities).


## Environment variables
.env sample file is added to know the structure of the .env file. Placeholders are given in <>.
Please fill your api keys and username in the placeholder and run the application