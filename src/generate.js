const title = document.querySelector('title');
const photo = document.querySelector('.photo');
const mainTitle = document.querySelector('.title');
const descriptionBlock = document.querySelector('.description');
const likeCount = document.querySelector('.like-count');
const commentCount = document.querySelector('.comment-count');
const tagsBlock = document.querySelector('.tags');
const commentBlock = document.querySelector('.comments');
console.log(post);

/**
 * Get the format date
 * Получить дату в человеко-читаемом формате
 * @param date
 * @param withTime - флаг: нужно ли указывать время
 * @returns {string}
 */
const getFormatDate = (date, withTime = false) => {
    console.log(date);
    if (!date instanceof Date) {
        throw new Error('Передан не объект даты!');
    }
    if (withTime) {
        const resultDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
        const resultMonth = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : date.getDate() + 1;
        const resultYear = date.getFullYear();
        const resultHour = date.getHours();
        const resultMinutes = date.getMinutes();
        return `${resultDate}.${resultMonth}.${resultYear} - ${resultHour}:${resultMinutes}`;
    }
    const resultDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    const resultMonth = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : date.getDate() + 1;
    const resultYear = date.getFullYear();
    return `${resultDate}.${resultMonth}.${resultYear}`;
}

/**
 * Get comment node-template
 * Получить шаблон комментария
 * @returns {Node}
 */
const getCommentNode = () => {
    const commentNode = document.querySelector('#comment');
    return commentNode.content.cloneNode(true);
}

/**
 * To generate comment
 * Сгенерировать комментарий
 * @param comment - комментарий
 * @param commentAnswer - флаг: является ли комментарий - ответом
 */
const buildComment = (comment, commentAnswer = false) => {
    const commentNode = getCommentNode();
    const avatar = commentNode.querySelector('.avatar');
    const text = commentNode.querySelector('.text');
    const author = commentNode.querySelector('.author');
    const dateTime = commentNode.querySelector('.dateTime');
    avatar.children[0].src = comment.pathToUserImg;
    text.textContent = comment.description;
    author.textContent = comment.userName;
    dateTime.textContent = getFormatDate(comment.date, true);
    if (commentAnswer) {
        commentNode.querySelector('.comment').classList.add('comment-answer');
    }
    commentBlock.appendChild(commentNode);
}

/**
 * To generate comments
 * Основной метод для генерации комментариев
 */
const generateComments = () => {
    let commentsCount = 0;
    for (const comment of post.comments) {
        if (commentsCount >= 5) {
            break;
        }
        buildComment(comment);
        commentsCount++;
        if (comment.hasOwnProperty('children')) {
            for (const commentAnswer of comment.children) {
                if (commentsCount >= 5) {
                    break;
                }
                buildComment(commentAnswer, true);
                commentsCount++;
            }
        }
    }
}

/**
 * Main method for generating document
 * Основной метод для генерации документа
 */
const generate = () => {
    const description = document.createElement('p');
    const likesCountData = document.createElement('p');
    const commentsCountData = document.createElement('p');
    const date = document.createElement('data');
    title.innerText, mainTitle.innerText = post.title;
    photo.children[0].src = post.pathToPostImg;
    description.innerText = post.description;
    date.textContent = getFormatDate(post.date);
    descriptionBlock.append(description);
    descriptionBlock.append(date);
    likesCountData.innerText = post.likes;
    commentsCountData.innerText = post.comments.length;
    likeCount.append(likesCountData);
    commentCount.append(commentsCountData);
    post.tags.forEach((tag) => {
        const tagNode = document.querySelector('#tag');
        const cloneTagNode = tagNode.content.cloneNode(true);
        const p = cloneTagNode.querySelector('.tag');
        p.innerText = tag;
        tagsBlock.append(p);
    });
    generateComments();
}


generate();