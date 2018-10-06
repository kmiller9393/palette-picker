const express = require('express');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('port', process.env.PORT || 3000);

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
    'color_5',
    'project_id'
  ]) {
    if (!palette[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_id: <String> }. You're missing a "${requiredParameter}" property.`
      });
    }
    database('projects')
      .where(('project_name', '==', palette.project_id))
      .select()
      .then(palette => {
        response.status(201).json({ id: palette.project_id });
      });
  }

  database('palettes')
    .insert(palette, 'id')
    .then(palette => {
      response.status(201).json({ id: palette[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['project_name']) {
    if (!project[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { project_name: <String> }. You're missing a "${requiredParameter}" 
        property.`
      });
    }
  }

  database('projects')
    .insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/palettes/:id', (request, response) => {});

app.use(express.static('public'));
