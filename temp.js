const axios = require('axios');


// const { default: axios } = require("axios");
// const { response } = require("express");


const params = {key: 'AIzaSyDgGYLTzUbC1Y9BGiYdvUq6wCuwoV0q5xw', q: 'pathan', part: 'snippet'};

axios.get('https://www.googleapis.com/youtube/v3/search', {params})
        .then(response => {
            console.log(response.data.items[0]['id']['videoId']);
            const paramsSearchSongList = {'title': 'Song Name', 'yt-search-data': response};
            // res.status(200).render(path.join(__dirname, '/static/templates/searchSongList.pug'), paramsSearchSongList);
        })
        .catch(error => {
            console.log(error);
        });

// const axios = require("axios");

// axios.get('https://www.google.com/search', {
//         q: 'abc'
// }).then(response => {
//     console.log(response.data);
// });