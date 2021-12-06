export default function(inFolder) {
  let draggableElements;
  if (inFolder) {
    const folderContainer = document.querySelector('.portal-folder__thumbnails--in-modal');
    draggableElements = folderContainer.querySelectorAll('[draggable=true]');
    console.log('folderContainer', draggableElements);
  } else {
    draggableElements = document.querySelectorAll('[draggable=true]');
  }
  const draggableElementsClones = [];
  const appElement = document.getElementById('app');
  const container = document.createElement('div');
  appElement.after(container);
  draggableElements.forEach((key, index) => {
    draggableElementsClones[index] = draggableElements[index].cloneNode(true);
    draggableElementsClones[index].style.transform = 'rotate(0)';
    draggableElementsClones[index].style.position = 'absolute';
    draggableElementsClones[index].style.left = '-10000';
    console.log(draggableElementsClones[index].id);
    draggableElementsClones[index].id = `clone__${draggableElementsClones[index].id.toString()}`;
    console.log(draggableElementsClones[index].children[2]);
    if (draggableElementsClones[index].children[2]) {
      draggableElementsClones[index].removeChild(draggableElementsClones[index].children[2]);
    }
    container.append(draggableElementsClones[index]);
  });
}
