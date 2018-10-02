const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.locals.palettes = [
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
  const colors = app.locals.palettes.map(palette => palette.color);
  response.status(200).json(colors);
});

app.get('/api/v1/palette-colors/:id', (request, response) => {
  const id = request.params.id;
  const palette = app.locals.palettes.find(palette => {
    return palette.id == id;
  });

  if (palette) {
    return response.status(200).json(palette);
  } else {
    return response
      .status(404)
      .send({ error: `No palette found with an id of ${id}.` });
  }
});

app.use(express.static('public'));
