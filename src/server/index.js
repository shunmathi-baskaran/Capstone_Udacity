// Require Express to run server and routes
const express=require('express');
const bodyParser=require('body-parser');
const { urlencoded } = require('body-parser');
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
app.use(express.static('website'));

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
const weatherBitCurrentBaseURL='http://api.weatherbit.io/v2.0/current?key=';
const geoNamesBaseURL='http://api.geonames.org/search?type=json&maxRows=1&q=';
const pixaBayBaseURL='https://pixabay.com/api/?image_type=photo&key=';


//save user input
let userInput={};
let userOutput={
    minTemp:'',maxTemp:'',description:'',imageURL:'',daysToTravel:'',location:'',travelDate:''
};
app.post('/saveData',savePostedData);

function savePostedData(req,res){
    userInput=req.body;
    console.log(userInput);
    getLatAndLonFromGeoNames(geoNamesBaseURL,encodeURIComponent(userInput.location),GEONAMES_USER_NAME)
    .then(function(responseData){
       // if(calculateDateOfTravel()>7)
        getWeatherDataFromWeatherBit(weatherBitForecastBaseURL,WEATHERBIT_API_KEY,responseData.geonames[0].lat,responseData.geonames[0].lng,calculateDateOfTravel())
        .then(function(){
            getImageURLFromPixabay(pixaBayBaseURL,PIXABAY_API_KEY,encodeURIComponent(userInput.location))
            .then(function(response){
                console.log(response);
                res.send(setUserOutput(response));
            })
        })
        //else
        //getWeatherDataFromWeatherBit(weatherBitCurrentBaseURL,WEATHERBIT_API_KEY,responseData.geonames[0].lat,responseData.geonames[0].lng)
    });
}

/* Function to GET Web API Data*/
const getWeatherDataFromWeatherBit= async (url,key,lat,lon,days)=>{
    console.log(' 2 function called');
    const response=await fetch(`${url}${key}&lat=${lat}&lon=${lon}&days=${days}`);
    try{
        const responseData=await response.json();
        let reqData=responseData.data[responseData.data.length-1];
        userOutput.minTemp=reqData.min_temp;
        userOutput.maxTemp=reqData.max_temp;
        userOutput.description=reqData.weather.description;
        console.log(reqData);
        return reqData;
    }catch(error){
        console.log('error',error);
    }
}


const getLatAndLonFromGeoNames= async (url,location,username)=>{
    console.log('function called');
    const response=await fetch(`${url}${location}&username=${username}`);
    try{
        const responseData=await response.json();
        return responseData;
    }catch(error){
        console.log('error',error);
    }
}


const getImageURLFromPixabay= async (url,key,location)=>{
    console.log('3 function called');
    const response=await fetch(`${url}${key}&q=${location}`);
    try{
        const responseData=await response.json();
        console.log(responseData.hits[0].webformatURL);
        userOutput.imageURL=responseData.hits[0].webformatURL;
        return responseData.hits[0].webformatURL;
    }catch(error){
        console.log('error',error);
    }
}


function setUserOutput(imageURL){
    userOutput.daysToTravel=calculateDateOfTravel();
    userOutput.imageURL=imageURL;
    userOutput.location=userInput.location;
    userOutput.travelDate=userInput.travelDate;
    console.log(userOutput);
    return userOutput;
}

function calculateDateOfTravel(){
    let currentDate=new Date();
    let splitDate=userInput.travelDate.split('-');
    let travelDate=new Date(splitDate[0],splitDate[1]-1,splitDate[2]);
    let noOfDaysToTravel=difBtDates(currentDate,travelDate);
    return noOfDaysToTravel;
}


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




