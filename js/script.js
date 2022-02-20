'use strict';

{

    const titleClickHandler = function(){
        event.preventDefault();
        const clickedElement = this;
        //console.log('Link was ciked!');

        /* remove class 'active' from all article links  */
        const activeLinks = document.querySelectorAll('.titles a.active');
        for(let activeLink of activeLinks){
            activeLink.classList.remove('active');
        }

        /* add class 'active' to the clicked link */
        //console.log('clickedElement:', clickedElement);
        clickedElement.classList.add('active');

        /* remove class 'active' from all articles */
        const activeArticles = document.querySelectorAll('.posts .post.active');
        for(let activeArticle of activeArticles){
            activeArticle.classList.remove('active');
        }

        /* get 'href' attribute from the clicked link */
        const articleSelector = clickedElement.getAttribute('href');
        //console.log(articleSelector);

        /* find the correct article using the selector (value of 'href' attribute) */
        const targetArticle = document.querySelector(articleSelector);
        //console.log(targetArticle);

        /* add class 'active' to the correct article */
        targetArticle.classList.add('active');
    };

    const optArticleSelector = '.post',
        optTitleSelector = '.post-title',
        optTitleListSelector = '.titles',
        optArticleTagsSelector = '.post-tags .list',
        optArticleAuthorSelector = '.post-author';

    const generateTitleLinks = function generateTitleLinks(customSelector = ''){

        /* remove contents of titleList */
        const titleList = document.querySelector(optTitleListSelector);
        titleList.innerHTML = '';

        /* for each article */
        const articles = document.querySelectorAll(optArticleSelector + customSelector);
        let html = '';
        for(let article of articles){
            /* get the article id */
            const articleId = article.getAttribute('id');
            /* find the title element */
            /* get the title from the title element */
            const articleTitle = article.querySelector(optTitleSelector).innerHTML;
            /* create HTML of the link */
            const linkHTML = '<li><a href="#' + articleId +'"><span>' + articleTitle + '</span></a></li>';
            //console.log(linkHTML);
            /* insert link into titleList */
            html = html + linkHTML;

        }
        titleList.innerHTML = html;

        const links = document.querySelectorAll('.titles a');

        for(let link of links){
            link.addEventListener('click', titleClickHandler);
        }
    };

    function generateTags(){
      /* find all articles */
      const articles = document.querySelectorAll(optArticleSelector);
      /* START LOOP: for every article: */
      for(let article of articles) {
        /* make html variable with empty string */
        let html = '';
        /* find tags wrapper */
        const tagList = article.querySelector(optArticleTagsSelector);
        /* get tags from data-tags attribute */
        const articleTags = article.getAttribute('data-tags');
        /* split tags into array */
        const articleTagsArray = articleTags.split(' ');
        /* START LOOP: for each tag */
        /* generate HTML of the link */
        for(let tag of articleTagsArray){
        /* add generated code to html variable */
          const linkHTML = '<li><a href="#tag-' + tag +'">' + tag + '</a></li>';
          html = html + linkHTML + ' ';
        /* END LOOP: for each tag */
        }
        /* insert HTML of all the links into the tags wrapper */
        tagList.innerHTML = html;
      /* END LOOP: for every article: */
      }
    };

  function generateAuthors(){
    const articles = document.querySelectorAll(optArticleSelector);
    for(let article of articles) {
      let html = '';
      const authorLink = article.querySelector(optArticleAuthorSelector);
      const authorData = article.getAttribute('data-author');
      const linkHTML = '<a href="#author-' + authorData +'">' + authorData + '</a>';
      html = 'by ' + linkHTML;
      authorLink.innerHTML = html;
    }
  };

  generateTitleLinks();

  generateTags();

  generateAuthors()

  function tagClickHandler(){
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    console.log(tag)
    /* find all tag links with class active */
    const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for(let activeLink of activeLinks){
      /* remove class active */
      activeLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const targetLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for(let targetLink of targetLinks) {
      /* add class active */
      targetLink.classList.add('active')
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  function authorClickHandler() {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const authorRef = href.replace('#author-', '');
    const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
    for(let activeLink of activeLinks){
      activeLink.classList.remove('active');
    }
    const targetLinks = document.querySelectorAll('a[href="' + href + '"]');
    for(let targetLink of targetLinks) {
      targetLink.classList.add('active')
    }
    generateTitleLinks('[data-author="' + authorRef + '"]');
  };

  function addClickListenersToTags() {
    /* find all links to tags */
    const Links = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for(let link of Links){
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    }
    /* END LOOP: for each link */
  };

  function addClickListenersToAuthors() {
    const Links = document.querySelectorAll('a[href^="#author-"]');
    for(let link of Links){
      link.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToTags();

  addClickListenersToAuthors();
}


