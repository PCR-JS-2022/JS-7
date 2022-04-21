class CommentLoader {
  constructor(pageSize, element) {
    this.pageSize = pageSize;
    this.element = element;
    this.displayedComments = [0, 0];

    this.bottomTarget = null;
    this.bottomObserver = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          this.appendComments();
        };
      },
      {threshold: [1]}
    );

    this.topTarget = null;
    this.topObserver = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          this.prependComments();
        };
      },
      {threshold: [1]}
    );
  }

  appendComments() {
    const endIndex = Math.min(this.displayedComments[1] + this.pageSize, post.comments.length);
    const commentsToDisplay = post.comments.slice(this.displayedComments[1], endIndex);

    for (const comment of commentsToDisplay) {
      const postComment = this.getTopLevelComment(comment);
      this.element.append(postComment);
    }

    this.displayedComments[1] = endIndex;

    if (endIndex < post.comments.length) {
      if (this.bottomTarget) {
        this.bottomObserver.unobserve(this.bottomTarget);
      }
      this.bottomTarget = this.element.querySelector('.top-level-comment:last-child');
      this.bottomObserver.observe(this.bottomTarget);
    } else {
      this.bottomObserver.unobserve(this.bottomTarget);
      this.bottomTarget = null;
    }

    if (this.displayedComments[1] - this.displayedComments[0] > 55) {
      this.removeCommentsFromTop();
    }
  }

  prependComments() {
    const startIndex = Math.max(this.displayedComments[0] - this.pageSize, 0);
    const commentsToDisplay = post.comments.slice(startIndex, this.displayedComments[0]).reverse();

    for (const comment of commentsToDisplay) {
      const postComment = this.getTopLevelComment(comment);
      this.element.prepend(postComment);
    }

    this.displayedComments[0] = startIndex;

    if (startIndex > 0) {
      this.topObserver.unobserve(this.topTarget);
      this.topTarget = this.element.querySelector('.top-level-comment:first-child');
      this.topObserver.observe(this.topTarget);
    } else {
      this.topObserver.unobserve(this.topTarget);
      this.topTarget = null;
    }

    if (this.displayedComments[1] - this.displayedComments[0] > 55) {
      this.removeCommentsFromBottom();
    }
  }

  removeCommentsFromTop() {
    if (this.topTarget) {
      this.topObserver.unobserve(this.topTarget);
    }
    const commentsNumberToRemove = this.displayedComments[1] - this.displayedComments[0] - 55;
    for (let i = 0; i < commentsNumberToRemove; i++) {
      this.element.querySelector('.top-level-comment:first-child').remove();
    }
    this.displayedComments[0] += commentsNumberToRemove;

    this.topTarget = this.element.querySelector('.top-level-comment:first-child');
    this.topObserver.observe(this.topTarget);
  }

  removeCommentsFromBottom() {
    if (this.bottomTarget) {
      this.bottomObserver.unobserve(this.bottomTarget);
    }
    const commentsNumberToRemove = this.displayedComments[1] - this.displayedComments[0] - 55;
    for (let i = 0; i < commentsNumberToRemove; i++) {
      this.element.querySelector('.top-level-comment:last-child').remove();
    }
    this.displayedComments[1] -= commentsNumberToRemove;

    this.bottomTarget = this.element.querySelector('.top-level-comment:last-child');
    this.bottomObserver.observe(this.bottomTarget);
  }

  getTopLevelComment(comment) {
    const postComment = this.getCommentLiElement(comment);
    postComment.className = 'top-level-comment';

    if (comment.children) {
      const subComments = document.createElement('ul');
      subComments.className = 'sub-comments';

      for (const childComment of comment.children) {
        const subComment = this.getCommentLiElement(childComment);
        subComments.append(subComment);
      }
      postComment.classList.add('comment-with-children');
      postComment.append(subComments);

      postComment.addEventListener('click', e => {
        if (e.target.closest('.sub-comments')) {
          return;
        }
        if (postComment.classList.contains('active')) {
          postComment.classList.remove('active');
        } else {
          postComment.classList.add('active');
        }
      });
    }
    return postComment;
  }

  getCommentLiElement(comment) {
    const postComment = document.createElement('li');

    const commentImg = document.createElement('img');
    commentImg.src = comment.pathToUserImg;
    commentImg.alt = comment.userName;
    postComment.append(commentImg);

    const commentHeader = document.createElement('header');

    const commentName = document.createElement('strong');
    commentName.innerHTML = comment.userName;
    commentName.className = 'comment-name';
    commentHeader.append(commentName);

    const commentDate = document.createElement('time');
    commentDate.innerHTML = comment.date.toLocaleDateString();
    commentDate.dateTime = comment.date.toISOString().slice(0, 10);
    commentHeader.append(commentDate);

    postComment.append(commentHeader);

    const commentDescription = document.createElement('p');
    commentDescription.innerHTML = comment.description;
    postComment.append(commentDescription);

    return postComment;
  }
}
