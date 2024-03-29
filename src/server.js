const express = require('express');
const mustacheExpress = require('mustache-express');
const data = require('./data.json');

const app = express();
app.engine('mustache', mustacheExpress());
app.set('views', `${__dirname}/templates`);
app.set('view engine', 'mustache');


app.use(express.static('build'));
app.get('*', (req, res) => {
  const slide = data[(req.query.slide || 1) - 1];
  res.render('index', {
    alias: slide.alias,
    data: JSON.stringify(slide.data),
    theme: req.query.theme || 'dark',
    title: slide.data.title,
  });
});


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is up at port http://localhost:${port}`);
});
