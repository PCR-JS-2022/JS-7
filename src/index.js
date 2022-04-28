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

//Пост
document.querySelector('.postImg').src = post.pathToPostImg
document.querySelector('.postTitle').textContent = post.title
document.querySelector('.PostText').textContent = post.description
document.querySelector('.PostDate').textContent = post.date.toLocaleDateString('ru-RU')
document.querySelector('.likeCount').textContent = post.likes
document.querySelector('.commentCount').textContent = post.comments.length
post.tags.forEach(element => {
  const a = document.createElement('a')
  a.textContent = element
  document.querySelector('.postTags').appendChild(a)
});



function createComment(newComment) {
  //Блок Комментария
  const comment = document.createElement('div')
  comment.className = "comment"

  //Коментарий
  const commentPlace = document.createElement('div')
  commentPlace.className = "commentPlace"
  comment.appendChild(commentPlace)

  //Аватар Комментатора
  const profilePic = document.createElement('img')
  profilePic.className = "profilePic"
  profilePic.src = newComment.pathToUserImg
  commentPlace.appendChild(profilePic)

  //Информация в Комментарии
  const commentInfo = document.createElement('div')
  commentInfo.className = "commentInfo"
  commentPlace.appendChild(commentInfo)

  //Имя комментрария
  const profileName = document.createElement('h3')
  profileName.className = "commentInfo"
  profileName.textContent = newComment.userName
  commentInfo.appendChild(profileName)

  //Текст комментария
  const commentText = document.createElement('p')
  commentText.className = "commentInfo"
  commentText.textContent = newComment.description
  commentInfo.appendChild(commentText)

  //Дата комментария
  const commentTime = document.createElement('p')
  commentTime.className = "commentInfo"
  commentTime.textContent = newComment.date.toLocaleDateString('ru-RU')
  commentInfo.appendChild(commentTime)

  //Подкомментарии
  if (newComment.children) {
    commentPlace.classList.add('greybox')
    const subcomment = document.createElement('div')
    subcomment.className = "subcomment"
    subcomment.classList.add('hidden')
    comment.appendChild(subcomment)
    newComment.children.forEach(element => {
      subcomment.appendChild(createComment(element))
    });
    commentPlace.addEventListener('click',() => {
      subcomment.classList.toggle('hidden')
      commentPlace.classList.toggle('greybox')
    })
  }
  return comment
}


let commentCount = 0
displayBottomComments(0, post)
let startIndex = 5

//Показывает нижние комментарии при прокрутке вниз
function displayBottomComments(startIndex, post) {
  let lastIndex = startIndex + 5
  if (lastIndex > post.comments.length) {
    lastIndex = post.comments.length
  }

  for (let i = startIndex; i < lastIndex; i++) {
    document.querySelector('.comments').appendChild(createComment(post.comments[i]))
    commentCount++
  }
}

//Скрывает верхние комментарии при прокрутке вниз
function cleanTopComments() {
  while (commentCount > 50) {
    document.querySelector('.comments').removeChild(document.querySelector('.comments').firstChild)
    commentCount--
  }
}

//Прокрутка вниз
function uppdateCommentsDown() {
  if (commentCount > 50) {
    cleanTopComments()
  }
  if (startIndex < post.comments.length - 5){
  displayBottomComments(startIndex, post)
    startIndex += 5
  }
}

//Показывает верхние комментарии при прокрутке вверх
function displayTopComments(startIndex, post) {
  if (startIndex < 55) {
    startIndex = 55
  }

  for (let i = startIndex -51; i > startIndex-56; i--) {
    document.querySelector('.comments').prepend(createComment(post.comments[i]))
    commentCount++
  }
}

//Скрывает нижние комментарии при прокрутке вверх
function cleanBottomComments() {
  while (commentCount > 50) {
    document.querySelector('.comments').removeChild(document.querySelector('.comments').lastChild)
    commentCount--
  }
}

//Прокрутка вверх
function uppdateCommentsUp() {
  cleanBottomComments()
  if (startIndex > 50){
  displayTopComments(startIndex, post)
    startIndex -= 5
  }
}

//проверка на граничные значения скролла
window.addEventListener("scroll", () => {
  if (document.body.scrollHeight - document.body.scrollTop === document.body.clientHeight) {
    uppdateCommentsDown()
  }
  
  if (document.body.scrollTop === 0 && commentCount >= 50){
    uppdateCommentsUp()
  }
})
