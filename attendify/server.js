const express = require('express');
const app = express();
const anomaliesRoute = require('./backend/routes/anomalies');

app.use(express.json());

// ✅ Mount the anomalies route
app.use('/api/anomalies', anomaliesRoute);

// other routes...
