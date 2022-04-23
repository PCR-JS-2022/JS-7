const title = document.querySelector(".title"); 
const description = document.querySelector(".descr"); 
const photo = document.querySelector(".photo"); 
const date = document.querySelector(".date"); 
const tags = document.querySelector(".tags"); 
const likes = document.querySelector(".likes"); 
const like_btn = document.querySelector(".like_btn"); 
const comments = document.querySelector(".comm");
const countComments = document.querySelector(".countComments");


//заголовок
title.innerHTML = post.title;

//фото
photo.src = post.pathToPostImg;

//описание
description.innerHTML = post.description;

//дата
function getDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    if(day < 10) {
        day = `0${day}`;
    }
    if(month < 10) {
        month = `0${month}`;
    }
    return `${day}.${month}.${year}`;
}

date.innerHTML = getDate(post.date);

//теги
post.tags.forEach(tag => {
    let li = document.createElement("li"); 
    li.appendChild(document.createTextNode(tag)); 
    tags.appendChild(li); 
});

//лайки
likes.innerHTML = post.likes;
like_btn.addEventListener("click", () => {
    if(!like_btn.classList.contains("active")) {
        likes.innerHTML = post.likes + 1;
        like_btn.classList.add("active");
    } else {
        likes.innerHTML = post.likes;
        like_btn.classList.remove("active");
    }
})

//комменты
function countCom(comments) {
    let count = 0;
    comments.forEach(comment => {
        count++;
        if(comment.children) {
            comment.children.forEach(subcomment => {
                count++;
            })
        }
    });
    return count;
}
countComments.innerHTML = countCom(post.comments);

let count = 0;
post.comments.forEach(comment => {
    count++;
    let li = document.createElement("li");
    li.classList.add("comment");
    li.style.padding = "10px";
    comments.appendChild(li);
    let div = document.createElement("div");
    li.appendChild(div);
    let img = document.createElement("img");
    img.src = comment.pathToUserImg;
    div.appendChild(img);
    let div2 = document.createElement("div");
    div.appendChild(div2);
    let n = document.createElement("span");
    n.style.paddingRight = "10px";
    n.appendChild(document.createTextNode(comment.userName));
    div2.appendChild(n);
    let dt = document.createElement("span");
    dt.appendChild(document.createTextNode(getDate(comment.date)));
    div2.appendChild(dt);
    let des = document.createElement("div");
    des.appendChild(document.createTextNode(comment.description));
    div2.appendChild(des);
    if(count > 10) {
        li.style.display = "none";
    }

    if(comment.children) {
        li.style.backgroundColor = "#c3d9eb";
        li.style.cursor = "pointer";
        li.classList.add("withSubcomments");
        li.classList.add("notActive");
        let ul = document.createElement("ul");
        li.appendChild(ul);
        comment.children.forEach(subcomment => {
            let li2 = document.createElement("li");
            ul.appendChild(li2);
            let div = document.createElement("div");
            li2.appendChild(div);
            let img = document.createElement("img");
            img.src = subcomment.pathToUserImg;
            div.appendChild(img);
            let div2 = document.createElement("div");
            div.appendChild(div2);
            let n = document.createElement("span");
            n.style.paddingRight = "10px";
            n.appendChild(document.createTextNode(subcomment.userName));
            div2.appendChild(n);
            let dt = document.createElement("span");
            dt.appendChild(document.createTextNode(getDate(subcomment.date)));
            div2.appendChild(dt);
            let des = document.createElement("div");
            des.appendChild(document.createTextNode(subcomment.description));
            div2.appendChild(des);
            ul.style.display = "none";
        })
    }
});

const commentsWithSubcomments = document.querySelectorAll(".withSubcomments");

commentsWithSubcomments.forEach(comment => {
    comment.addEventListener("click", () => {
        if(comment.classList.contains("notActive")) {
            comment.querySelector("ul").style.display = "block";
            comment.classList.remove("notActive");
        } else {
            comment.querySelector("ul").style.display = "none";
            comment.classList.add("notActive");
        }
    }) 
});

const allComments = document.querySelectorAll(".comment");
let visibleComments = 10;

document.addEventListener("scroll", () => {
    if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
        for(let i = visibleComments; i < visibleComments + 10; i++) { 
            allComments[i].style.display = "block";
        }
        visibleComments += 10;
    }
});



