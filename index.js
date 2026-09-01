const express = require("express")
const path = require("path")
const app = express()

// set up the view engine which will be ejs for this one
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// set up the public directory for assets
app.use(express.static(path.join(__dirname, "public")));

// The home page
app.get("/", (req, res) => {
    return res.render("index", {
        page: "home",
        object: {},
        scriptsToImport: [],
        isAuth: false
    })
});

app.get("/how-it-works", (req, res) => {
    return res.render("index", {
        page: "how-it-works",
        object: {},
        scriptsToImport: [],
        isAuth: false
    })
});

app.get("/login", (req, res) => {
    return res.render("index", {
        page: "login",
        object: {},
        scriptsToImport: ["/js/auth/loginDesign.js", "/js/auth/login.js"],
        isAuth: false
    })
});

app.get("/dashboard", (req, res) => {
    // if (req.user) {
        return res.render("index", {
            page: "dashboard",
            object: {},
            scriptsToImport: ["/js/dashboard.js"],
            isAuth: true
        })
    // }
})

// This is to run the app on heroku, heroku uses a dynamic port so we use process.env.PORT to get the port
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Listening to ${PORT}`)
});