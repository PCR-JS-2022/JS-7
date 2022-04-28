const title = document.querySelector('title');
const photo = document.querySelector('.photo');
const mainTitle = document.querySelector('.title');
const descriptionBlock = document.querySelector('.description');
const likeCount = document.querySelector('.like-count');
const commentCount = document.querySelector('.comment-count');
const tagsBlock = document.querySelector('.tags');
const commentsLayout = document.querySelector('.comments');
console.log(post);

/**
 * Get the format date
 * Получить дату в человеко-читаемом формате
 * @param date
 * @param withTime - флаг: нужно ли указывать время
 * @returns {string}
 */
const getFormatDate = (date, withTime = false) => {
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
 * @param commentNode
 * @param comment - комментарий
 * @param hasInnerComments - флаг: имеет ли комментарий дочерние комментарии
 * @param commentAnswer - флаг: является ли комментарий - ответом
 */
const buildComment = (comment, hasInnerComments = false, commentAnswer = false) => {
    const commentNode = getCommentNode();
    commentNode.querySelector('.avatar').children[0].src = comment.pathToUserImg;
    commentNode.querySelector('.text').textContent = comment.description;
    commentNode.querySelector('.author').textContent = comment.userName;
    commentNode.querySelector('.dateTime').textContent = getFormatDate(comment.date, true);
    if (commentAnswer) {
        commentNode.querySelector('.comment').classList.add('comment-answer');
    }
    if (hasInnerComments) {
        commentNode.querySelector('.comment').classList.add('has-inner-comments');
    }
    return commentNode;
}

/**
 * Get the total count of comments
 * Получить общее количество комментариев к посту
 * @returns {number}
 */
const gelAllCommentsCount = () => {
    let count = 0;
    post.comments.forEach((comment) => {
        count = (comment.hasOwnProperty('children')) ? count + 1 + comment.children.length : count + 1;
    })
    return count;
};

/**
 * To generate comments
 * Основной метод для генерации комментариев
 */
const generateComments = () => {
    const generatedComments = {};
    for (const comment of post.comments) {
        generatedComments[comment.id] = [];
        if (Object.keys(generatedComments).length > 5) {
            break;
        }
        if (comment.hasOwnProperty('children')) {
            generatedComments[comment.id].push(buildComment(comment, true, false));
            comment.children.forEach((commentAnswer) => {
                generatedComments[comment.id].push(buildComment(commentAnswer, false, true));
            })
            continue;
        }
        generatedComments[comment.id].push(buildComment(comment, false, false));
    }
    for (const comment in generatedComments) {
        const commentBlock = document.createElement('div');
        commentBlock.classList.add('comment-block');
        generatedComments[comment].forEach((comm) => {
            commentBlock.appendChild(comm);
        })
        commentsLayout.appendChild(commentBlock);
    }
}

const toOpenComments = () => {
    const commentNodes = document.getElementsByClassName('comment-block');
    Array.prototype.forEach.call(commentNodes, (commentNode) => {
        commentNode.addEventListener('click', () => {
            const commentsAnswer = commentNode.getElementsByClassName('comment-answer');
            Array.prototype.forEach.call(commentsAnswer, (com) => {
                if (getComputedStyle(com).display === 'none') {
                    com.style.display = 'block';
                } else {
                    com.style.display = 'none';
                }
            });
        });
    })
};

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
    commentsCountData.textContent = gelAllCommentsCount();
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
    toOpenComments();
}
generate();