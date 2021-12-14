export default function (inFolder) {
  let draggableElements;
  if (inFolder) {
    const folderContainer = document.querySelector('.portal-folder__thumbnails--in-modal');
    draggableElements = folderContainer.querySelectorAll('[draggable=true]');
  } else {
    draggableElements = document.querySelectorAll('[draggable=true]');
  }
  const draggableElementsClones = [];
  const appElement = document.getElementById('app');
  let container;
  if (!document.getElementById('cloneNodes')) {
    container = document.createElement('div');
    container.id = 'cloneNodes';
    appElement.after(container);
  } else {
    container = document.getElementById('cloneNodes');
  }
  draggableElements.forEach((key, index) => {
    draggableElementsClones[index] = draggableElements[index].cloneNode(true);
    draggableElementsClones[index].style.transform = 'rotate(0)';
    draggableElementsClones[index].style.position = 'absolute';
    draggableElementsClones[index].style.left = '-10000px';
    draggableElementsClones[index].id = `clone__${draggableElementsClones[index].id.toString()}`;
    if (draggableElementsClones[index].children[2]) {
      draggableElementsClones[index].removeChild(draggableElementsClones[index].children[2]);
    }
    container.append(draggableElementsClones[index]);
  });
}
