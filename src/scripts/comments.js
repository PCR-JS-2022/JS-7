class Comments {

    #container;
    #commentsToLoad;
    #maxCommentsCount;

    /**
     * @param {HTMLElement} commentsContainer
     * @param {number} commentsLoadCount - сколько комментариев подгружать, когда дошли до последнего
     * @param {number} maxCommentsCount - макс. кол-во комментариев на странице
     */
    constructor(commentsContainer, commentsLoadCount, maxCommentsCount) {
        if (!commentsContainer || !(commentsContainer instanceof HTMLElement)) {
            throw new TypeError('commentsContainer must be specified and be typeof HTMLElement');
        }

        if (typeof commentsLoadCount !== 'number' || commentsLoadCount < 0) {
            throw new Error('commentsLoadCount must be a number and greater than zero');
        }

        if (typeof maxCommentsCount !== 'number' || maxCommentsCount < 0) {
            throw new Error('maxCommentsCount must be a number and greater than zero');
        }

        this.#container = commentsContainer;
        this.#commentsToLoad = commentsLoadCount;
        this.#maxCommentsCount = maxCommentsCount;
    }

    /**
     * @param {boolean} fromBeggining
     * @param {HTMLElement} container
     * @param {number} index
     * @return {HTMLElement}
     */
    #addComment = (comment, container, fromBeggining, index) => {
        const listItem = document.createElement('article');
        listItem.className = 'comment-list__item';
    
        const listItemWrapper = document.createElement('div');
        listItemWrapper.className = 'comment-list__item-wrapper';
    
        const avatar = document.createElement('img');
        avatar.className = 'comment-list__item-avatar';
        avatar.src = comment.pathToUserImg;
    
        const body = document.createElement('div');
        body.className = 'comment-list__item-body';
    
        const header = document.createElement('header');
        header.className = 'comment-list__item-body__header';
        const username = document.createElement('h4');
        username.className = 'comment-list__item-body__header-username';
        username.textContent = comment.userName;
        const date = document.createElement('p');
        date.className = 'comment-list__item-body__header-date';
        date.textContent = comment.date.toLocaleString();
        header.appendChild(username);
        header.appendChild(date);
    
        body.appendChild(header);
    
        const content = document.createElement('p');
        content.className = 'comment-list__item-body__content';
        content.textContent = comment.description;
    
        body.appendChild(content);
    
        listItemWrapper.appendChild(avatar);
        listItemWrapper.appendChild(body);
    
        listItem.appendChild(listItemWrapper);
        
        if (comment.children && comment.children.length > 0) {
            const subComments = document.createElement('div');
            subComments.className = 'comment-list__item__subcomment-list';
            for (const subComment of comment.children) {
                this.#addComment(subComment, subComments, false, true);
            }
            
            listItem.appendChild(subComments);
            listItemWrapper.classList.add('comment-list__item-wrapper-expandable');
    
            listItemWrapper.onclick = () => {
                const className = 'comment-list__item-wrapper-expandable-active';
                if (subComments.style.maxHeight) {
                    subComments.style.maxHeight = null;
                    listItemWrapper.classList.remove(className);
                  } else {
                    subComments.style.maxHeight = subComments.scrollHeight + "px";
                    listItemWrapper.classList.add(className);
                  }
            }
        }

        listItem.setAttribute('index', index);

        if (fromBeggining) {
            container.prepend(listItem);
            return;
        }
                
        container.appendChild(listItem);
    }

    loadComments = () => {
        this.#appendComments(0, this.#commentsToLoad);

        document.onscroll = (e) => {
            const firstComment = this.#container.firstElementChild;
            const lastComment = this.#container.lastElementChild;
            
            const lastIsOnScreen = this.#elementIsOnScreen(lastComment);
            const firstIsOnScreen = this.#elementIsOnScreen(firstComment);

            if (lastIsOnScreen) {
                this.#lastIsOnScreen();
            }

            else if (firstIsOnScreen) {
                this.#firstIsOnScreen();
            }
        }
    }

    /**
     * @param {HTMLElement} el
     * @return {boolean}
     */
    #elementIsOnScreen = (el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);
    }

    /**
     * @param {number} count
     * @param {boolean} fromBeginnig
     */
    #removeComments = (count, fromBeginnig) => {
        for (let i = 0; i < count; i++) {
            const index = fromBeginnig ? 0 : this.#container.childElementCount - 1;
            const childToRemove = this.#container.children[index];
            this.#container.removeChild(childToRemove);
        }
    }

    #appendComments = (first, end) => {
        for (let i = first; i < end; i++) {
            this.#addComment(post.comments[i], this.#container, false, i);
        }
    }

    #prependComments = (end, first) => {
        for (let i = end - 1; i >= first; i--) {
            this.#addComment(post.comments[i], this.#container, true, i);
        }
    }


    #lastIsOnScreen = () => {
        
        const lastElem = this.#container.lastElementChild;
        const firstIndex = parseInt(lastElem.getAttribute('index'));
        if (firstIndex === post.comments.length - 1) {
            return;
        }

        let lastIndex = firstIndex;

        let commentsToRemove = this.#commentsToLoad;

        if (lastIndex + this.#commentsToLoad > post.comments.length) {
            commentsToRemove = post.comments.length - lastIndex - 1;
            lastIndex = post.comments.length - 1;
        }
        else {
            lastIndex += this.#commentsToLoad;
        }
                
        const last = this.#container.lastElementChild;
        this.#appendComments(firstIndex + 1, lastIndex + 1);

        if (this.#container.childElementCount > this.#maxCommentsCount || commentsToRemove < this.#commentsToLoad) {
            this.#removeComments(commentsToRemove, true);
            
            last.scrollIntoView({block: "end", inline: "nearest"});
        }
    }

     #firstIsOnScreen = () => {
        const firstElem = this.#container.firstElementChild;
        const index = parseInt(firstElem.getAttribute('index'));

        if (index === 0) {
            return;
        }

        const elementToScroll = this.#container.firstElementChild;
        let lastIndex = index - this.#commentsToLoad;
        if (index - this.#commentsToLoad < 0) {
            lastIndex = 0;
        }
        
        this.#prependComments(index, lastIndex);

        if (this.#container.childElementCount >= this.#maxCommentsCount) {
            this.#removeComments(this.#commentsToLoad, false);
            elementToScroll.scrollIntoView({block: "start", inline: "nearest"});
        }
    }
}