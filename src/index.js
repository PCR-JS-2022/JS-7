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

function createComment(name, description, img, date) {
    const comment = document.createElement('div');
    comment.className = 'user__comments_item';
    const image = document.createElement('div');
    const userBlock = document.createElement('div');
    const userName = document.createElement('p');
    userName.innerHTML = name;
    const time = document.createElement('time');
    time.innerHTML = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);;
    const info = document.createElement('p');
    info.innerHTML = description;

    userBlock.appendChild(userName);
    userBlock.appendChild(time);
    userBlock.appendChild(info);

    comment.className = 'user__comments_item';
    comment.appendChild(image);
    comment.appendChild(userBlock);

    image.setAttribute(
        'style',
        `background: url(${img}) no-repeat;
         width: 50px;
         height: 50px;
    `
    );

    const container = document.createElement('div');
    container.appendChild(comment);
    container.classList.add('user__comments_container')
    return container;
}


document.addEventListener('DOMContentLoaded', function () {
    let commentCount = 0;
    const commentInitCount = 10;
    const img = document.querySelector('.picture__source');
    const title = document.querySelector('.user__description_title');
    const date = document.querySelector('.user__description_date');
    const description = document.querySelector('.user__description_info');
    const likes = document.querySelector('.likes');
    const comments = document.querySelector('.comments');
    const tags = document.querySelector('.picture__details');
    const commentBlock = document.querySelector('.user__comments');
    const dateFormat = post.date.getFullYear() + '-' + ('0' + (post.date.getMonth() + 1)).slice(-2) + '-' + ('0' + post.date.getDate()).slice(-2);

    console.log(post.comments);
    post.comments.forEach(comment => {
        comment.visible = false;
        if (comment.children && comment.children.length) {
            comment.children.forEach(child => child.visible = false);
        }
    });

    img.setAttribute(
        'style',
        `background: url(${post.pathToPostImg}) no-repeat;
         width: 320px;
         height: 240px;
         overflow: hidden;
         background-size: cover;
    `
    );

    date.innerHTML = dateFormat;
    title.innerHTML = post.title;
    description.innerHTML = post.description;
    likes.innerHTML = post.likes;
    comments.innerHTML = post.comments.length + post.comments.filter(item => item.children).reduce((prev, curr) => prev + curr.children.length, 0);
    post.tags.forEach(tag => {
        const div = document.createElement('div');
        div.innerHTML = tag;
        tags.appendChild(div);
    });

    addCommentBlock();

    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);

    // пробегаемся по комментариям и смотрим вложенные
    //добавляем в разметку каждый раз по 10 комментариев
    function addCommentBlock() {
        let count = 0;
        post.comments.forEach(item => {
            if (count < commentInitCount && !item.visible && !item.hidden) {
                const container = document.createElement('div');
                container.setAttribute('data', item.id);
                container.className = 'user__comments_container';
                container.appendChild(createComment(item.userName, item.description, item.pathToUserImg, item.date));
                item.visible = true;
                count++;
                commentCount++;
                if (item.children && item.children.length) {
                    const deepComment = document.createElement('div');
                    deepComment.className = 'user__comments_deep';
                    item.children.forEach(child => {
                        deepComment.appendChild(createComment(child.userName, child.description, child.pathToUserImg, child.date));
                        count++;
                        commentCount++;
                        child.visible = true;
                    });
                    container.appendChild(deepComment);
                    container.classList.add('deep');
                    initSubscribeEvent(container);
                }
                commentBlock.appendChild(container);
            }
        });
    }

    //если скроллим вниз и комментов больше 50 начинаем сверху удалять чтобы общее кол-во не превышало 50
    //аналогично вверх
    function removeComments(direction) {
        switch (direction) {
            case 'bottom':
                //удаляем по 10
                let count = 0;
                post.comments.forEach(post => {
                    if (count < 10 && post.visible) {
                        count++;
                        post.visible = false;
                        post.hidden = true;
                        commentCount--;
                        if (post.children && post.children.length) {
                            post.children.forEach(c => {
                                count++;
                                c.visible = false;
                                c.hidden = true;
                                commentCount--;
                            })
                        }
                    }

                    reinitContent();
                });
                break;
        }
    }

    function reinitContent() {
        post.comments.forEach(item => {
            if (!item.visible && item.hidden) {
                if (document.querySelectorAll(`[data="${item.id}"]`).length) {
                    document.querySelectorAll(`[data="${item.id}"]`).forEach(doc => {
                        doc.remove();
                    })
                }
            }
        });
    }

    function initSubscribeEvent(element) {
        //лучше здесь конечно делегирование использовать но не очень удобно будет с такой вложенностью
        if (element.classList.contains('deep')) {
            element.childNodes.forEach(child => {
                if (child.classList.contains('user__comments_container')) {
                    child.addEventListener('click', () => {
                        element.classList.toggle('active');
                    });
                }
            })
        }
    }

    function checkPosition() {
        const height = document.body.offsetHeight;
        const screenHeight = window.innerHeight;
        const scrolled = window.scrollY;
        const threshold = height - screenHeight / 4;
        const position = scrolled + screenHeight;

        if (position >= threshold) {
            addCommentBlock();
            if (commentCount > 50) {
                removeComments('bottom')
            }
        }
    }
});
