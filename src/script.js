const postImg = document.querySelector(".photo-main");
postImg.src = post.pathToPostImg;

const photoTitle = document.querySelector(".photo-title");
photoTitle.innerHTML = post.title;

const photoDescr = document.querySelector(".photo-descr");
photoDescr.innerHTML = "<b>Краткое описание: </b>" + post.description;

const photoDate = document.querySelector(".photo-date");

function getNormalDate(date) {
    let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    let month = date.getMonth() < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1);
    let year = date.getFullYear();
    return day + "." + month + "." + year;
}

photoDate.innerHTML = "<b>Дата съемки: </b>" + getNormalDate(post.date);

const photoLikes = document.querySelector(".likes-count");
photoLikes.innerHTML = post.likes;

const likeButton = document.querySelector(".like-btn");
let evenClick = false;
likeButton.addEventListener("click", () => {
    if (!evenClick) {
        post.likes += 1;
        photoLikes.innerHTML = post.likes;
        evenClick = true;
        likeButton.classList("active");
    }
    post.likes -= 1;
    photoLikes.innerHTML = post.likes;
    evenClick = false;
    likeButton.classList("active");
});

const photoComments = document.querySelector(".comments-count");
photoComments.innerHTML = post.comments.length;

const photoTags = document.querySelector(".tags-block");
for (const tag of post.tags) {
    const inner = document.createElement("a");
    inner.href = "#";
    inner.innerHTML = tag;
    photoTags.appendChild(inner);
}

const comments = document.querySelector(".main-comments");

function createComment(comment) {
    const li = document.createElement("li");
    
    const divComment = document.createElement("div");
    divComment.classList.add("comment");

    if (comment.children){
        divComment.classList.add("with-subcomments");
    }
    
    const img = document.createElement("img");
    img.src = comment.pathToUserImg;
    img.alt = "avatar";
    
    const divCommentInfo = document.createElement("div");
    divCommentInfo.classList.add("comment-info");
    
    const spanDate = document.createElement("span");
    const spanUserName = document.createElement("span");
    const spanComment = document.createElement("span");
    
    spanDate.innerHTML = getNormalDate(comment.date);
    spanUserName.innerHTML = comment.userName;
    spanComment.innerHTML = comment.description;
    
    divCommentInfo.appendChild(spanUserName);
    divCommentInfo.appendChild(spanDate);
    divCommentInfo.appendChild(spanComment);
    divComment.appendChild(img);
    divComment.appendChild(divCommentInfo);
    li.appendChild(divComment);
    
    return li;
}

let commentsCount = 0;
let postCommentsCopy = post.comments;

function appendComments(comments, commentsUl, comCount){
    for (const objComment of comments) {
        if(comCount === 0 || postCommentsCopy.length == 0) {
            return;
        }
        comCount -= 1;
        postCommentsCopy = postCommentsCopy.filter((e) => e != objComment);
        if (objComment.children) {
            const subcommentsUl = document.createElement("ul");
            subcommentsUl.classList.add("subcomments");
            subcommentsUl.style.display = "none";
            
            const subcomment = createComment(objComment);
            
            appendComments(objComment.children, subcommentsUl);
            subcomment.appendChild(subcommentsUl);
            showHide(subcomment, subcommentsUl);
            commentsUl.appendChild(subcomment);
        } else {
            const comment = createComment(objComment);
            commentsUl.appendChild(comment);  
        }
    }
}

function showHide(comment, subcommentsUl){
    comment.addEventListener("click", () => {
        if (subcommentsUl.style.display == "block"){
            subcommentsUl.style.display = "none";
        } else {
            subcommentsUl.style.display = "block";
        }
    });
}

document.addEventListener("scroll", () => {
    if(window.scrollY + 1 >= document.documentElement.scrollHeight - document.documentElement.clientHeight) {
        appendComments(postCommentsCopy, comments, 10);
    }
});

appendComments(postCommentsCopy, comments, 10);