const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

app.locals.colors = [
  { id: 1, color: '#f44253' },
  { id: 2, color: '#011c4f' },
  { id: 3, color: '#fff58c' },
  { id: 4, color: '#007c02' },
  { id: 5, color: '#ffa163' }
];

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`);
});

app.get('/api/v1/palette-colors', (request, response) => {
  const colors = app.locals.colors;

  response.status(200).json({ colors });
});

app.get('/api/v1/palette-colors/:id', (request, response) => {
  const { id } = request.params;
  const color = app.locals.colors.find(color => color.id == id);

  if (color) {
    return response.status(200).json(color);
  } else {
    return response
      .status(404)
      .send({ error: `No palette found with an id of ${id}.` });
  }
});

app.post('/api/v1/palette-colors', (request, response) => {
  const id = app.locals.colors.length + 1;
  console.log(request);
  const color = '#f7f7f7';
  // const selection = { id, color };

  app.locals.colors.push(selection);

  response.status(201).json({ id, color });
});

app.use(express.static('public'));
