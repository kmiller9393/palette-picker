const randomizeButton = $('.radomize-palette');
const lockButton = $('.padlock-image');

const generateNewColor = () => {
  let hex = '#';
  let possibleChars = '01234567890ABCDEF'.split('');

  for (let i = 0; i < 6; i++) {
    hex += possibleChars[Math.floor(Math.random() * 16)];
  }
  console.log(hex);
  return hex;
};

const lockColor = e => {
  lockButton.toggleClass('locked-color');
  console.log(this);
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
    console.log(palette);
    if ($(`${palette}`).hasClass('locked-color')) {
      return;
    }
    $(`${palette}`).css('background-color', generateNewColor());
  });
};

randomizeButton.on('click', generateNewColor, setNewColor);

lockButton.on('click', lockColor);
