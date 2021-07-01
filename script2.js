// const inputs = {
//   $form: $("#form"),
//   $checkIn: $("#check-in"),
//   $checkOut: $("#check-out"),
//   $search: $("#search-hotel"),
//   $selectMenu: $("select-menu"),
// };

// const ELEMENTS_DYNAMIC = {
//   resultHotels: $(".result-hotels"),
//   messageId: $(".message-id"),
//   creatOption: $("#select-menu"),
// };

// const state = {
//   token: [],
//   searchHotelByUser: [],
//   cityCode: [],

//   getHotels: [],
//   test: [],
// };
// const API_URLS = {
//   cities: "cities.json",
//   getTokenApi: `https://test.api.amadeus.com/v1/security/oauth2/token`,
// };

// main();

// function main() {
//   allApi();
//   dateOrder();

//   apiCities();

//   initForm();
// }

// function dateOrder() {
//   checkIn();
//   checkOut();
// }

// function fetchCityList(onFetchResult) {
//   $.ajax({
//     method: "GET",
//     url: API_URLS.cities,

//     success: (data) => {
//       const cities = Object.entries(data).map((city) => ({
//         cityName: city[0],
//         cityCode: city[1],
//       }));
//       onFetchResult(cities);
//     },
//   });
// }
// function apiCities() {
//   fetchCityList((cities) => {
//     cities.forEach(renderCity);
//   });
// }

// function renderCity(city) {
//   const el = $(
//     `<option name="${city.cityCode}" value="${city.cityCode}">${city.cityName}</option>`
//   );
//   const elClass = el.addClass(`${city.cityCode}`);
//   const $elClass = $("elClass");
//   ELEMENTS_DYNAMIC.creatOption.append(el);
// }

// function initForm() {
//   inputs.$form.submit(function (e) {
//     e.preventDefault();
//     const hotel = {
//       checkIN: inputs.$checkIn.val(),
//       checkOut: inputs.$checkOut.val(),
//       city: $("option:selected").val(),
//     };

//     state.searchHotelByUser.push(hotel);
//     state.cityCode.push(hotel.city);
//     inputs.$form.trigger("reset");
//     //  getHotelValue() must be here because the function get hotel.city.val()
//     // getHotelValue(); this function will be active after check if (data.json) worked
//   });
// }

// function checkIn() {
//   const thisDate = new Date();
//   const day = thisDate.getDate();
//   const month = thisDate.getMonth() + 1;
//   const year = thisDate.getFullYear();

//   inputs.$checkIn.attr("min", `${year}-0${month}-${day}`);
// }
// function checkOut() {
//   inputs.$checkIn.change(function () {
//     inputs.$checkOut.val("");
//     const thisDate = new Date(inputs.$checkIn.val());
//     const day = thisDate.getDate() + 1;
//     const month = thisDate.getMonth() + 1;
//     const year = thisDate.getFullYear();
//     inputs.$checkOut.attr("min", `${year}-0${month}-${day}`);
//   });
// }

// function accessToken() {
//   console.log("success to get api token");
//   var settings = {
//     url: API_URLS.getTokenApi,
//     method: "POST",
//     timeout: 0,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     data: {
//       client_id: " 7WVMCOuXa30yPwmeOBeanGSsVJN5CfdU",
//       client_secret: "d6HPw1RTAl9rXJYe",
//       grant_type: "client_credentials",
//     },
//   };

//   $.ajax(settings).done(function (data) {
//     const token = Object.values(data.access_token).join("");
//     state.token.push(token);
//   });
// }
// function allApi() {
//   accessToken();
// }
// // getHotelValue(); this function will be active after check if (data.json) worked
// function getHotelValue() {
//   if (state.cityCode.length !== 0) {
//     console.log("success to get hotels");
//     const city = state.cityCode;
//     const p = new Promise((resolve, reject) => {
//       resolve({
//         url: `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${city}`,
//         method: "GET",
//         timeout: 0,
//         headers: {
//           Authorization: `Bearer ${state.token}`,
//         },
//       });
//     });
//     p.then((data) => {
//       return console.log(data);
//     });
//   } else {
//     console.log("failed");
//   }

//   state.cityCode = [];
// }
const state = {
  test: [],
};
function getHotelValue(fetchHotel) {
  console.log("success to get hotels");

  $.ajax({
    url: "data.json",
    method: "GET",
    timeout: 0,

    success: (data) => {
      state.test.push(data);
      const results = data.data.map((result) => {
        // console.log(result.hotel.name);//present the name of hotel
        // console.log(result.hotel.rating);// the star of hotel
        // console.log(result.hotel.amenities); // show all the server in this hotel
        // console.log(result.hotel.description); // show description
        //  console.log(result.hotel.address.cityName); // show address name
        // console.log(result.offers.checkInDate);//show checkInDate
        // console.log(result.offers.checkOutDate); //show checkOutDate
        // console.log(result.offers.price);
        console.log(result.price.currency);
      });
      // const offers = data.data[0].offers[0].id;
      // console.log(offers);
    },
  });
}
