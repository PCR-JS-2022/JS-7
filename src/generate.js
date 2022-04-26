const title = document.querySelector('title');
const photo = document.querySelector('.photo');
const mainTitle = document.querySelector('.title');
const descriptionBlock = document.querySelector('.description');
const likeCount = document.querySelector('.like-count');
const commentCount = document.querySelector('.comment-count');
const tagsBlock = document.querySelector('.tags');


/**
 * Get the format date
 * Получить дату в человеко-читаемом формате
 * @param date
 * @returns {string}
 */
function getFormatDate(date) {
    if (!date instanceof Date) {
        throw new Error('Передан не объект даты!');
    }
    const resultDate = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    const resultMonth = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : date.getDate() + 1;
    const resultYear = date.getFullYear();
    return `${resultDate}.${resultMonth}.${resultYear}`;
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
}


generate();