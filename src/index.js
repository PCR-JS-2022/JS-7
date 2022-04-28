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

document.querySelector('.title').innerText = post.title;
document.querySelector('.postImg').src = post.pathToPostImg;
document.querySelector('.date').innerText = post.date.toLocaleDateString();
document.querySelector('.description_text').innerText = post.description;
document.querySelector('.likeCount').innerText = post.likes;
let tags = document.querySelector('.tags');
for (let el of post.tags) {
  let tag = document.createElement('span');
  tag.innerText = el;
  tags.append(tag);
};

function addComment(newComment) {
  const comment = document.createElement('div');
  comment.className = "comment";

  const userPic = document.createElement('img');
  profilePic.className = "userPic";
  profilePic.src = newComment.pathToUserImg;
  comment.appendChild(userPic);

  const userName = document.createElement('span');
  profileName.className = "userName";
  profileName.innerText = newComment.userName;
  comment.appendChild(userName);

  const commentDate = document.createElement('span');
  commentTime.className = "commentDate";
  commentTime.innerText = newComment.date.toLocaleDateString();
  comment.appendChild(commentDate);

  var br = document.createElement('br');
  comment.appendChild(br);

  const commentText = document.createElement('p');
  commentText.className = "commentText";
  commentText.innerText = newComment.description;
  comment.appendChild(commentText);

  if (newComment.children) {
    const subcomment = document.createElement('div');
    subcomment.className = "subcomment";
    comment.appendChild(subcomment);
    for (let el of newComment.children) {
      subcomment.appendChild(addComment(el))
    };
  }
  return comment;
}


let commentCount = 0;
showBottomComments(0, post);
let startIndex = 5;

function showBottomComments(startIndex, post) {
  let lastIndex = startIndex + 5;
  if (lastIndex > post.comments.length) {
    lastIndex = post.comments.length;
  };

  for (let i = startIndex; i < lastIndex; i++) {
    document.querySelector('.comments').appendChild(addComment(post.comments[i]));
    commentCount++;
  }
}

function showTopComments(startIndex, post) {
  if (startIndex < 55) {
    startIndex = 55;
  }

  for (let i = startIndex - 51; i > startIndex - 56; i--) {
    document.querySelector('.comments').prepend(addComment(post.comments[i]));
    commentCount++;
  }
}

window.addEventListener('scroll', () => {
  if (document.body.scrollHeight - document.body.scrollTop === document.body.clientHeight) {
    while (commentCount > 50) {
      document.querySelector('.comments').removeChild(document.querySelector('.comments').firstChild);
      commentCount--;
    }
    if (startIndex < post.comments.length - 5) {
      showBottomComments(startIndex, post);
      startIndex += 5;
    }
  }

  if (document.body.scrollTop === 0 && commentCount >= 50) {
    while (commentCount > 50) {
      document.querySelector('.comments').removeChild(document.querySelector('.comments').lastChild);
      commentCount--;
    }
    if (startIndex > 50) {
      showTopComments(startIndex, post);
      startIndex -= 5;
    }
  }
})
