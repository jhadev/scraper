var express = require("express");
var mongojs = require("mongojs");
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");

// Initialize Express
var app = express();

// Handlebars
app.set('views', './views')
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function (error) {
  console.log("Database Error:", error);
});


app.get("/", (req, res) => {
  axios.get("https://www.nypost.com").then(function (response) {


    const $ = cheerio.load(response.data);

    $(".home-page-section-stories-wrapper").each((i, element) => {

      const title = $(element).find("h3.headline").text();
      const link = $(element).find("a").attr("href");

      // Save these results in an object that we'll push into the results array we defined earlier
      if (title && link) {

        const scrapeObject = {
          title: title,
          link: link
        };
        // Insert the data in the scrapedData db
        db.scrapedData.insert(scrapeObject,
          (err, inserted) => {
            if (err) {
              // Log the error if one is encountered during the query
              console.log(err);
            } else {
              // Otherwise, log the inserted data
              console.log(inserted);
            }
        });
      }
    });
  });
  res.render('index');
});

app.get("/api/all", (req, res) => {
  // Find all results from the scrapedData collection in the db
  db.scrapedData.find({}, (error, found) => {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});

app.listen(3000,() => {
  console.log("App running on port 3000!");
});