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

document.title = post.title;
document.querySelector('.post-title').innerHTML = post.title;

const postImg = document.createElement('img');
postImg.src = post.pathToPostImg;
postImg.alt = post.title;
document.querySelector('.post-img').prepend(postImg);

const postDate = document.createElement('time');
postDate.innerHTML = post.date.toLocaleDateString();
postDate.dateTime = post.date.toISOString().slice(0, 10);
document.querySelector('.post-img figcaption').prepend(postDate);

document.querySelector('.post-id').innerHTML = post.id;
document.querySelector('.post-description').innerHTML = post.description;

const postTags = document.querySelector('.post-tags');
for (const tag of post.tags) {
  const postTag = document.createElement('span');
  postTag.innerHTML = tag;
  postTags.append(postTag);
}

const postLikes = document.createElement('span');
postLikes.innerHTML = post.likes;
document.querySelector('.likes-btn').append(postLikes);

const commentsCount = document.createElement('span');
commentsCount.innerHTML = post.comments.length
  + post.comments.reduce(
    (count, comment) => comment.children
      ? count + comment.children.length
      : count,
    0,
  );
document.querySelector('.comments-count').append(commentsCount);

const postComments = document.querySelector('.post-comments');

const commentLoader = new CommentLoader(10, postComments);
commentLoader.appendComments();
