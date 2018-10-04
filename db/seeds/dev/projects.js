exports.seed = function(knex, Promise) {
  return knex('palettes')
    .del()
    .then(function() {
      return Promise.all([
        knex('projects').insert({
          project_name: 'autumn' }, 'id')
          .then(project => knex('palettes').insert([
            {id: 1, palette_name: 'leafy', color_1: }
          ])

        });
      ]);
};
