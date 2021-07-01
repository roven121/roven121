
function accessToken() {
  console.log("success to get api token");
  var settings = {
    url: API_URLS.getTokenApi,
    method: "POST",

    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: {
      client_id: " 7WVMCOuXa30yPwmeOBeanGSsVJN5CfdU",
      client_secret: "d6HPw1RTAl9rXJYe",
      grant_type: "client_credentials",
    },
  };

  $.ajax(settings).done(function (data) {
    const token = Object.values(data.access_token).join("");
    state.token.push(token);
  });
}
