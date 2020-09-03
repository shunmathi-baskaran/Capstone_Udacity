export { getValues,setMinAndMaxDate }
function getValues()
{
    event.preventDefault();
    let location=document.getElementById('location').value;
    let travelDate=document.getElementById('travelDate').value;
    postData('http://localhost:8000/saveData',{location,travelDate}).then(function(response){
        displayData(response)
    });
    console.log(location +' '+ travelDate);
}

/* Function to POST data */
const postData=async (url='',data={})=>{
    const response= await fetch(url,{
        method:'POST',
        credentials:'same-origin',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });
    try{
        const newData= await response.json();
        console.log(newData);
        return newData;
    }catch(error){
        console.log('error',error);
    }
}

function displayData(data){
    document.getElementById('image').setAttribute('src',data.imageURL);
    document.getElementById('loc').textContent=data.location;
    document.getElementById('weather').textContent=`The weather condition by then will be ${data.description}`;
    document.getElementById('temp').textContent=`Max Temperature ${data.maxTemp} & Min Temperature ${data.minTemp}`;
    document.getElementById('days').textContent=`${Math.round(data.daysToTravel)} days to go`;
}

//Setting min and max date to input date field as weather forecast is available only for 16 days
function setMinAndMaxDate() {
    let currentDate=new Date();
    let minDate=currentDate.getFullYear()+'-'+appendLeadingZeroes((currentDate.getMonth()+1))+'-'+appendLeadingZeroes(currentDate.getDate());
    let maxDate=new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+15);
    maxDate=maxDate.getFullYear()+'-'+appendLeadingZeroes((maxDate.getMonth()+1))+'-'+appendLeadingZeroes(maxDate.getDate());
    document.getElementById('travelDate').setAttribute('min',minDate);
    document.getElementById('travelDate').setAttribute('max',maxDate);
}


//append zero to date and month if it is less than 10
function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
  }