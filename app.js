const express = require('express');
const app = express();
const port = 9129;

app.use('/assets', express.static(`${__dirname}/assets/`));
app.use('/langs', express.static(`${__dirname}/langs/`));

app.get('/', (req, res) => {
  res.sendFile( __dirname + "/template/" + "index.html" );
});

app.get('/chart.html', (req, res) => {
  res.sendFile( __dirname + "/template/" + "chart.html" );
});

app.use(function(req, res, next) {
  res.sendFile( __dirname + "/template/" + "404.html" );
});

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}!`)
});
