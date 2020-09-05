import * as index from "../src/server/index";

let geonamesURL='http://api.geonames.org/search?type=json&maxRows=1&q=';
let location='chennai';
let geonamesUsername=process.env.GEONAMES_USER_NAME;
let pixabayURL='https://pixabay.com/api/?image_type=photo&category=places&key=';
let pixabayKEy=process.env.PIXABAY_API_KEY;
let geonamesOutput={"totalResultsCount":337,"geonames":[{"adminCode1":"25","lng":"80.27847","geonameId":1264527,"toponymName":"Chennai","countryId":"1269750","fcl":"P","population":4328063,"countryCode":"IN","name":"Chennai","fclName":"city, village,...","adminCodes1":{"ISO3166_2":"TN"},"countryName":"India","fcodeName":"seat of a first-order administrative division","adminName1":"Tamil Nadu","lat":"13.08784","fcode":"PPLA"}]}
let pixabayOutput={"total":2,"totalHits":2};
test('call to the geonames api to get latitude and longtitude',async () => {
    const data=await index.getLatAndLonFromGeoNames(geonamesURL,location,geonamesUsername)
    expect(data).toStrictEqual(geonamesOutput);
});


test('call to the pixabay api to get image of the location',async () => {
    const data=await index.getImageURLFromPixabay(pixabayURL,pixabayKEy,location)
    expect(data).toEqual(expect.objectContaining(pixabayOutput));
});

