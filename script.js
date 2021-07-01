const inputs = {
  $form: $("#form"),
  $checkIn: $("#check-in"),
  $checkOut: $("#check-out"),
  $search: $("#search-hotel"),
  $selectMenu: $("select-menu"),
};
const ELEMENTS_DYNAMIC = {
  resultHotels: $(".result-hotels"),
  messageId: $(".message-id"),
  creatOption: $("#select-menu"),
  $loadingScreen: $("#loading-screen"),
  $popModal: $(".popModal"),
};
const state = {
  token: [],
  searchHotelByUser: [],
  cityCode: [],
  getHotels: [],
};
const API_URLS = {
  cities: "cities.json",
  getTokenApi: `https://test.api.amadeus.com/v1/security/oauth2/token`,
};
// calling function before executing would fail using the const syntax, try to avoid it
main();

function main() {
  //why hide loading before ajax sent?
  // hideLoadingScreen();
  // should be $(document).ready(() => showLoadingScreen("Loading..."));
  $(document).ajaxStart(() => showLoadingScreen("Loading..."));
  //confusing why hide the loading before ajax ends
  $(document).ajaxComplete(() => hideLoadingScreen());
  //not waiting for ajax to end? 
  //  should be, send ajax, ajax ends, update local state data, hide loading
  //  you did: hide loading, start loading, hide loading, send ajax, not wait for it to finish, ajax update the state on its own,
  allApi();
  apiCities();
  initForm();
}

function fetchCityList(onFetchResult) {
  $.ajax({
    method: "GET",
    url: API_URLS.cities,
    success: (data) => {
      const cities = Object.entries(data).map((city) => ({
        cityName: city[0],
        cityCode: city[1],
      }));
      onFetchResult(cities);
    },
  });
}

function apiCities() {
  //nice use of callback but you can also use promise
  fetchCityList((cities) => {
    cities.forEach(renderCity);
  });
}

function renderCity(city) {
  const el = $(
    `<option  name="${city.cityCode}" value="${city.cityCode}">${city.cityName}</option>`
  );
  const elClass = el.addClass(`${city.cityCode}`);
  const $elClass = $("elClass");
  ELEMENTS_DYNAMIC.creatOption.append(el);
}

function initForm() {
  const formEl = document.querySelector("#form");
  //set dates check in and out minimum
  formEl.checkIn.min = getMinDate(new Date(), 0);
  formEl.checkOut.min = getMinDate(new Date(), 1);
  const dateInputEl = document.querySelector("#check-in");
  dateInputEl.addEventListener("change", (event) => {
    if (event.target.value != formEl.checkIn.min) {
      const date = new Date(event.target.value);
      formEl.checkOut.min = getMinDate(new Date(date), 1);
    }
  });
  // why use "function" and not "=>" here?
  inputs.$form.submit(function (e) {
    e.preventDefault();
    const hotel = {
      checkIN: inputs.$checkIn.val(),
      checkOut: inputs.$checkOut.val(),
      city: $("option:selected").val(),
    };
    validateCity(hotel);
    state.searchHotelByUser.push(hotel);
    state.cityCode.push(hotel.city);
    getHotelValue(hotel.checkIN, hotel.checkOut, hotel.city, (results) => {
      //should all be in a different function named renderResult and be called from here
      if (results.length !== 0) {
        results.forEach(creatResultElement);
      } else {
        noHotelMessage();
      }
    });
    //remove comments
    // getPictureHotelsApi((results) => {
    //   results.forEach(creatResultPhoto);
    // });
    ELEMENTS_DYNAMIC.resultHotels === $();
    removeOldResults();
    inputs.$form.trigger("reset");
  });
}

function validateCity(hotel) {
  if (hotel.city === "select") {
    //why throw?
    throw validateCityAlert("please select a city from the list");
  }
}

function validateCityAlert(message) {
  //html element not organized and hard to read
  const $msg =
    $(`<div class="alert alert-warning alert-dismissible fade show" role="alert">
  <strong>${message}</strong> 
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>`);
  $msg.fadeIn();
  $("body").append($msg);
  // why not "=>" instead
  $(".close").on("click", function () {
    $(".alert").remove();
  });
}
//what?
let i = 12321;

function creatResultElement(result) {
  const $div = $(`<div id="main-container"></div>`);
  const $hotelName = $(`<h1>${result.hotelName}</h1>`);
  //should have an id from the data and not generated here, "i" is a bad variable name
  // you can also save the URL of the image in the hotel data
  const $picture = $(
    `<img src="https://source.unsplash.com/800x450/?hotel&id=3${i++}" class="img-thumbnail photo" alt="..."></img>`
  );
  const $ratingVal =
  //never use === undefined, use if (!result.rate) instead
    result.rate === undefined
      ? "Not Rated Yet"
      : createStarsRating(result.rate);
  const hotelRating = $(`<p>${result.hotelRating}</p>`);
  const hotelLines = $(`<p>${result.hotelLines}</p>`);
  const Description =
  //same
    result.hotelDescription === undefined
      ? $(`<p>i am empty</p>`)
      : $(`<div>
      <div >
      <textarea rows="5" cols="100" readonly>${result.hotelDescription.text}
      </textarea>
      </div>`);
  const priceAndCurrency = $(
    `<span><p>${result.price}${result.currency}</p> </span> `
  );
  const hotelAmenities = $(`<div><p>${result.hotelAmenities}</p></div>`);
  const btnModal = $(
    `<span><button type="button" class="btn btn-primary Modal" data-bs-toggle="modal" data-bs-target="#exampleModal" id="${result.hotelId}" onClick="modalRender()">Book</button></span>`
  );
  $div.append(
    $hotelName,
    $picture,
    $ratingVal,
    hotelRating,
    Description,
    hotelLines,
    priceAndCurrency,
    hotelAmenities,
    btnModal
  );
  //append alone is not good you need to empty the container div first and then append
  ELEMENTS_DYNAMIC.resultHotels.append($div);
}

function accessToken() {
  //remove console.log("success to get api token");
  try {
    $.ajax({
      type: "POST",
      url: API_URLS.getTokenApi,
      data: {
        //why space in client_id?
        //JS syntax is camleCase and not snake_case should be clientId, clientSecret, grantType
        client_id: " 7WVMCOuXa30yPwmeOBeanGSsVJN5CfdU",
        client_secret: "d6HPw1RTAl9rXJYe",
        grant_type: "client_credentials",
      },
      success: function (data) {
        // remove console.log(data);
        // why Object.values instead of simply data.access_token ??
        //should wait with await keyword to ajax to end and then execute this 
        const token = Object.values(data.access_token).join("");
        state.token.push(token);
      },
    });
  } catch (e) {
    showError(e);
  }
}

function allApi() {
  //useless function
  accessToken();
}
// getHotelValue(); this function will be active after check if (data.json) worked
async function getHotelValue(checkIn, checkOut, city, fetchHotel) {
  try {
    // "if (state.cityCode.length) {" will do the same because 0 is false and all the other numbers are true
    if (state.cityCode.length !== 0) {
      // remove console.log
      console.log("success to get hotels");
      await $.ajax({
        // url: `https://test.api.amadeus.com/v2/shopping/hotel-offers?cityCode=${city}&checkInDate=${checkIn}&checkOutDate=${checkOut}`,
        url: "data.json",
        method: "GET",
        timeout: 0,
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        success: (data) => {
          //this all should be after the ajax call like this const data = await $.ajax({
          //you are already waiting for the ajax to end why use callbacks?

          //remove console.logs
          console.log(data);
          // good use of map but does not have a check if data is array
          //can use: "const results = data?.data?.map((result) => ({"
          const results = data.data.map((result) => ({
            hotelId: result.hotel.hotelId,
            hotelName: result.hotel.name,
            rate: result.hotel.rating,
            hotelRating: result.hotel.rating,
            hotelLines: result.hotel.address.lines,
            hotelAmenities: result.hotel.amenities,
            hotelDescription: result.hotel.description,
            amenities: result.hotel.amenities,
            cityName: result.hotel.address.cityName,
            checkInDate: result.offers[0].checkInDate,
            checkOutDate: result.offers[0].checkOutDate,
            currency: result.offers[0].price.currency,
            price: result.offers[0].price.total,
          }));
          //remove console.logs
          console.log(results);
          fetchHotel(results);
        },
      });
    }
  } catch (e) {
    showError(e.statusText);
    //remove console.logs
    console.log(e.statusText);
  }
}

function removeOldResults() {
  $("#main-container").fadeOut("normal", function () {
    $(this).remove();
  });
}

function createStarsRating(rate) {
  let ratingVal = "";
  for (let i = 0; i < rate; i++) {
    ratingVal += "⭐";
  }
  return ratingVal;
}

function getMinDate(date, days) {
  const minDate = date;
  minDate.setDate(minDate.getDate() + days);
  minDate.setFullYear(minDate.getFullYear());
  const dayOfMonth = minDate.getDate().toString().padStart(2, "0");
  const month = (minDate.getMonth() + 1).toString().padStart(2, "0");
  const year = minDate.getFullYear();
  const minDateString = [year, month, dayOfMonth].join("-");
  return minDateString;
}

function showLoadingScreen(msg = "Loading...") {
  ELEMENTS_DYNAMIC.$loadingScreen.find(".loading-text").text(msg);
  ELEMENTS_DYNAMIC.$loadingScreen.show();
}

function hideLoadingScreen() {
  ELEMENTS_DYNAMIC.$loadingScreen.hide();
}

function showError(msg) {
  const $notification = $(`
     <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
         <div class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
             <div class="d-flex justify-content-center">  
                 <div class="toast-body text-white">
                  ${msg}
                 </div>
            </div>
         </div>
     </div>
`);
  $("body").append($notification);
  $notification
    .find(".toast")
    .toast({
      autosize: true,
      delay: 2e3,
    })
    .toast("show")
    .on("hidden.bs.toast", () => {
      // once the notification is hidden, remove the notification element from DOM
      $notification.remove();
    });
}

function noHotelMessage() {
  const $alert =
    $(`<div  class="alert  alert-warning alert-dismissible fade show" role="alert">
    <strong>Sorry please search another hotel</strong> 
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`);
  $("body").append($alert);
  $alert.click(function () {
    $alert.fadeOut("slow");
  });
}
function renderPopModal() {
  const $modal = $(
    `<div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"></div>`
  );
  $();
  ELEMENTS_DYNAMIC.$popModal.append($modal);
  $('[data-bs-toggle="modal"]').on("click", () => {
    myModal.show();
  });
}

var modalWrap = null;
// remove unused functions, or uncomment them
// function modalRender() {
//   if (modalWrap !== null) {
//     modalWrap.remove();
//   }

//   modalWrap =
//     $(`<div class="modal-dialog modal-dialog-scrollable fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//   <div class="modal-dialog  ">
//     <div class="modal-content">
//       <div class="modal-header">
//         <h5 class="modal-title" id="exampleModalLabel">New message</h5>
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close">
//           <span aria-hidden="true">&times;</span>
//         </button>
//       </div>
//       <div class="modal-body">
//         <form class="modalForm">
//           <div class="form-group">
//             <label for="recipient-name" class="col-form-label has-validation">Title:</label>
//             <input type="text" class="form-control" id="recipient-name">
//           </div>
//           <div class="form-group">
//           <label for="recipient-name" class="col-form-label">first Name:</label>
//           <input type="text" class="form-control" id="recipient-name">
//         </div>
//         <div class="form-group">
//         <label for="recipient-name" class="col-form-label">Last Name:</label>
//         <input type="text" class="form-control" id="recipient-name">
//       </div>
//           <div class="form-group">
//             <label for="message-text" class="col-form-label">Phone:</label>
//             <input type="" class="form-control" id="message-text"></input>
//           </div>
//           </div>
//           <div class="form-group">
//             <label for="message-text" class="col-form-label">Email:</label>
//             <input class="form-control" id="message-text"></input>
//           </div>
//         </form>
//       </div>
//       <div class="modal-footer">
//         <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
//         <button type="button" class="btn btn-primary">Send message</button>
//       </div>
//     </div>
//   </div>
// </div>`);
//   $("body").append(modalWrap);
//   $("#exampleModal").modal();
// }
