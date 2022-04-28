const random3 = () => Math.floor(Math.random() * (4 - 1)) + 1;
const randomDate = () =>
  new Date(
    new Date("04-09-1999").getTime() +
      Math.random() * (new Date().getTime() - new Date("04-09-1999").getTime())
  );
const generateComment = (id) => ({
  id,
  userName: `Name ${id}`,
  description:
    "Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач.",
  pathToUserImg: `../public/img/user${random3()}.png`,
  date: randomDate(),
});

const post = {
  id: "postID:322",
  pathToPostImg: "../public/img/postImg.png",
  title: "Кот на учебе",
  description:
    "Идейные соображения высшего порядка, а также начало повседневной работы по формированию позиции требуют определения и уточнения позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что новая модель организационной деятельности обеспечивает широкому кругу (специалистов) участие в формировании существенных финансовых и административных условий. Повседневная практика показывает, что рамки и место обучения кадров представляет собой интересный эксперимент проверки соответствующий условий активизации. Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что начало повседневной работы по формированию позиции способствует подготовки и реализации форм развития. Повседневная практика показывает, что сложившаяся структура организации позволяет выполнять важные задания по разработке позиций, занимаемых участниками в отношении поставленных задач.",
  date: new Date("04-09-1998"),
  tags: Array.from({ length: 10 }, (_, index) => `Tag ${index + 1}`),
  likes: 12,
  comments: Array.from({ length: 111 }, (_, index) => {
    const comment = generateComment(index.toString());

    if (index % 3 === 0) {
      comment.children = new Array(3)
        .fill("")
        .map((_, childIndex) =>
          generateComment(index.toString() + childIndex.toString())
        );
    }

    return comment;
  }),
};

document.querySelector('.mainImg').src = post.pathToPostImg;
post.tags.forEach(x => {
  const tag = document.createElement('a');
  tag.textContent = x;
  document.querySelector('.tags').appendChild(tag);
})
document.querySelector('.title').textContent = post.title;
document.querySelector('.date').textContent = post.date.toLocaleDateString('ru-Ru');
document.querySelector('.descText').textContent = post.description;
document.querySelector('.likeCount').textContent = post.likes;
document.querySelector('.commentCount').textContent = post.comments.length;

function createComment(comment) {
  const commentBlock = document.createElement('div');
  commentBlock.classList.add('comment');

  const container = document.createElement('div');
  container.classList.add('container');
  commentBlock.appendChild(container);

  const avatar = document.createElement('img');
  avatar.classList.add('avatar');
  avatar.src = comment.pathToUserImg;
  container.appendChild(avatar);

  const commentContent = document.createElement('div');
  commentContent.classList.add('commentContent');
  container.appendChild(commentContent);

  const userName = document.createElement('h3');
  userName.classList.add('userName');
  userName.textContent = comment.userName;
  commentContent.appendChild(userName);

  const commentDate = document.createElement('p');
  commentDate.classList.add('commentDate');
  commentDate.textContent = comment.date.toLocaleDateString('ru-RU');
  commentContent.appendChild(commentDate);

  const commentText = document.createElement('p');
  commentText.classList.add('commentText');
  commentText.textContent = comment.description;
  commentContent.appendChild(commentText);

  if (comment.children) {
    commentBlock.classList.add('hasInvis');
    const subBlock = document.createElement('article');
    subBlock.classList.add('subCommentContainer');
    subBlock.classList.add('invisible');
    commentBlock.appendChild(subBlock);
    comment.children.forEach(x => {
      subBlock.appendChild(createComment(x));
    });
    container.addEventListener('click', () => {
      subBlock.classList.toggle('invisible');
      commentBlock.classList.toggle('hasInvis');
    });
  }

  return commentBlock;
}

let start = 0;
let counter = 0;
function displayTenComments(start, post) {
  let end = start + 10;
  if (post.comments.length < end){
    end = post.comments.length;
  }
  for (let i = start; i < end; i++, counter++) {
    document.querySelector('.commentContainer').appendChild(createComment(post.comments[i]));
  }
  start = end + 1;
}


displayTenComments(start, post);

