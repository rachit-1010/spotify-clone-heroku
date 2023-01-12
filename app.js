const express = require('express');
const app = express();
const path = require('path')
const http = require('http');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { json } = require('express');
mongoose.set('strictQuery', false);

const hostname = '127.0.0.1';
const port = 80;

app.use(express.static('static'));
// app.use(express.urlencoded());
app.use(bodyParser.urlencoded({
    extended: false
 }));
 app.use(bodyParser.json());
 app.set('view engine', 'pug');
 app.set('views', path.join(__dirname, '/static/templates'))


app.get("/", (req, res)=>{ 
    res.sendFile(path.join(__dirname, '/static/landingPage.html'));
});

app.get("/findSong", (req, res)=>{ 
    res.sendFile(path.join(__dirname, '/static/findSong.html'));
});


app.post("/findSong", (req, res)=>{
    let query = req.body.query;
    console.log(query);
    // res.sendFile(path.join(__dirname, '/static/searchSongList.html'));

    const params = {key: 'AIzaSyDgGYLTzUbC1Y9BGiYdvUq6wCuwoV0q5xw', q: query, part: 'snippet', maxResults: 6};
    axios.get('https://www.googleapis.com/youtube/v3/search', {params})
        .then(response => {
            console.log(response.data.items[0]['id']['videoId']);
            let url_arr = [];
            for (let index = 0; index < 6; index++) {
                // console.log("Inside for" + index);
                // console.log(response.data.items[index]);
                // console.log(response.data.items[index]['id']['videoId']);
            url_arr.push("https://www.youtube.com/embed/" + response.data.items[index]['id']['videoId'] + "?enablejsapi=1&version=3&playerapiid=ytplayer");
            }
            console.log(url_arr[0]);
            const paramsSearchSongList = {'title': query, 'ytsearchdata': response, 'urls': url_arr};
            res.status(200).render(path.join(__dirname, '/static/templates/searchSongList.pug'), paramsSearchSongList);
        })
        .catch(error => {
            console.log(error);
        });
});

app.get("/addSong", (req, res)=>{ 
    res.sendFile(path.join(__dirname, '/static/addSong.html'));
});

mongoose.connect('mongodb://127.0.0.1:27017/rachit');
console.log("Connected to database rachit");
const songSchema = mongoose.Schema({'title': String,'album': String, 'duration': String, "videoId": String});
const songModel = mongoose.model('song', songSchema);
console.log("----------------");
console.log("Here are all the songs");


app.get("/submit", (req, res) => {

        console.log(req.query);
        const firstSong = new songModel({'title': req.query.myName, 'album': req.query.album, 'duration': '4:05', 'videoId': req.query.videoId});

        firstSong.save();

        console.log("Added second song!");

    res.sendFile(path.join(__dirname, '/static/addSongSuccess.html'));
});

app.get("/api/getAllSongs", (req, res) => {
    songModel.find({}, (err, data) => {
        if (err){
            console.log(err);
        }
        else{
            console.log(data);
        }

        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data}));
        // res.send(data);

        // res.json({data});
    });
});



// const params = {key: 'AIzaSyDgGYLTzUbC1Y9BGiYdvUq6wCuwoV0q5xw', q: 'pathan', part: 'snippet'};

// axios.get('https://www.googleapis.com/youtube/v3/search', {params})
//         .then(response => {
//             console.log(response.data.items[0]['id']['videoId']);
//             const paramsSearchSongList = {'title': 'Song Name', 'yt-search-data': response};
//             // res.status(200).render(path.join(__dirname, '/static/templates/searchSongList.pug'), paramsSearchSongList);
//         })
//         .catch(error => {
//             console.log(error);
//         });

app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});




