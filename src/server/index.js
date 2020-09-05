// Require Express to run server and routes
const express=require('express');
const bodyParser=require('body-parser');
const cors=require('cors');
const dotenv = require('dotenv');
dotenv.config();
const fetch=require('node-fetch');


// Start up an instance of app
const app=express();


/* Dependencies */
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Cors for cross origin allowance
app.use(cors());


// Initialize the main project folder
app.use(express.static('dist'));

const port=8000;
app.listen(port,listening);

function listening(){
    console.log(`Application is listening at port ${port}`);
}

/* API KEYS */
const WEATHERBIT_API_KEY=process.env.WEATHERBIT_API_KEY;
const GEONAMES_USER_NAME=process.env.GEONAMES_USER_NAME;
const PIXABAY_API_KEY=process.env.PIXABAY_API_KEY;
const weatherBitForecastBaseURL='http://api.weatherbit.io/v2.0/forecast/daily?key=';
const geoNamesBaseURL='http://api.geonames.org/search?type=json&maxRows=1&q=';
const pixaBayBaseURL='https://pixabay.com/api/?image_type=photo&category=places&key=';


//save user input
let userInput={};
let userOutput={
    minTemp:'',maxTemp:'',description:'',imageURL:'',daysToTravel:'',
    location:'',travelStartDate:'',travelEndDate:'',tripDuration:'',country:''
};
app.post('/saveData',savePostedData);

//callback function to postmethod
function savePostedData(req,res){
    userInput=req.body;
    getLatAndLonFromGeoNames(geoNamesBaseURL,encodeURIComponent(userInput.location),GEONAMES_USER_NAME)
    .then(function(responseData){
        if(responseData.totalResultsCount==0){
            res.send('Please enter valid location');
        }
        else{
        userOutput.country=responseData.geonames[0].countryName;
        getWeatherDataFromWeatherBit(weatherBitForecastBaseURL,WEATHERBIT_API_KEY,responseData.geonames[0].lat,responseData.geonames[0].lng,difBtDates(new Date(),createDateObjectFromDate(userInput.travelStartDate)))
        .then(function(){
            getImageURLFromPixabay(pixaBayBaseURL,PIXABAY_API_KEY,encodeURIComponent(userInput.location))
            .then(function(response){
                getCountryImage(response).then((response)=>{
                    res.send(setUserOutput(response.hits[0].webformatURL));
            })
        })
    });
}
}).catch(error=> {
        res.send(error);
    });
}

/*Main functions*/

// Function to get Weather data from weatherbit api
const getWeatherDataFromWeatherBit= async (url,key,lat,lon,days)=>{
    const response=await fetch(`${url}${key}&lat=${lat}&lon=${lon}&days=${days}`);
    try{
        const responseData=await response.json();
        let reqData=responseData.data[responseData.data.length-1];
        userOutput.minTemp=reqData.min_temp;
        userOutput.maxTemp=reqData.max_temp;
        userOutput.description=reqData.weather.description;
        return reqData;
    }catch(error){
        console.log('error',error);
    }
}


//function to get lat, long from geonames api
const getLatAndLonFromGeoNames= async (url,location,username)=>{
    const response=await fetch(`${url}${location}&username=${username}`);
    try{
        const responseData=await response.json();
        return responseData;
    }catch(error){
        console.log('error',error);
    }
}


//function to get location image from pixabay api
const getImageURLFromPixabay= async (url,key,location)=>{
    const response=await fetch(`${url}${key}&q=${location}`);
    try{
        const responseData=await response.json();
        return responseData;
    }catch(error){
        console.log('error',error);
    }
}


//function to get country image from pixabay api when location pic is not available
const getCountryImage=async(response)=>{
    if(response.totalHits==0){
       return getImageURLFromPixabay(pixaBayBaseURL,PIXABAY_API_KEY,encodeURIComponent(userOutput.country));
    }
    else
        return response;
}


//function to return user response
function setUserOutput(imageURL){
    userOutput.daysToTravel=difBtDates(new Date(),createDateObjectFromDate(userInput.travelStartDate));
    userOutput.imageURL=imageURL;
    userOutput.location=userInput.location;
    userOutput.travelStartDate=userInput.travelStartDate;
    userOutput.travelEndDate=userInput.travelEndDate;
    userOutput.tripDuration=difBtDates(createDateObjectFromDate(userOutput.travelStartDate),createDateObjectFromDate(userOutput.travelEndDate));
    return userOutput;
}


/*Helper functions*/

//returns date object from date string
function createDateObjectFromDate(date){
    let splitDate=date.split('-');
    return new Date(splitDate[0],splitDate[1]-1,splitDate[2]);
}


//returns difference between two date objects
function difBtDates( date1, date2 ) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;
  
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
  
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    // Convert back to days and return
    return (difference_ms/one_day)+1;
}

module.exports.getLatAndLonFromGeoNames = getLatAndLonFromGeoNames;
module.exports.getImageURLFromPixabay = getImageURLFromPixabay;