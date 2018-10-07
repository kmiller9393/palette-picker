const randomizeButton = $('.radomize-palette');
const lockButton = $('.padlock-image');
const addProjectButton = $('.add-project');

let colors = [];

const displayPalettes = async id => {
  const palettes = await fetchPalettes();

  palettes.forEach(
    palette =>
      palette.project_id === id
        ? $(`#${id}`).append(
            `<section class="palettes">
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
              }"></div>`
          )
        : ''
  );
};

const displayProjects = async () => {
  const url = '/api/v1/projects';
  const projectContainer = $('.project-container');

  const response = await fetch(url);
  const projects = await response.json();

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

const addProjectOption = e => {
  e.preventDefault();
  const selections = $('select');
  const projectInput = $('.project-input');

  const inputVal = projectInput.val();

  selections.append($(`<option>${inputVal}</option>`));
};

randomizeButton.on('click', setNewColor);

addProjectButton.on('click', addProjectOption);

lockButton.on('click', lockColor);
