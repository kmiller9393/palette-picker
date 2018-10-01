const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);

app.locals.mockPalettes = [
  { id: 1, color: '#008000' },
  { id: 2, color: '#00FFFF' },
  { id: 3, color: '#008080' }
];

app.listen(app.get('port'), () => {
  console.log(`App is running on ${app.get('port')}`);
});

app.use(express.static('public'));
