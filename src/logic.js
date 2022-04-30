//const remainingComments = [...post.comments];

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
    const date = createContentElement('span', e.date.toLocaleDateString());
    const description = createContentElement('p', e.description);
    const content = createElementWithChilds('article', userName, date, description);
    const img = document.createElement('img');
    img.src = e.pathToUserImg;

    const commentBlock = createElementWithChilds('div', img, content);

    if(e.children) return createCommentWithChilds(e, commentBlock);

    return createElementWithChilds('li', commentBlock);
}

const createCommentWithChilds = (e, commentBlock) => {
    const childrenArr = e.children.map((x) => createComment(x));
    const children = createElementWithChilds('ul', ...childrenArr);
    const comment = createElementWithChilds('li', commentBlock, children);
    comment.classList.add('comment-with-children');

    addFallingComments(comment, children);

    return comment;
}

const createCountComments = (first, step) => {
    const commentsArr = [];
    const indexOfLast = post.comments.length > first + step ? first + step : post.comments.length;

    for (let i = first; i < indexOfLast; i++){
        commentsArr.push(createComment(post.comments[i]));
    }

    firstCommIndex += step;
    return commentsArr;
}

const countComments = () => 
    post.comments.reduce((sum, cur) => 
        cur.children ? cur.children.length + sum : sum, post.comments.length);

const postImg = qSel('.photo-preview');
const tagsBlock = qSel('.tags');
const commentsTable = qSel('.comments-table');

postImg.alt = post.id;
postImg.src = post.pathToPostImg;
inner('.title', post.title);
inner('.description', post.description);
inner('.date', `Дата съемки: ${post.date.toLocaleDateString()}`);
inner('.likes-count', post.likes);
inner('.comments-count', countComments());

post.tags.forEach(e => {
    const tag = createContentElement('span', e);
    tag.classList.add('tag');
    tagsBlock.appendChild(tag);
});

const step = 10;
let firstCommIndex = 0;
const commentsArr = createCountComments(firstCommIndex, step);
commentsArr.forEach(e => commentsTable.appendChild(e));

document.addEventListener("scroll", () => {
    if(window.scrollY + 1 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        const commentsArr = createCountComments(firstCommIndex, step);
        commentsArr.forEach(e => commentsTable.appendChild(e));
    }
});