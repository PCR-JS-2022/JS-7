"use strict";

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
    tags: Array.from({length: 10}, (_, index) => `Tag ${index + 1}`),
    likes: 12,
    comments: Array.from({length: 111}, (_, index) => {
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

const newDate = (date) => {
    return date.toLocaleDateString();

}

function getTags() {
    let result = [];

    for (let i = 0; i < post.tags.length; i++) {
        let tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = post.tags[i];
        result.push(tag);
    }

    return result;
}

function getCommentCount() {
    let count = 0;
    post.comments.forEach(c => {
        count = c.children ? count + 1 + c.children.length : count + 1;
    })
    return count.toString();
}

function createComment(content) {
    let comment = document.createElement('div');
    comment.className = 'comment';
    if (content.children) {
        comment.classList.add('close');
        comment.addEventListener('click', () => {
            if (comment.classList.contains("close")) {
                comment.nextSibling.style.display = "block";
                comment.style.cursor = "pointer";
                comment.classList.remove("close");
            } else {
                comment.nextSibling.style.display = "none";
                comment.classList.add("close");
            }
        })
    }

    let imageBlock = document.createElement('div');
    imageBlock.className = 'image-block';

    let image = document.createElement('img');
    image.className = 'avatar';
    image.src = content.pathToUserImg;

    imageBlock.append(image);

    let userName = document.createElement('span');
    userName.className = 'userName';
    userName.innerHTML = content.userName;

    let commentDate = document.createElement('span');
    commentDate.className = 'comment-date';
    commentDate.innerHTML = newDate(content.date);

    let message = document.createElement('p');
    message.className = 'message';
    message.innerHTML = content.description;
    comment.append(...[imageBlock, userName, commentDate, message]);

    return comment;
}

let commentsCount = 0;

function getComments(limit, arr) {
    let result = [];
    let end = commentsCount + limit > post.comments.length ? post.comments.length : commentsCount + limit;
    for (let i = commentsCount; i < end; i++) {
        result.push(createComment(arr[i]));
        if (arr[i].children) {
            let reply = document.createElement('div');
            let r = []
            reply.className = 'reply-block';
            for (let j = 0; j < arr[i].children.length; j++) {
                r.push(createComment(arr[i].children[j]));
            }
            reply.append(...r);
            result.push(reply);
        }
    }
    return result;
}

document.querySelector('.description').innerHTML = `Описание: ${post.description}`;
document.querySelector('.title').innerHTML = post.title;
document.querySelector('.date').innerHTML = `Дата съемки: ${newDate(post.date)}`;
document.querySelector('.like-count').innerHTML = post.likes;
document.querySelector('.comment-count').innerHTML = getCommentCount();
document.querySelector('.picture').src = post.pathToPostImg;
document.querySelector('.tags-block').append(...getTags());
document.querySelector('.comments-block').append(...getComments(10, post.comments));

document.addEventListener("scroll", () => {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 300) {
        commentsCount += 10;
        document.querySelector('.comments-block').append(...getComments(10, post.comments));
    }
});