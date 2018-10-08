const express = require('express');
//importing the express method from the express library here

const environment = process.env.NODE_ENV || 'development';
//setting a declared variable environment to whatever the current node environment is, if there
//isn't an environment, we are setting this environment variable to 'development'

const configuration = require('./knexfile')[environment];
//setting the knex configuration here based on what environment we are in (development, staging, production)

const database = require('knex')(configuration);
//importing the proper configuration from the knex library and assigning it to a variable,
//database which we have declared

const app = express();
//instantiating an instance of express by invoking the express method within the express library

const bodyParser = require('body-parser');
//importing body-parser, which is Node.js parsing middleware and parses incoming request bodies for us

app.use(bodyParser.json());
//telling the app (instance of express) to use the bodyParser to parse data in json

app.set('port', process.env.PORT || 3000);
//setting our port which express will use to run our application to whatever the current port is
//(i.e. whatever the current PORT environment variable's value is, or to 3000 as default)

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`);
});
//telling the app to listen to whatever port we have set above on line 24, so that the application
//can run properly

//fetching all palettes from the specified endpoint
app.get('/api/v1/palettes', (request, response) => {
  //selecting the palettes table within out palettes database and sending back the response (if successful)
  //which is our palettes (an array of objects, where each object is our palette)
  database('palettes')
    .select()
    .then(palettes => {
      response.status(200).json(palettes);
    })
    //if the response is not successful, display an error message
    .catch(error => {
      response.status(500).json({ error });
    });
});

//fetching all projects from this specified endpoint
app.get('/api/v1/projects', (request, response) => {
  //selecting the projects table within the palettes database and sending back the projects is the
  //status code is 200 (i.e. successful)
  database('projects')
    .select()
    .then(projects => {
      response.status(200).json(projects);
    })
    //if the response is not successful, display an error message
    .catch(error => {
      response.status(500).json({ error });
    });
});

//post new palettes, based on their id, to this specified endpoint
app.post('/api/v1/projects/:id/palettes', (request, response) => {
  let palette = request.body;
  //accessing the palette data from the body object
  let project_id = request.params.id;
  //getting the project id from the request params

  palette = { ...palette, project_id };
  //creating an object that spreads in all palettes received from the body object and adding a project_id
  //to each palette

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
      //if the palette does not have a value for one of the specified requiredParameters, then the following error will be displayed
      return response.status(422).send({
        error: `Expected format: { palette_name: <String>, color_1: <String>, color_2: <String>, color_3: <String>, color_4: <String>, color_5: <String>, project_id: <String> }. You're missing a "${requiredParameter}" property.`
      });
    }

    //inserting a new pallete, with its new id into the palettes table within the palettes database
    database('palettes')
      .insert(palette, 'id')
      .then(palette => {
        response.status(201).json({ id: palette[0] });
      })
      //if there is an error, display error message
      .catch(error => {
        response.status(500).json({ error });
      });
  }
});

//posting a new project to the specified endpoint
app.post('/api/v1/projects', (request, response) => {
  const project = request.body;
  //accessing the project data from the body object and storing it in the project variable

  for (let requiredParameter of ['project_name']) {
    //if the project does not have a value for one of the specified requiredParameters, then the following error will be displayed
    if (!project[requiredParameter]) {
      return response.status(422).send({
        error: `Expected format: { project_name: <String> }. You're missing a "${requiredParameter}" 
        property.`
      });
    }
  }

  database('projects')
    //inserts a new project into the project table within the palette database, along with its id designated withini the migration file
    .insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] });
    })
    //display an error message if something goes wrong
    .catch(error => {
      response.status(500).json({ error });
    });
});

//delete a palette, based on its id from the specified endpoint
app.delete('/api/v1/palettes/:id', (request, response) => {
  const id = request.params.id;

  //accessing the request params id and storing it in the id variable

  database('palettes')
    //looking in the palettes table within the palettes database, when this delete method is invoked
    //(on click of a delete button), if any palettes' ids match the request params id, then delete the
    //corresponding pallets
    .where('id', id)
    .del()
    .then(() => {
      response
        .status(202)
        .json({ id })
        //display an error message if something goes wrong
        .catch(error => {
          response.status(500).json({ error });
        });
    });
});

//here we call the use method on the instance of express we created at the top
//its argument is a method called express that has a method static, which allows us to run static files (i.e. html and css)
app.use(express.static('public'));
