const randomizeButton = $('.radomize-palette');
const lockButton = $('.padlock-image');
const projectContainer = $('.project-container');

const getProjects = async () => {
  const url = '/api/v1/projects';

  const response = await fetch(url);
  const projects = await response.json();
  const palettes = await getPalettes();
  console.log(projects);
  console.log(palettes);

  const colors = {
    colors: []
  };

  const allColors = palettes.map(palette => {
    return [
      palette.color_1,
      palette.color_2,
      palette.color_3,
      palette.color_4,
      palette.color_5
    ];
  });

  const allProjects = projects.map(
    project =>
      console.log(project) ||
      projectContainer.append(
        `<section class="saved-palette-container">${project.project_name
          .charAt(0)
          .toUpperCase() + project.project_name.slice(1)}: 
        <div class="single-palette" style="background-color:${
          allColors[0][0]
        }"></div>
        <div class="single-palette" style="background-color:${
          allColors[0][1]
        }"></div>
        <div class="single-palette" style="background-color:${
          allColors[0][2]
        }"></div>
          <div class="single-palette" style="background-color:${
            allColors[0][3]
          }"></div>
          <div class="single-palette" style="background-color:${
            allColors[0][4]
          }"></div>
      </section>`
      )
  );
};

const getPalettes = async () => {
  const url = '/api/v1/palettes';

  const response = await fetch(url);
  const palettes = await response.json();
  return palettes;
};

$(document).ready(() => setNewColor(), getProjects());

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

randomizeButton.on('click', setNewColor);

lockButton.on('click', lockColor);
