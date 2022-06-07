const random3 = () => Math.floor(Math.random() * (4 - 1)) + 1;
const randomDate = () =>
    new Date(
        new Date("04-09-1999").getTime() +
            Math.random() *
                (new Date().getTime() - new Date("04-09-1999").getTime())
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

const createCommentSectionNode = (comment, isReplica = false) => {
    const usernameNode = document.createElement("p");
    usernameNode.classList.add("content_username");
    usernameNode.innerHTML = comment.userName;

    const descriptionNode = document.createElement("p");
    descriptionNode.classList.add("content_description");
    descriptionNode.innerHTML = comment.description;

    const commentContentNode = document.createElement("div");
    commentContentNode.classList.add("comment_content");
    commentContentNode.appendChild(usernameNode);
    commentContentNode.appendChild(descriptionNode);

    const avatarNode = document.createElement("img");
    avatarNode.classList.add("avatar");
    avatarNode.alt = "Аватар пользователя";
    avatarNode.src = comment.pathToUserImg;

    const timeNode = document.createElement("time");
    timeNode.classList.add("comment_time");
    timeNode.innerHTML = comment.date.toLocaleDateString();

    const commentSectionNode = document.createElement("section");
    commentSectionNode.classList.add("comment");
    commentSectionNode.appendChild(avatarNode);
    commentSectionNode.appendChild(commentContentNode);
    commentSectionNode.appendChild(timeNode);
    commentSectionNode.id = comment.id;

    if (isReplica) {
        commentSectionNode.classList.add("replica");
        commentSectionNode.classList.add("hidden");
    }

    return commentSectionNode;
};

const appendFiveComments = (startIndex) => {
    const commentsBlock = document.getElementsByClassName("comments")[0];
    post.comments.slice(startIndex, startIndex + 5).forEach((comment) => {
        const commentSectionNode = createCommentSectionNode(comment);
        commentsBlock.appendChild(commentSectionNode);

        if (Object.prototype.hasOwnProperty.call(comment, "children")) {
            commentSectionNode.addEventListener("click", () => {
                comment.children
                    .map((replica) => replica.id)
                    .forEach((id) => {
                        document.getElementById(id).classList.toggle("hidden");
                    });
            });

            comment.children.forEach((replica) => {
                const replicaNode = createCommentSectionNode(replica, true);
                commentsBlock.appendChild(replicaNode);
            });

            commentSectionNode.classList.add("comment-with-replica");
        }
    });
};

document.getElementsByClassName("picture")[0].src = post.pathToPostImg;
document.getElementsByClassName("likes_count")[0].innerHTML = post.likes;
document.getElementsByClassName("comments_count")[0].innerHTML =
    post.comments.length;
document.getElementsByClassName("picture-title")[0].innerHTML = post.title;
document.getElementsByClassName("info_description")[0].innerHTML =
    post.description;
document.getElementsByClassName(
    "info_time"
)[0].innerHTML = `Дата съёмки: ${post.date.toLocaleDateString()}`;

const tags = document.getElementsByClassName("tags")[0];
post.tags.forEach((tag) => {
    const node = document.createElement("span");
    node.innerHTML = tag;
    tags.appendChild(node);
});

appendFiveComments(0);

let startCommentIndex = 5;

window.onscroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight) {
        appendFiveComments(startCommentIndex);
        startCommentIndex += 5;
    }
};
