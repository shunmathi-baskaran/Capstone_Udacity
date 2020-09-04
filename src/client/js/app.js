export { getValues,setMinAndMaxDate,postData, createDateObjectFromDate}


/*Main Functions*/

//function call to post data to server and get the trip details response
function getValues() {
    event.preventDefault();
    document.querySelector('.tripOutput').setAttribute('style','display:flex;');
    document.getElementById('image').src="https://flevix.com/wp-content/uploads/2020/01/Preloader.gif";
    let location=document.getElementById('location').value;
    let travelStartDate=document.getElementById('travelStartDate').value;
    let travelEndDate=document.getElementById('travelEndDate').value;
    if(difBtDates(createDateObjectFromDate(travelStartDate),createDateObjectFromDate(travelEndDate))>=0){
            postData('http://localhost:8000/saveData',{location,travelStartDate,travelEndDate}).then(function(response){
                displayData(response)
            });
    }
    else {
        mbar.add('Return date cannot be less than start Date');
        document.getElementById('image').src='';
        document.querySelector('.tripOutput').setAttribute('style','display:none;');
    }
    console.log(location +' '+ travelStartDate+' '+travelEndDate);
}


/* Function to POST data */
const postData=async (url='',data={})=> {
    const response= await fetch(url,{
        method:'POST',
        credentials:'same-origin',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
    });
    try {
        const newData= await response.json();
        console.log(newData);
        return newData;
    } catch(error) {
        console.log('error',error);
        mbar.add('Please enter valid location');
        document.getElementById('image').src='';
        document.querySelector('.tripOutput').setAttribute('style','display:none;');
    }
}


//displays the response from server to UI
function displayData(data) {
    document.getElementById('image').setAttribute('src',data.imageURL);
    document.getElementById('loc').textContent=`${data.location}, ${data.country}`;
    document.getElementById('weather').textContent=`The weather condition by then will be ${data.description}`;
    document.getElementById('temp').textContent=`Max Temperature: ${data.maxTemp} & Min Temperature ${data.minTemp}`;
    document.getElementById('days').textContent=`${Math.round(data.daysToTravel)} days to go`;
    document.getElementById('dates').textContent=`Start Date: ${data.travelStartDate} & Return Date: ${data.travelEndDate}`;
    document.getElementById('tripDuration').textContent=`Trip Duration: ${data.tripDuration} days`
}

/*helper functions*/

//Setting min and max date to input date field as weather forecast is available only for 16 days
function setMinAndMaxDate() {
    let currentDate=new Date();
    let minDate=currentDate.getFullYear()+'-'+appendLeadingZeroes((currentDate.getMonth()+1))+'-'+appendLeadingZeroes(currentDate.getDate());
    let maxDate=new Date(currentDate.getFullYear(),currentDate.getMonth(),currentDate.getDate()+15);
    maxDate=maxDate.getFullYear()+'-'+appendLeadingZeroes((maxDate.getMonth()+1))+'-'+appendLeadingZeroes(maxDate.getDate());
    document.getElementById('travelStartDate').setAttribute('min',minDate);
    document.getElementById('travelStartDate').setAttribute('max',maxDate);
    document.getElementById('travelEndDate').setAttribute('min',minDate);
}


//append zero to date and month if it is less than 10
function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
}


//return a new date object from date string
function createDateObjectFromDate(date){
    let splitDate=date.split('-');
    return new Date(splitDate[0],splitDate[1]-1,splitDate[2]);
}


//return the difference between two date objects
function difBtDates( date1, date2 ) {
    //Get 1 day in milliseconds
    let one_day=1000*60*60*24;
  
    // Convert both dates to milliseconds
    let date1_ms = date1.getTime();
    let date2_ms = date2.getTime();
  
    // Calculate the difference in milliseconds
    let difference_ms = date2_ms - date1_ms;
    // Convert back to days and return
    return (difference_ms/one_day);
  }


//function to display error messages
  let mbar = {
    add : function (message) {
      let bar = document.createElement("div");
      bar.classList.add("message-bar");
      bar.innerHTML = `${message}&times;`;
      bar.addEventListener("click", mbar.close);
      document.getElementById("message-wrap").appendChild(bar);
    },
    close : function () {
      this.remove();
    }
  };


  