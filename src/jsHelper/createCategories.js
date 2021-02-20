export default function createCategories(portalData) {
  const portalContent = portalData.portal.content;
  const availableCategories = portalData.categories;
  const availableTiles = portalData.entries;

  const FinalARRAY = [];
  portalContent.forEach((cnCategoryInContent, index) => {
    const cnCategoryDefinitions = cnCategoryInContent[0].split(',');
    const cnCategoryDefinition = cnCategoryDefinitions[0];
    availableCategories.forEach((availableCategory, indexOfavailableCategory) => {
      const dnOfAvailableCategory = availableCategory.dn.split(',');
      const categoryDn = dnOfAvailableCategory[0];
      // add catagories that are defined in content
      if (cnCategoryDefinition === categoryDn) {
        FinalARRAY.push({
          title: {
            de_DE: availableCategories[indexOfavailableCategory].display_name.de_DE,
            en_US: availableCategories[indexOfavailableCategory].display_name.en_US,
          },
        });
      }
    });
    const tiles = [];
    const definedTilesInCategory = cnCategoryInContent[1];

    definedTilesInCategory.forEach((definedTile) => {
      const cnStringOfDefinedTile = definedTile.split(',');
      const cnLabelOfDefinedTile = cnStringOfDefinedTile[0];
      availableTiles.forEach((availableTile) => {
        const cnOfAvailableTile = availableTile.dn.split(',');
        if (cnLabelOfDefinedTile === cnOfAvailableTile[0]) {
          const tile = {
            title: {
              de_DE: availableTile.name.de_DE,
              en_US: availableTile.name.en_US,
            },
            link: availableTile.links,
            description: {
              de_DE: availableTile.description.de_DE,
              en_US: availableTile.description.en_US,
            },
            pathToLogo: availableTile.logo_name,
          };
          tiles.push(tile);
        }
      });
    });
    FinalARRAY[index].tiles = tiles;
  });

  return FinalARRAY;
}
