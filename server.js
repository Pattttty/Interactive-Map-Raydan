const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the public directory
app.use(express.static('public'));

// Endpoint to get markers
app.get('/markers', (req, res) => {
    fs.readFile('markers.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading markers file:', err);
            return res.status(500).send('Error reading markers file.');
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to add a marker
app.post('/add-marker', (req, res) => {
    const newMarker = {
        id: req.body.id,
        lat: req.body.lat,
        lng: req.body.lng,
        message: req.body.message
    };

    fs.readFile('markers.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading markers file:', err);
            return res.status(500).send('Error reading markers file.');
        }

        const markers = JSON.parse(data);
        markers.push(newMarker);

        fs.writeFile('markers.json', JSON.stringify(markers, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error saving marker:', err);
                return res.status(500).send('Error saving marker.');
            }
            res.status(200).send('Marker added successfully.');
        });
    });
});

// Endpoint to delete a marker
app.post('/delete-marker', (req, res) => {
    const { id } = req.body;

    fs.readFile('markers.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading markers file:', err);
            return res.status(500).send('Error reading markers file.');
        }

        let markers = JSON.parse(data);
        markers = markers.filter(marker => marker.id !== id);

        fs.writeFile('markers.json', JSON.stringify(markers, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Error deleting marker:', err);
                return res.status(500).send('Error deleting marker.');
            }
            res.status(200).send('Marker deleted successfully.');
        });
    });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});