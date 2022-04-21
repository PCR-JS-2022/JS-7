const dialog = document.querySelector('dialog');

document.querySelector('button').addEventListener('click', () => {
  document.body.classList.add('modal-open');
  dialog.open = true;
});

const closeModal = () => {
  document.body.classList.remove('modal-open');
  dialog.open = false;
};
document.querySelector('.modal-close').addEventListener('click', closeModal);
dialog.addEventListener('click', e => {
  if (e.target.classList.contains('modal-wrapper')) {
    closeModal();
  }
});

document.querySelector('button:last-child').addEventListener('click', e => {
  const commentText = prompt('Add comment');
  const commentName = prompt('Enter your name');
  if (!commentText || !commentName) {
    return;
  }

  const date = new Date();
  const isoDate = date.toISOString().slice(0, 10);
  const day = date.getDate();
  const month = date.toLocaleDateString('en', {month: 'long'}).slice(0, 3);
  const year = date.getFullYear();

  const comment = document.createElement('li');
  comment.innerHTML = `
    <img src="https://i.pravatar.cc/43?u=${commentName.replace(' ', '')}" alt="avatar">
    <header>
      <strong>${commentName}</strong>
      <time datetime="${isoDate}">${day}-${month}-${year}</time>
    </header>
    <p>${commentText}</p>
  `;
  document.querySelector('section > ul').prepend(comment);

  const counter = document.querySelector('button + span > span');
  counter.innerHTML = +counter.innerHTML + 1;
});
