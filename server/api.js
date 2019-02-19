const axios = require("axios");

module.exports = function(app) {
  const key = process.env.GOOGLE_KEY;

  app.get("/api/google/nearbyattractions/:lat/:lng", (req, res) => {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${
          req.params.lat
        },${req.params.lng}&key=${key}`
      )
      .then(response => {
        console.log(response);
        console.log(response.data.url);

        var plusCode = response.data.plus_code.compound_code;
        var location = plusCode.slice(
          plusCode.indexOf(" ") + 1,
          plusCode.length
        );

        return axios.get(
          `https://maps.googleapis.com/maps/api/place/textsearch/json?query=point+of+interest+in+${location}&key=${key}&location=${
            req.params.lat
          },${req.params.lng}&radius=1000`
        );
      })
      .then(response => {
        console.log("Response", response);
        res.send(JSON.stringify(response.data.results));
      })
      .catch(error => {
        console.log(error);
        res.send(error);
      });
  });
};
