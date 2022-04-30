
console.log(post);

const commentListContainer = document.querySelector('.comment-list');
const postTitle = document.querySelector('.profile__info-title');
const postDescription = document.querySelector('.profile__info-description');
const photoTagsContainer = document.querySelector('.profile__photo-tags');
const profilePhoto = document.querySelector('.profile__photo-image');
const likesCount = document.querySelector('.likes-count');
const commentsCount = document.querySelector('.comments-count');
const date = document.querySelector('.profile__info-date');

date.textContent = post.date.toLocaleDateString();
postTitle.textContent = post.title;
postDescription.textContent = post.description;
likesCount.textContent = post.likes;
commentsCount.textContent = post.comments.length;

function addPhotoAndTags() {
    for (const tag of post.tags) {
        const newTag = document.createElement('pre');
        newTag.textContent = tag;
        photoTagsContainer.appendChild(newTag);
    }

    profilePhoto.src = post.pathToPostImg;
}

addPhotoAndTags();

const comments = new Comments(commentListContainer, 5, 15);
comments.loadComments(false);