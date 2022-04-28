let remainingComments = post.comments;

const qSel = (e) => document.querySelector(e);

const inner = (className, value) => {
    qSel(className).innerHTML = value;
}

const createContentElement = (tag, value) => {
    const element = document.createElement(tag);
    element.innerHTML = value;
    
    return element;
}

const createElementWithChilds = (tag, ...childs) => {
    const element = document.createElement(tag);
    childs.forEach(e => element.appendChild(e));

    return element;
}

const toNormalDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    const year = date.getFullYear();

    day = day < 10 ? `0${day}` : day;
    month = month < 10 ? `0${month}` : month;

    return `${day}.${month}.${year}`;
}

const addFallingComments = (comment, subcomments) => {
    comment.addEventListener("click", () => {
        if (subcomments.style.display == "block"){
            subcomments.style.display = "none";
        } else {
            subcomments.style.display = "block";
        }
    });
};

const createComment = (e) => {
    const userName = createContentElement('span', e.userName);
    const date = createContentElement('span', toNormalDate(e.date));
    const description = createContentElement('p', e.description);
    const content = createElementWithChilds('article', userName, date, description);
    const img = document.createElement('img');
    img.src = e.pathToUserImg;

    const commentBlock = createElementWithChilds('div', img, content);

    if(e.children){
        const childrenArr = e.children.map((x) => createComment(x));
        const children = createElementWithChilds('ul', ...childrenArr);
        const comment = createElementWithChilds('li', commentBlock, children);
        comment.classList.add('comment-with-children');

        addFallingComments(comment, children);

        return comment;
    }

    const comment = createElementWithChilds('li', commentBlock);

    return comment;
}

const createCountComments = (count) => {
    const commentsArr = [];
    for (let i = 0; i < count; i++){
        commentsArr.push(createComment(remainingComments[i]));
    }

    remainingComments.splice(0, 10);
    return commentsArr;
}

const postImg = qSel('.photo-preview');
const tagsBlock = qSel('.tags');
const commentsBlock = qSel('.comments-block');

postImg.alt = post.id;
postImg.src = post.pathToPostImg;
inner('.title', post.title);
inner('.description', post.description);
inner('.date', `Дата съемки: ${toNormalDate(post.date)}`);
inner('.likes-count', post.likes);
inner('.comments-count', post.comments.length);

post.tags.forEach(e => {
    const tag = createContentElement('span', e);
    tag.classList.add('tag');
    tagsBlock.appendChild(tag);
});

const commentsArr = createCountComments(10);
const comments = createElementWithChilds('ul', ...commentsArr);
commentsBlock.appendChild(comments);

document.addEventListener("scroll", () => {
    if(window.scrollY + 1 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        const commentsArr = createCountComments(10);
        const comments = createElementWithChilds('ul', ...commentsArr);
        commentsBlock.appendChild(comments);
    }
});