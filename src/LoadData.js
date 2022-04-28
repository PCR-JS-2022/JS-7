import {post} from "./index.js";

function addLeadZero(val) {
    if (val < 10) return '0' + val;
    return val;
}

function loadGeneralData() {
    document.querySelector("h2").innerText = post.title;
    document.querySelector(".article-photo").setAttribute("src",post.pathToPostImg);
    document.querySelector(".date").textContent = `Дата съемки:
        ${addLeadZero(post.date.getDate())}.`+
        `${addLeadZero(post.date.getMonth()+1)}`+
        `.${addLeadZero(post.date.getFullYear())}`;
    document.querySelector(".description").textContent = `${post.description}`;
    document.querySelector(".like-counter").textContent = `${post.likes}`;

    for (let i in post.tags) {
        let tag = document.createElement("span");
        tag.innerText = post.tags[i];
        document.querySelector(".tag").appendChild(tag);
    }

    for (let i in post.tags) {
        let tag = document.createElement("span");
        tag.innerText = post.tags[i];
        document.querySelector(".mobile-tag").appendChild(tag);
    }
}

function loadComments(start,step) {
    for (let i=start;i<start+step;i++) {
        let flag = true;
        let comments = document.querySelector(".comments");
        let name = document.createElement("p");
        let dateComment = document.createElement("p");
        let descriptionComment = document.createElement("p");
        let li = document.createElement("li");
        let subComments = document.createElement("ul");
        let comment = document.createElement("div");
        let commentInfo = document.createElement("div");
        let avatarWrapper = document.createElement("div");
        let avatar = document.createElement("div");
        let photoAvatar = document.createElement("img");
        comment.className = 'comment';
        avatarWrapper.className = 'avatar-wrapper';
        avatar.className = 'avatar';
        commentInfo.className = 'comment-info';
        name.className = 'name';
        dateComment.className = 'date-comment';
        descriptionComment.className = 'description-comment';
        photoAvatar.className = 'photo-avatar';
        li.className = "counted";
        li.id = `id${post.comments[i].id}`
        photoAvatar.src = post.comments[i].pathToUserImg;
        comments.appendChild(li).appendChild(comment).appendChild(avatarWrapper).appendChild(avatar)
            .appendChild(photoAvatar);
        comment.appendChild(commentInfo);
        commentInfo.appendChild(name).textContent = `${post.comments[i].userName}`;
        commentInfo.appendChild(dateComment).textContent = `Дата:
        ${addLeadZero(post.comments[i].date.getDate())}.`+
            `${addLeadZero(post.comments[i].date.getMonth()+1)}`+
            `.${addLeadZero(post.comments[i].date.getFullYear())}`;
        commentInfo.appendChild(descriptionComment).textContent = `${post.comments[i].description}`;
        if (post.comments[i].hasOwnProperty("children")) {
            comment.className = "comment have-answers";
            li.appendChild(subComments);
            for (let j in post.comments[i].children) {
                let childName = document.createElement("p");
                let childDate = document.createElement("p");
                let childDescription = document.createElement("p");
                let childLi = document.createElement("li");
                let childComment = document.createElement("div");
                let childInfo = document.createElement("div");
                let childAvatarWrapper = document.createElement("div");
                let childAvatar = document.createElement("div");
                let childPhotoAvatar = document.createElement("img");
                childComment.className = 'comment';
                childAvatarWrapper.className = 'avatar-wrapper';
                childAvatar.className = 'avatar';
                childInfo.className = 'comment-info';
                childName.className = 'name';
                childDate.className = 'date-comment';
                childDescription.className = 'description-comment';
                subComments.className = `hidden`;
                childPhotoAvatar.className = 'photo-avatar';
                childPhotoAvatar.src = post.comments[i].children[j].pathToUserImg;
                subComments.appendChild(childLi).appendChild(childComment).appendChild(childAvatarWrapper)
                    .appendChild(childAvatar).appendChild(childPhotoAvatar);
                childComment.appendChild(childInfo);
                childInfo.appendChild(childName).textContent = `${post.comments[i].children[j].userName}`;
                childInfo.appendChild(childDate).textContent = `Дата:
                ${addLeadZero(post.comments[i].children[j].date.getDate())}`+
                    `.${addLeadZero(post.comments[i].children[j].date.getMonth()+1)}`+
                    `.${addLeadZero(post.comments[i].children[j].date.getFullYear())}`;
                childInfo.appendChild(childDescription).textContent =
                    `${post.comments[i].children[j].description}`;
                }
                comment.addEventListener("click",function () {
                    flag = !flag;
                    if (flag === false) {
                        subComments.className = "sub-comments";
                        for (let j in post.comments[i].children) {
                            document.querySelectorAll(`#id${post.comments[i].id} .sub-comments > li`)[j]
                                .className = "counted";
                        }
                        document.querySelector(".comment-counter").textContent =
                            `${document.getElementsByClassName("counted").length}`;
                    }
                    if (flag === true) {
                        subComments.className = "hidden";
                        for (let j in post.comments[i].children) {
                            document.querySelectorAll(`#id${post.comments[i].id} .hidden > li`)[j]
                                .className = "uncounted";
                        }
                        document.querySelector(".comment-counter").textContent =
                            `${document.getElementsByClassName("counted").length}`;
                    }
                })
            }
            document.querySelector(".comment-counter").textContent =
                `${document.getElementsByClassName("counted").length}`;
        }
    }

function commentListener() {
    let count = 10;
    let lastCommentsCount = (post.comments.length - 1) % 10 + 1
    window.addEventListener('scroll',function listener(e) {
        if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 200) {
            if (count < post.comments.length - 1 - lastCommentsCount) {
                loadComments(count,10);
                count += 10;
            }
            else {
                loadComments(post.comments.length - lastCommentsCount,lastCommentsCount);
                removeEventListener('scroll',listener)
            }
        }
    })
}

loadGeneralData();
loadComments(0,10);
commentListener();