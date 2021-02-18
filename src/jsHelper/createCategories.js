export default function createCategories(portalData, locale) {
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
        FinalARRAY.push({ title: availableCategories[indexOfavailableCategory].display_name[locale] });
      }
    });
    const tiles = [];
    const definedTilesInCategory = cnCategoryInContent[1];

    definedTilesInCategory.forEach((definedTile, indexOfdefinedTile) => {
      const cnStringOfDefinedTile = definedTile.split(',');
      const cnLabelOfDefinedTile = cnStringOfDefinedTile[0];
      availableTiles.forEach((availableTile, indexOfAvailableTile) => {
        const cnOfAvailableTile = availableTile.dn.split(',');
        if (cnLabelOfDefinedTile === cnOfAvailableTile[0]) {
          const tile = {
            title: availableTile.name[locale],
            link: availableTile.links[0],
            description: availableTile.description[locale],
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
