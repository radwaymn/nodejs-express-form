const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 7004;

let welcomeHtml = fs.readFileSync("../Client-Side/HTML/welcome.html").toString();

app.use(bodyParser.urlencoded({extended: true}));

app.get(["/", "/main.html"], (request, response) => {
    response.sendFile(path.join(__dirname, "../Client-Side/HTML/main.html"));
})

app.get("/CSS/style.css", (request, response) => {
    response.sendFile(path.join(__dirname, "../Client-Side/CSS/style.css"));
})

app.get("/JS/script.js", (request, response) => {
    response.sendFile(path.join(__dirname, "../Client-Side/JS/script.js"));
})

app.get(["/favicon.ico", "/ASSETS/home.png", "/home.png"], (request, response) => {
    response.sendFile(path.join(__dirname, "../Client-Side/ASSETS/home.png"));
})

app.get(["/user.png", "/ASSETS/user.png"], (request, response) => {
    response.sendFile(path.join(__dirname, "../Client-Side/ASSETS/user.png"));
})

app.get(["/welcome.html"], (request, response) => {
    let clientObj = getDataObject(request.url.split("?")[1]);
    saveJsonFile(fs, clientObj);
    for (let prop in clientObj) {
        welcomeHtml = welcomeHtml.replace(`{${prop}}`, clientObj[prop]);
    }
    response.send(welcomeHtml);
    for (let prop in clientObj) {
        welcomeHtml = welcomeHtml.replace(clientObj[prop], `{${prop}}`);
    }
})

app.post(["/welcome.html"], (request, response) => {
    let clientObj = request.body;
    saveJsonFile(fs, clientObj);
    for (let prop in clientObj) {
        welcomeHtml = welcomeHtml.replace(`{${prop}}`, clientObj[prop]);
    }
    response.send(welcomeHtml);
    for (let prop in clientObj) {
        welcomeHtml = welcomeHtml.replace(clientObj[prop], `{${prop}}`);
    }
})



function getDataObject(data) {
    let obj = {};
    let allData = data.split("&");
    for(let i in allData) {
        obj[allData[i].split("=")[0]] = decodeURIComponent(allData[i].split("=")[1]);
    }
    return obj;
}

function saveJsonFile(fs, obj) {
    let arr = JSON.parse(fs.readFileSync("clients.json")) || [];
    arr.push(obj);
    fs.writeFileSync("clients.json", JSON.stringify(arr));
}


const server = app.listen(port, () => console.log(`Server started, watching files at [ http://localhost:${port}/ ]`));


