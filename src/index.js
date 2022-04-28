const random3 = () => Math.floor(Math.random() * (4 - 1)) + 1;
const randomDate = () =>
    new Date(
        new Date("04-09-1999").getTime() +
        Math.random() * (new Date().getTime() - new Date("04-09-1999").getTime())
    );
const generateComment = (id) => ({
    id,
    userName: `Name ${id}`,
    description:
        "Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач.",
    pathToUserImg: `../public/img/user${random3()}.png`,
    date: randomDate(),
});

const post = {
    id: "postID:322",
    pathToPostImg: "../public/img/postImg.png",
    title: "Кот на учебе",
    description:
        "Идейные соображения высшего порядка, а также начало повседневной работы по формированию позиции требуют определения и уточнения позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что новая модель организационной деятельности обеспечивает широкому кругу (специалистов) участие в формировании существенных финансовых и административных условий. Повседневная практика показывает, что рамки и место обучения кадров представляет собой интересный эксперимент проверки соответствующий условий активизации. Повседневная практика показывает, что постоянный количественный рост и сфера нашей активности требуют от нас анализа позиций, занимаемых участниками в отношении поставленных задач. Повседневная практика показывает, что начало повседневной работы по формированию позиции способствует подготовки и реализации форм развития. Повседневная практика показывает, что сложившаяся структура организации позволяет выполнять важные задания по разработке позиций, занимаемых участниками в отношении поставленных задач.",
    date: new Date("04-09-1998"),
    tags: Array.from({ length: 10 }, (_, index) => `Tag ${index + 1}`),
    likes: 12,
    comments: Array.from({ length: 111 }, (_, index) => {
        const comment = generateComment(index.toString());

        if (index % 3 === 0) {
            comment.children = new Array(3)
                .fill("")
                .map((_, childIndex) =>
                    generateComment(index.toString() + childIndex.toString())
                );
        }

        return comment;
    }),
};

document.querySelector(".title").innerHTML = post.title;;
document.querySelector(".description").innerHTML = post.description;
document.querySelector(".date").innerHTML = `Дата съемки: ${getDate(post.date)}`;
document.querySelector(".photo").src = post.pathToPostImg;
document.querySelector('.tags').append(...getTags());
document.querySelector(".like-count").innerHTML = post.likes;
document.querySelector(".comment-count").innerHTML = countComm(post.comments);
const comments = document.querySelector(".comments");

function getDate(date) {
    return date.toLocaleDateString();
}

function getTags() {
    let result = [];
    for (let i = 0; i < post.tags.length; i++) {
        let tag = document.createElement('span');
        tag.className = 'tag';
        tag.innerHTML = post.tags[i];
        result.push(tag);
    }
    return result;
}

function countComm() {
    let count = 0;
    post.comments.forEach(comm => {
        count = comm.children ? count + 1 + comm.children.length : count + 1;
    })
    return count.toString();
}

let count = 0;
post.comments.forEach(comment => {
    count++;
    let li = create_comment(comments, comment);
    if (count > 5) {
        li.style.display = "none";
    }

    if (comment.children) {
        li.classList.add("sub-comments");
        li.classList.add("notActive");
        let ul = document.createElement("ul");
        li.appendChild(ul);
        comment.children.forEach(subcomment => {
            create_comment(ul, subcomment)
            ul.style.display = "none";
        })
    }
});

function create_comment(comments, comment) {
    let li = document.createElement("li");
    li.classList.add("comment");
    comments.appendChild(li);

    let div = document.createElement("div");
    li.appendChild(div);

    let img = document.createElement("img");
    img.src = comment.pathToUserImg;
    div.appendChild(img);

    let commInfo = document.createElement("div");
    div.appendChild(commInfo);
    
    createAndAppend(commInfo, document.createTextNode(comment.userName));
    createAndAppend(commInfo, document.createTextNode(getDate(comment.date)));
    createAndAppend(commInfo, document.createTextNode(comment.description));
    
    return li;
}

const allComments = document.querySelectorAll(".comment");
const subComments = document.querySelectorAll(".sub-comments");

subComments.forEach(comment => {
    comment.addEventListener("click", () => {
        if (comment.classList.contains("notActive")) {
            comment.querySelector("ul").style.display = "block";
            comment.classList.remove("notActive");
        } else {
            comment.querySelector("ul").style.display = "none";
            comment.classList.add("notActive");
        }
    })
});

let commOnPage = 5;
document.addEventListener("scroll", () => {
    if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight - 30) {
        for (let i = commOnPage; i < commOnPage + 5; i++) {
            allComments[i].style.display = "block";
        }
        commOnPage += 5;
    }
});

function createAndAppend(commInfo, append) {
    let div = document.createElement("p");
    div.appendChild(append);
    commInfo.appendChild(div);
}
