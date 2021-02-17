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
      console.log('tileInfoArray', tileInfoArray);
    });
  });
}

export default function createCategories(portalData, locale) {
  console.log('portalData', portalData);

  const portalContent = portalData.portal.content;
  const availableCategories = portalData.categories;
  const tiles = portalData.entries;
  console.log(portalContent);

  const categoryStrings = getCategoriesFromDefinition(portalContent);

  const finalCategories = categoryStrings.map((element) => {
    const usedCategories = availableCategories.filter((category) => category.dn.includes(element));
    const categoryName = usedCategories[0].display_name;
    return categoryName[locale];
  });
  console.log('test', finalCategories);

  getTileArray(portalContent, tiles, locale);
}
