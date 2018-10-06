exports.seed = function(knex, Promise) {
  return knex('palettes')
    .del()
    .then(function() {
      return Promise.all([
        knex('projects')
          .insert(
            {
              project_name: 'autumn'
            },
            'id'
          )
          .insert({ project_name: 'berry' }, 'id')

          .then(project =>
            knex('palettes').insert([
              {
                palette_name: 'leafy',
                color_1: '#FC5D14',
                color_2: '#FF7A32',
                color_3: '#F0B67F',
                color_4: '#00CFC1',
                color_5: '#00FFE7',
                project_id: project[0]
              },
              {
                palette_name: 'ruby',
                color_1: '#FF0000',
                color_2: '#FF0000',
                color_3: '#FF0000',
                color_4: '#FF0000',
                color_5: '#FF0000',
                project_id: project[0]
              },
              {
                palette_name: 'eggwhite',
                color_1: '#F7F7F7',
                color_2: '#F7F7F7',
                color_3: '#F7F7F7',
                color_4: '#F7F7F7',
                color_5: '#F7F7F7',
                project_id: project[0]
              },
              {
                palette_name: 'goldenrod',
                color_1: '#FFD700',
                color_2: '#FFD700',
                color_3: '#FFD700',
                color_4: '#FFD700',
                color_5: '#FFD700',
                project_id: project[0]
              }
            ])
          )
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log(`Error seeding data: ${error}`))
      ]);
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
