class Comments {

    #container;
    #currentFirstUpperCommentIndex;
    #currentLastUpperCommentIndex;
    #currentFirstBottomCommentIndex;
    #currentLastBottomCommentIndex;
    #commentsToLoad;
    #maxCommentsCount;
    #lastLoadedCommentIndex;

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
        this.#currentFirstUpperCommentIndex = 0;
        this.#currentLastUpperCommentIndex = commentsLoadCount;
        this.#commentsToLoad = commentsLoadCount;
        this.#maxCommentsCount = maxCommentsCount;
        this.#currentFirstBottomCommentIndex = -commentsLoadCount;
        this.#currentLastBottomCommentIndex = 0;
    }

    /**
     * @param {boolean} addToBeggining
     * @param {HTMLElement} container
     * @return {HTMLElement}
     */
    #appendComment = (comment, container, addToBeggining, subcomment = false) => {
        //console.log({addToBeggining})
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
                this.#appendComment(subComment, subComments, false, true);
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

        if (addToBeggining) {
            //if (!subcomment) console.log('prepending');
            
            container.prepend(listItem);
            return;
        }
        
        //if (!subcomment) console.log('appending');
        container.appendChild(listItem);
    }

    #loading;
    /** 
     * Подгрузить комментарии
     */
    loadComments = (fromStart = true) => {
        //console.log({start: this.#currentFirstCommentIndex, end: this.#currentLastCommentIndex})
        fromStart ? this.#prependComments() : this.#appendComments();

        document.onscroll = (e) => {
            if (this.#loading) {
                return;
            }

            const firstComment = this.#container.firstElementChild;
            const lastComment = this.#container.lastElementChild;
            
            const lastIsOnScreen = this.#elementIsOnScreen(lastComment);
            const firstIsOnScreen = this.#elementIsOnScreen(firstComment);

            if (lastIsOnScreen && this.#currentLastUpperCommentIndex !== post.comments.length) {
                this.#lastIsOnScreen();
                //console.log(this.#container.childElementCount);
                return;
            }

            if (firstIsOnScreen && this.#currentFirstBottomCommentIndex !== 0 && this.#container.childElementCount >= this.#maxCommentsCount) {
                this.#firstIsOnScreen(lastComment, firstComment);
            }

            console.log(this.#container.childElementCount);
            //console.log(this.#container.children[0].children[0].children[1].children[0].firstChild.textContent, this.#container.lastChild.children[0].children[1].children[0].firstChild.textContent)

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
        console.log('removing ' + count + ' fromBeginnig = ' + fromBeginnig)
        for (let i = 0; i < count; i++) {
            const index = fromBeginnig ? 0 : this.#container.childElementCount - 1;
            const childToRemove = this.#container.children[index];
            this.#container.removeChild(childToRemove);
        }
    }

    #appendComments = () => {
        console.log('appending!');
        for (let i = this.#currentFirstUpperCommentIndex; i < this.#currentLastUpperCommentIndex; i++) {
            this.#appendComment(post.comments[i], this.#container, false);
        }
    }

    #prependComments = () => {
        console.log('prepending!');
        for (let i = this.#currentLastBottomCommentIndex - 1; i >= this.#currentFirstBottomCommentIndex; i--) {
            this.#appendComment(post.comments[i], this.#container, true);
        }
    }


    #lastIsOnScreen = () => {
        console.log('last on screen');
        this.#loading = true;

        this.#currentFirstUpperCommentIndex = this.#currentLastUpperCommentIndex;
        this.#currentFirstBottomCommentIndex += this.#commentsToLoad;
        this.#currentLastBottomCommentIndex += this.#commentsToLoad;
        let commentsToRemove = this.#commentsToLoad;

        if (this.#currentLastUpperCommentIndex + this.#commentsToLoad > post.comments.length) {
            this.#currentLastUpperCommentIndex = post.comments.length;
            commentsToRemove = post.comments.length - this.#currentLastUpperCommentIndex + 1;
        }
        else {
            this.#currentLastUpperCommentIndex += this.#commentsToLoad;
        }
                
        const last = this.#container.lastElementChild;
        this.loadComments(false);

        if (this.#container.childElementCount > this.#maxCommentsCount || commentsToRemove < this.#commentsToLoad) {
            //console.log({commentsToRemove})
            this.#removeComments(commentsToRemove, true);
            
            last.scrollIntoView({block: "end", inline: "nearest"});
        }

        this.#loading = false;
    }

    /**
     * @param {HTMLElement} lastComment
     */
     #firstIsOnScreen = (lastComment, firstComment) => {
         console.log('first os screen');
        this.#loading = true;

        if (this.#currentLastUpperCommentIndex + this.#commentsToLoad - this.#maxCommentsCount <= 0) {
            this.#loading = false;
            return;
        }

        this.#currentFirstBottomCommentIndex -= this.#commentsToLoad;
        this.#currentLastBottomCommentIndex -= this.#commentsToLoad;
        
        this.#currentFirstUpperCommentIndex -= this.#commentsToLoad;
        this.#currentLastUpperCommentIndex -= this.#commentsToLoad;

        if (this.#currentLastUpperCommentIndex === this.#maxCommentsCount) {
            this.#loading = false;
            return;
        }

        //const shouldLoad = this.#currentLastCommentIndex - this.#maxCommentsCount > 0;


        console.log({first: this.#currentFirstBottomCommentIndex, last: this.#currentLastBottomCommentIndex});
        console.log({firstUpper: this.#currentFirstUpperCommentIndex, lastUpper: this.#currentLastUpperCommentIndex});

        
        const test = this.#container.firstElementChild;
        this.loadComments(true);

        if (this.#container.childElementCount >= this.#maxCommentsCount) {
            this.#removeComments(this.#commentsToLoad, false);
            
            test.scrollIntoView({block: "start", inline: "nearest"});
        }

        this.#loading = false;
    }
}