const express = require('express');
const Datastore = require('nedb');
require('dotenv').config();
console.log(process.env.API_KEY);

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({limit : '1mb'}));

const database = new Datastore('database.db')
database.loadDatabase();

app.get('/api', (request, response)=> {
    database.find({}, (err, data)=> {
        if(err){
            response.end();
            return;
        }
        response.json(data);
    })
})

app.post('/api', (request, response)=> {
    const data = request.body;
    const timestamp = Date.now();
    data.timestamp = timestamp;
    database.insert(data);
    response.json(data)
});

app.get('/weather/:latlon', async (request, response)=> {
    console.log(request.params)
    const latlon = request.params.latlon.split(',');
    const lat = latlon[0];
    const lon = latlon[1];
    const api_key = process.env.API_KEY;
    const weather_url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${api_key}`;
    const weather_response = await fetch(weather_url);
    const weather_data = await weather_response.json();
    response.json(weather_data);

});
