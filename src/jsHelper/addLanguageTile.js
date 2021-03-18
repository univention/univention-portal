export default function createMenuStructure(portalLanguageData) {
  const menuTitle = {
    de_DE: 'Sprache ändern',
    en_US: 'Change Language',
    fr_FR: 'Changer de langue',
  };

  const subMenuItems = portalLanguageData.map((element) => ({
    title: element.title,
    linkTarget: 'internalFunction',
    internalFunction: (tileClick) => {
      tileClick.$store.dispatch('locale/setLocale', element.locale);
      return false;
    },
    links: [],
  }));

  const menuElement = {
    title: menuTitle,
    subMenu: subMenuItems,
  };
  return menuElement;
}
