function getCategoriesFromDefinition(definition) {
  const categories = [];
  definition.forEach((element) => {
    const categoryDefinition = element[0].split(',');
    const category = categoryDefinition[0];
    categories.push(category);
  });

  return categories;
}
function getTileArray(portalContent, tiles, locale) {
  portalContent.forEach((element, index) => {
    element[1].forEach((tileInfo, tileInfoIndex) => {
      const tileInfoArray = tileInfo.split(',');
    });
  });
}

export default function createCategories(portalData, locale) {
  const portalContent = portalData.portal.content;
  const availableCategories = portalData.categories;
  const availableTiles = portalData.entries;

  const categoryStrings = getCategoriesFromDefinition(portalContent);

  const finalCategories = categoryStrings.map((element) => {
    const usedCategories = availableCategories.filter((category) => category.dn.includes(element));
    const categoryName = usedCategories[0].display_name;
    return categoryName[locale];
  });
  // getTileArray(portalContent, tiles, locale);
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
    console.log('tiles', tiles);
  });
  console.log(FinalARRAY);
  return FinalARRAY;
}
