import './drag-drop.sass';

const element = document.querySelector('#drag-drop');
const items = document.querySelectorAll('#drag-drop li');

// Init

[...items].map(item => {
  item.setAttribute('draggable', 'true');
});

// Events

element.addEventListener('dragstart', event => {
  const startX = event.clientX;
  const startY = event.clientY;

  event.target.classList.add('dragged');
  event.dataTransfer.setData('text', `${startX} ${startY}`);
});

element.addEventListener('dragend', event => {
  event.target.classList.remove('dragged');
});

element.addEventListener('drag', event => {
  const wrapperRect = element.getBoundingClientRect();
  const wrapperTop = wrapperRect.top;
  const wrapperBottom = wrapperRect.bottom;
  const mouseY = event.clientY;
  const itemHeight = event.target.clientHeight;

  let itemTop = mouseY - wrapperTop - (itemHeight / 2);

  // prevent dragging beyond
  if (mouseY - 10 < wrapperTop) itemTop = 0;
  else if (mouseY + 10 > wrapperBottom) itemTop = wrapperBottom - wrapperTop - itemHeight - itemHeight / 2;

  event.target.style.top = `${itemTop}px`;
});

element.addEventListener('dragover', event => {
  event.preventDefault();
  // console.log('dragover');
});

element.addEventListener('dragenter', event => {
  // console.log('dragenter');
});

element.addEventListener('drop', event => {
  const x = event.clientX;
  const y = event.clientY;

  // console.log(event.dataTransfer.getData('text'));
});
