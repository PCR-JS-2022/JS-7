const title = document.querySelector('title');
const photo = document.querySelector('.photo');
const mainTitle = document.querySelector('.title');
const descriptionBlock = document.querySelector('.description');
const likeCount = document.querySelector('.like-count');
const commentCount = document.querySelector('.comment-count');
const tagsBlock = document.querySelector('.tags');

/**
 * Main method for generating document
 * Основной метод для генерации документа
 */
const generate = () => {
    const description = document.createElement('p');
    const likesCountData = document.createElement('p');
    const commentsCountData = document.createElement('p');
    title.innerText, mainTitle.innerText = post.title;
    photo.children[0].src = post.pathToPostImg;
    description.innerText = post.description;
    descriptionBlock.append(description);
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