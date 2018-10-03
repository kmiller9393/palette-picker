const randomizeButton = $('.radomize-palette');
const lockButton = $('.padlock-image');

const generateNewColor = () => {
  let hex = '#';
  let possibleChars = '0123456789ABCDEF'.split('');

  for (let i = 0; i < 6; i++) {
    hex += possibleChars[Math.floor(Math.random() * 16)];
  }
  return hex;
};

const lockColor = e => {
  if (
    $(e.target)
      .attr('src')
      .toString()
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
      $(`${palette}`).css('background-color', generateNewColor());
    }
  });
};

randomizeButton.on('click', setNewColor);

lockButton.on('click', lockColor);
