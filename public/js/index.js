const randomizeButton = $('.radomize-palette');
const lockButton = $('.padlock-image');
const addProjectButton = $('.add-project');
const addPaletteButton = $('.add-palette');
const projectContainer = $('.project-container');

let updatedProjects = [];

const displayPalettes = async id => {
  const palettes = await fetchPalettes();
  palettes.forEach(
    palette =>
      palette.project_id === id
        ? $(`#${id}`).append(
            `<section class="palettes" id=${palette.id}>
              <p>${palette.palette_name}</p>  
              <div class="single-palette" style="background-color:${
                palette.project_id === id ? palette.color_1 : ''
              }"></div>
              <div class="single-palette" style="background-color:${
                palette.project_id === id ? palette.color_2 : ''
              }"></div>
              <div class="single-palette" style="background-color:${
                palette.project_id === id ? palette.color_3 : ''
              }"></div>
              <div class="single-palette" style="background-color:${
                palette.project_id === id ? palette.color_4 : ''
              }"></div>
              <div class="single-palette" style="background-color:${
                palette.project_id === id ? palette.color_5 : ''
              }"></div>
              <button class="delete-palette">X</button>
            </section>`
          )
        : ''
  );
};

const displayProjects = async () => {
  const url = '/api/v1/projects';
  const projectOptions = $('select');

  const response = await fetch(url);
  const projects = await response.json();

  updatedProjects = [...projects];

  projects.forEach(project => {
    return projectContainer.append(
      `<div class="saved-palette-container">
        <h4>${project.project_name.charAt(0).toUpperCase() +
          project.project_name.slice(1)}
        </h4>
        <div class="palettes" id=${project.id}></div>
    </div>`,
      displayPalettes(project.id)
    );
  });

  projects.forEach(project => {
    return projectOptions.append(`<option>${project.project_name}</option>`);
  });
};

const fetchPalettes = async () => {
  const url = '/api/v1/palettes';

  const response = await fetch(url);
  const palettes = await response.json();
  return palettes;
};

$(document).ready(() => setNewColor(), displayProjects());

window.onkeydown = e => {
  if (e.keyCode === 32) setNewColor();
};

const generateNewColor = () => {
  let hex = '#';
  let possibleChars = '0123456789ABCDEF';

  for (let i = 0; i < 6; i++) {
    hex += possibleChars[Math.floor(Math.random() * 16)];
  }

  return hex;
};

const lockColor = e => {
  if (
    $(e.target)
      .attr('src')
      .indexOf('/images/padlock-unlock.svg') != -1
  ) {
    e.target.src = e.target.src.replace(
      '/images/padlock-unlock.svg',
      '/images/padlock.svg'
    );
  } else {
    e.target.src = e.target.src.replace(
      '/images/padlock.svg',
      '/images/padlock-unlock.svg'
    );
  }

  $(e.target)
    .parent('div')
    .toggleClass('locked-color');
};

const setNewColor = () => {
  const palettes = [
    '.palette-1',
    '.palette-2',
    '.palette-3',
    '.palette-4',
    '.palette-5'
  ];

  palettes.forEach(palette => {
    if (!$(`${palette}`).hasClass('locked-color')) {
      const newColor = generateNewColor();
      $(`${palette}`).css('background-color', newColor);
      $(`${palette}`)
        .children('p')
        .text(newColor);
    }
  });
};

const addProjectOption = async e => {
  e.preventDefault();

  const projects = await fetchProjects();

  const projectInput = $('.project-input');
  const selections = $('select');

  const allNames = projects.map(project => project.project_name);

  if (allNames.includes(projectInput.val())) {
    alert('That project already exists, please submit a new one!');
    return;
  }

  const project_name = projectInput.val();

  selections.append($(`<option>${project_name}</option>`));

  addProject({ project_name });
  projectInput.val('');
};

const addProject = async project => {
  const url = '/api/v1/projects';

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      ...project
    }),
    headers: {
      'content-type': 'application/json'
    }
  });

  await response.json();
};

const fetchProjects = async () => {
  const url = '/api/v1/projects';
  const response = await fetch(url);
  const allProjects = await response.json();
  return allProjects;
};

const submitPalette = async e => {
  e.preventDefault();

  const palette = $('.palette-input').val();
  const project = $('select option:selected').text();
  const projectId = await filterProject(project);

  await addPaletteToProject(palette, projectId);
};

const filterProject = async proj => {
  const projects = await fetchProjects();

  const project = projects.find(project => project.project_name === proj);

  return project.id;
};

const addPaletteToProject = async (palette_name, project_id) => {
  const url = `/api/v1/projects/${project_id}/palettes`;

  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      palette_name,
      color_1: $('.palette-label-1').text(),
      color_2: $('.palette-label-2').text(),
      color_3: $('.palette-label-3').text(),
      color_4: $('.palette-label-4').text(),
      color_5: $('.palette-label-5').text(),
      project_id
    }),
    headers: {
      'content-type': 'application/json'
    }
  });

  const updatedPalletes = await response.json();

  return updatedPalletes;
};

const setPaletteView = event => {
  if (
    $(event.target)
      .parent()
      .hasClass('palettes')
  ) {
    const color1 = $(event.target)
      .parent()
      .children('div')[0].style.backgroundColor;
    const color2 = $(event.target)
      .parent()
      .children('div')[1].style.backgroundColor;
    const color3 = $(event.target)
      .parent()
      .children('div')[2].style.backgroundColor;
    const color4 = $(event.target)
      .parent()
      .children('div')[3].style.backgroundColor;
    const color5 = $(event.target)
      .parent()
      .children('div')[4].style.backgroundColor;
    $('.palette-1').css('background-color', color1);
    $('.palette-2').css('background-color', color2);
    $('.palette-3').css('background-color', color3);
    $('.palette-4').css('background-color', color4);
    $('.palette-5').css('background-color', color5);
  }
};

const deletePalette = e => {
  const id = $(e.target)
    .parent('section')
    .attr('id');
  const url = `/api/v1/palettes/${id}`;
  fetch(url, {
    method: 'DELETE'
  });

  e.target.closest('section').remove();
};

randomizeButton.on('click', setNewColor);

addProjectButton.on('click', addProjectOption);

addPaletteButton.on('click', submitPalette);

projectContainer.on('click', '.single-palette', setPaletteView);

projectContainer.on('click', '.delete-palette', deletePalette);

lockButton.on('click', lockColor);
