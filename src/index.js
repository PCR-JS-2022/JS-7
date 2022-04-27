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
	tags: Array.from({length: 10}, (_, index) => `Tag ${index + 1}`),
	likes: 12,
	comments: Array.from({length: 111}, (_, index) => {
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


// Возвращает кол-во комментариев в массиве с учетом вложенных
const getCommentsCount = (comments) => {
	if (!comments.length) return 0

	return comments.reduce((len, cur) => {
		if (cur.children) {
			return len + 1 + getCommentsCount(cur.children)
		}

		return len + 1
	}, 0)
}

const q = (selector) => document.querySelector(selector)
const qa = (selector) => document.querySelectorAll(selector)
const create = (tag) => document.createElement(tag)
const log = (text) => console.log(text)

// Вставляем id
const content = q('.content')
content.id = post.id

// Вставляем фото поста
const postPhoto = q('.photo__image')
postPhoto.src = post.pathToPostImg

// Вставляем теги
const tags = q('.tags')
post.tags.forEach(tag => {
	const tagEl = create('span')
	tagEl.classList.add('tag')
	tagEl.innerHTML = tag
	tags.appendChild(tagEl)
})

// Вставляем название фото
const photoTitles = qa('.photo__title')
photoTitles.forEach(title => title.innerHTML = post.title)

// Вставляем описание
const description = q('.description')
description.innerHTML = post.description

// Вставляем дату
const dates = qa('.date')
dates.forEach(date => date.innerHTML = post.date.toLocaleDateString('ru-RU'))

// Вставляем картинку для кнопки лайка и кол-во лайков
const btn = q('.like__button')
btn.style.backgroundImage = `url(../public/img/likes.png)`
const likes_count = q('.like__count')
likes_count.innerHTML = post.likes

// Вставляем картинку для кнопки комментов и кол-во комментов
const comment_img = q('.comment__image')
comment_img.src = '../public/img/comments.png'
const comments_count = q('.comment__count')
comments_count.innerHTML = getCommentsCount(post.comments)

// Вставляем комментарии
const createComment = (comment) => {
	const commentLi = create('li')
	commentLi.classList.add('comment__block')
	commentLi.id = comment.id

	const commentDiv = create('div')
	commentDiv.classList.add('comment')
	commentLi.appendChild(commentDiv)

	const avatar = create('img')
	avatar.classList.add('user-avatar')
	avatar.src = comment.pathToUserImg
	commentDiv.appendChild(avatar)

	const name = create('span')
	name.classList.add('user-name')
	name.innerHTML = comment.userName
	commentDiv.appendChild(name)

	const text = create('p')
	text.classList.add('comment__text')
	text.innerHTML = comment.description
	commentDiv.appendChild(text)

	const date = create('time')
	date.classList.add('comment__date')
	date.innerHTML = comment.date.toLocaleDateString('ru-RU')
	commentDiv.appendChild(date)

	if (comment.children) {
		commentDiv.classList.add('comment-with-children')
		const childrenComments = create('ul')
		childrenComments.classList.add('comments')
		childrenComments.classList.add('hidden')
		addHandleClick(commentDiv, childrenComments)
		commentLi.appendChild(childrenComments)
		appendComments(childrenComments, comment.children)
	}
	return commentLi
}

const appendComments = (commentsBlock, comments) => {
	comments.forEach(comment => {
		const commentLi = createComment(comment)
		commentsBlock.appendChild(commentLi)
	})
}

const prependComments = (commentsBlock, comments) => {
	for (let i = comments.length - 1; i >= 0; i--) {
		const commentLi = createComment(comments[i])
		commentsBlock.prepend(commentLi)
	}
}
const deleteFirstPortion = (commentsBlock, portionSize) => {
	for (let i = 0; i < portionSize; i++) {
		const firstChild = commentsBlock.firstChild
		commentsBlock.removeChild(firstChild)
	}
}

const deleteLastPortion = (commentsBlock, portionSize) => {
	for (let i = 0; i < portionSize; i++) {
		const lastChild = commentsBlock.lastChild
		commentsBlock.removeChild(lastChild)
	}
}

function addHandleClick(parentComment, childrenComments) {
	parentComment.addEventListener('click', () => childrenComments.classList.toggle('hidden'))
}

const comments = q('.comments')
let initScrollPosition = window.scrollY
const portionSize = 10
let topLine = 0
let bottomLine = 10
appendComments(comments, [...post.comments].splice(topLine, portionSize))

function updateComments() {
	const scrolled = window.scrollY
	const childrenCount = comments.children.length
	const lastComment = comments.lastChild
	const firstComment = comments.firstChild
	const firstCommentCoords = firstComment.getBoundingClientRect()
	const lastCommentCoords = lastComment.getBoundingClientRect()
	const windowHeight = document.documentElement.clientHeight

	log(windowHeight)

	const isLastCommentTopVisible = lastCommentCoords.top > 0 && lastCommentCoords.top < windowHeight
	const isFirstCommentBottomVisible = firstCommentCoords.bottom > 0 && firstCommentCoords.bottom < windowHeight

	if (isLastCommentTopVisible && scrolled > initScrollPosition) {
		if (childrenCount >= 50) {
			topLine += portionSize
			deleteFirstPortion(comments, portionSize)
		}
		appendComments(comments, [...post.comments].splice(bottomLine, portionSize))
		bottomLine += portionSize
	}

	if (isFirstCommentBottomVisible && scrolled < initScrollPosition) {
		if (childrenCount >= 50) {
			bottomLine -= portionSize
			deleteLastPortion(comments, portionSize)
			topLine -= portionSize
			prependComments(comments, [...post.comments].splice(topLine, portionSize))
		}
	}

	initScrollPosition = scrolled
}

window.addEventListener("scroll", updateComments)
