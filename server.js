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

app.get('/api/v1/palettes', (request, response) => {
  database('palettes')
    .select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects', (request, response) => {
  database('projects')
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/palettes', (request, response) => {
  const palette = request.body;

  for (let requiredParameter of [
    'palette_name',
    'color_1',
    'color_2',
    'color_3',
    'color_4',
    'color_5'
  ]) {
    if (!palette[requiredParameter]) {
      return response.status(422);
    }
  }

  const id = app.locals.colors.length + 1;

  const color = '#f7f7f7';

  const selection = { id, color };

  app.locals.colors.push(selection);

  response.status(201).json({ id, color });
});

app.post('api/v1/projects', (request, response) => {});

app.delete('/api/v1/projects/:id', (request, response) => {});

app.use(express.static('public'));
