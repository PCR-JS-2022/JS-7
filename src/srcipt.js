const cardImg = document.querySelector('.card_img');
const infTitle = document.querySelector('.information_title');
const description = document.querySelector('.description');
const date = document.querySelector('.date');
const tags = document.querySelector('.tags');
const likesIcon = document.querySelector('.love-icon');
const likes = document.querySelector('.likes');
const countComments = document.querySelector('.count-com');
const listComments = document.querySelector('.list-comment');
let counCom = 0;
let curIndex = 0;
const changeCom = 5;


function formatDate(date) {
    let dd = date.getDate();
    if (dd < 10) {
        dd = '0' + dd;
    }
    let mm = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    return dd + '.' + mm + '.' + date.getFullYear();
}

function addCommentEnd(start) {
    let count = 0;
    for (let i = start; i < start + changeCom; i++) {
        if (count >= changeCom) {
            continue;
        }
        if (i > post.comments.length - 1) {
            break;
        }
        let curCom = post.comments[i];
        let li = document.createElement('li');
        if (curCom.hasOwnProperty('children')) {
            li.innerHTML += `<div class="comment" style="background-color:ivory;">` + `<img class="comment_img" src="${curCom.pathToUserImg}">`
                + '<div class="comment_text">' + `<p>${curCom.userName}</p> <p>${formatDate(curCom.date)}</p> <p>${curCom.description}</p>`
                + `</div> </div>`;
            curIndex++;
            count++;
            counCom++;
            let ul = document.createElement('ul');
            ul.classList.add('close');
            let coundChild = 0;
            for (let j = 0; j < curCom.children.length; j++) {
                let curChild = curCom.children[j];
                ul.innerHTML += `<li> <div class="comment">`
                    + `<img class="comment_img" src="${curChild.pathToUserImg}">`
                    + '<div class="comment_text">' + `<p>${curChild.userName}</p> <p>${formatDate(curChild.date)}</p> <p>${curChild.description}</p>`
                    + `</div> </div> </li> </ul>`;
                coundChild++;
            }
            li.addEventListener("click", () => {
                if (ul.classList.contains('close')) {
                    ul.classList.remove('close');
                    li.append(ul);
                    counCom += coundChild;
                    countComments.innerHTML = counCom;
                }
                else {
                    li.removeChild(li.lastChild);
                    ul.classList.add('close');
                    counCom -= coundChild;
                    countComments.innerHTML = counCom;
                }
            });
        } else {
            li.innerHTML += `<div class="comment">` + `<img class="comment_img" src="${curCom.pathToUserImg}">`
                + '<div class="comment_text">' + `<p>${curCom.userName}</p> <p>${formatDate(curCom.date)}</p> <p>${curCom.description}</p>`
                + `</div> </div>`;
            curIndex++;
            count++;
            counCom++;
        }
        li.innerHTML += "</li>";
        listComments.append(li);
    }
    countComments.innerHTML = counCom;
}

function addCommentStart(start) {
    let count = 0;
    for (let i = start; i > start - changeCom; i--) {
        if (count >= changeCom) {
            continue;
        }
        if (i < 0) {
            break;
        }
        let curCom = post.comments[i];
        let li = document.createElement('li');
        if (curCom.hasOwnProperty('children')) {
            li.innerHTML += `<div class="comment" style="background-color:ivory;">` + `<img class="comment_img" src="${curCom.pathToUserImg}">`
                + '<div class="comment_text">' + `<p>${curCom.userName}</p> <p>${formatDate(curCom.date)}</p> <p>${curCom.description}</p>`
                + `</div> </div>`;

            count++;
            counCom++;
            let ul = document.createElement('ul');
            ul.classList.add('close');
            let coundChild = 0;
            for (let j = 0; j < curCom.children.length; j++) {
                let curChild = curCom.children[j];
                ul.innerHTML += `<li> <div class="comment">`
                    + `<img class="comment_img" src="${curChild.pathToUserImg}">`
                    + '<div class="comment_text">' + `<p>${curChild.userName}</p> <p>${formatDate(curChild.date)}</p> <p>${curChild.description}</p>`
                    + `</div> </div> </li> </ul>`;
                coundChild++;
            }
            li.addEventListener("click", () => {
                if (ul.classList.contains('close')) {
                    ul.classList.remove('close');
                    li.append(ul);
                    counCom += coundChild;
                    countComments.innerHTML = counCom;
                }
                else {
                    li.removeChild(li.lastChild);
                    ul.classList.add('close');
                    counCom -= coundChild;
                    countComments.innerHTML = counCom;
                }
            });
        } else {
            li.innerHTML += `<div class="comment">` + `<img class="comment_img" src="${curCom.pathToUserImg}">`
                + '<div class="comment_text">' + `<p>${curCom.userName}</p> <p>${formatDate(curCom.date)}</p> <p>${curCom.description}</p>`
                + `</div> </div>`;
            count++;
            counCom++;
        }
        li.innerHTML += "</li>";
        listComments.prepend(li);
    }
    countComments.innerHTML = counCom;
}

cardImg.src = post.pathToPostImg;
infTitle.innerHTML = post.title;
description.innerHTML = post.description;
date.innerHTML = formatDate(post.date);

post.tags.forEach(el => {
    tags.innerHTML += `<p>${el}</p>`;
});
likes.innerHTML = post.likes;
listComments.innerHTML = "";
addCommentEnd(curIndex);

likesIcon.addEventListener('click', () => {
    if (likesIcon.classList.contains('liked')) {
        likesIcon.classList.remove('liked');
        likes.textContent--;
    }
    else {
        likes.textContent++;
        likesIcon.classList.add('liked');
    }
});

let pos = window.scrollY;

let observerDown = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            if (counCom >= 50 && pos < window.scrollY) {
                while (counCom > 50) {
                    window.scrollBy(0, -105);
                    listComments.firstChild.remove();
                    counCom--;
                    countComments.innerHTML = counCom;
                }
            }
            addCommentEnd(curIndex);
            pos = window.scrollY;
            observer.observe(listComments.lastChild);
            observerUp.observe(listComments.firstChild);
            observer.unobserve(e.target);
        }
    })
}, { threshold: 1 });

let observerUp = new IntersectionObserver((entries, observer) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            if (curIndex > 51 && pos > window.scrollY && counCom >= 50) {
                addCommentStart(curIndex - 51);
                for (let i = 0; i < changeCom; i++) {
                    curIndex--;
                    counCom--;
                    window.scrollBy(0, 105);
                    listComments.lastChild.remove();
                    countComments.innerHTML = counCom;

                }
            }
            if (curIndex === 51 && pos > window.scrollY && counCom >= 50) {
                addCommentStart(curIndex - 51);
                curIndex--;
                counCom--;
                window.scrollBy(0, 210);
                listComments.lastChild.remove();
                countComments.innerHTML = counCom;
            }
            pos = window.scrollY;
            observerUp.observe(listComments.firstChild);
            observerDown.observe(listComments.lastChild);
            observerUp.unobserve(e.target);
        }
    })

}, { threshold: 0.25 });

observerDown.observe(listComments.lastChild);



