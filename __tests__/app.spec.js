import * as app from '../src/client/js/app'


let url='http://localhost:8000/saveData'
let input={
    location:'Chennai',
    travelStartDate:'2020-09-10',
    travelEndDate:'2020-09-18'
}
let output={
        minTemp: 27.4,
        maxTemp: 30.9,
        description: 'Overcast clouds',
        imageURL: 'https://pixabay.com/get/52e2d5454d5aa914f1dc846096293f7f163fdbe1524c704c7c2679d4954cc65d_640.jpg',
        daysToTravel: 6.486818472222223,
        location: 'chennai',
        travelStartDate: '2020-09-10',
        travelEndDate: '2020-09-18',
        tripDuration: 9,
        country: 'India'
}

app.postData=jest.fn();
app.postData.mockReturnValue(output);

test('call to the api',async () => {
    const data=await app.postData(url,input)
    expect(data).toBe(output);
});


test('create date object from date',()=>{
    expect(app.createDateObjectFromDate(input.travelStartDate)).toStrictEqual(new Date(2020,8,10))
})
