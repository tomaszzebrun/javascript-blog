'use strict';
{

  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    articleAuthor: Handlebars.compile(document.querySelector('#template-article-author').innerHTML),
    articleTag: Handlebars.compile(document.querySelector('#template-article-tag').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML)
  };

  const opts = {
    optArticleSelector: '.post',
    optTitleSelector: '.post-title',
    optTitleListSelector: '.titles',
    optArticleTagsSelector: '.post-tags .list',
    optArticleAuthorSelector: '.post-author',
    optTagsListSelector: '.tags.list',
    optAuthorsListSelector: '.authors.list',
    optCloudClassCount: 5,
    optCloudClassPrefix: 'tag-size-'
  };

  const titleClickHandler = function () {
    event.preventDefault();
    const clickedElement = this;
    //console.log('Link was ciked!');

    /* remove class 'active' from all article links  */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    /* add class 'active' to the clicked link */
    //console.log('clickedElement:', clickedElement);
    clickedElement.classList.add('active');

    /* remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.posts .post.active');
    for (let activeArticle of activeArticles) {
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

  const generateTitleLinks = function generateTitleLinks(customSelector = '') {

    /* remove contents of titleList */
    const titleList = document.querySelector(opts.optTitleListSelector);
    titleList.innerHTML = '';

    /* for each article */
    const articles = document.querySelectorAll(opts.optArticleSelector + customSelector);
    let html = '';
    for (let article of articles) {
      /* get the article id */
      const articleId = article.getAttribute('id');
      /* find the title element */
      /* get the title from the title element */
      const articleTitle = article.querySelector(opts.optTitleSelector).innerHTML;
      /* create HTML of the link */
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      /* insert link into titleList */
      html = html + linkHTML;

    }
    titleList.innerHTML = html;

    const links = document.querySelectorAll('.titles a');

    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }
  };

  const calateTagsParams = function calateTagsParams(tags) {
    const params = {
      'min': 999999,
      'max': 0
    };
    for (let tag in tags) {
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  };

  const calculateTagClass = function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.optCloudClassCount - 1) + 1);
    return opts.optCloudClassPrefix + classNumber;
  };

  const calateAuthorsParams = function calateAuthorsParams(tags) {
    const params = {
      'min': 999999,
      'max': 0
    };
    for (let tag in tags) {
      params.max = Math.max(tags[tag], params.max);
      params.min = Math.min(tags[tag], params.min);
    }
    return params;
  };

  const calculateAuthorClass = function calculateAuthorClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor(percentage * (opts.optCloudClassCount - 1) + 1);
    return opts.optCloudClassPrefix + classNumber;
  };

  const generateTags = function generateTags() {
    /* create a new variable allTags with an empty array */
    let allTags = {};
    /* find all articles */
    const articles = document.querySelectorAll(opts.optArticleSelector);
    /* START LOOP: for every article: */
    for (let article of articles) {
      /* make html variable with empty string */
      let html = '';
      /* find tags wrapper */
      const tagList = article.querySelector(opts.optArticleTagsSelector);
      /* get tags from data-tags attribute */
      const articleTags = article.getAttribute('data-tags');
      /* split tags into array */
      const articleTagsArray = articleTags.split(' ');
      /* START LOOP: for each tag */
      /* generate HTML of the link */
      for (let tag of articleTagsArray) {
        /* add generated code to html variable */
        const linkHTMLData = {tag: tag};
        const linkHTML = templates.articleTag(linkHTMLData);
        html = html + linkHTML + ' ';
        /* check if this link is NOT already in allTags */
        if (!allTags[tag]) {
          /* add generated code to allTags array */
          allTags[tag] = 1;
        } else {
          allTags[tag]++;
        }
        /* END LOOP: for each tag */
      }
      /* insert HTML of all the links into the tags wrapper */
      tagList.innerHTML = html;
      /* END LOOP: for every article: */
    }
    /* find list of tags in right column */
    const tagList = document.querySelector(opts.optTagsListSelector);
    /* add html from allTags to tagList */
    const tagsParams = calateTagsParams(allTags);
    const allTagsData = {tags: []};
    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  };

  const generateAuthors = function generateAuthors() {
    let allAuthors = {};
    const articles = document.querySelectorAll(opts.optArticleSelector);
    for (let article of articles) {
      let html = '';
      const authorLink = article.querySelector(opts.optArticleAuthorSelector);
      const authorData = article.getAttribute('data-author');
      const linkHTMLData = {author: authorData};
      const linkHTML = templates.articleAuthor(linkHTMLData);
      html = 'by ' + linkHTML;
      if (!allAuthors[authorData]) {
        allAuthors[authorData] = 1;
      } else {
        allAuthors[authorData]++;
      }
      authorLink.innerHTML = html;
    }
    const authorList = document.querySelector(opts.optAuthorsListSelector);
    const authorParams = calateAuthorsParams(allAuthors);
    const allAuthorsData = {authors: []};
    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
        className: calculateAuthorClass(allAuthors[author], authorParams)
      });
    }
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
  };

  generateTitleLinks();

  generateTags();

  generateAuthors();

  const tagClickHandler = function tagClickHandler() {
    /* prevent default action for this event */
    event.preventDefault();
    /* make new constant named "clickedElement" and give it the value of "this" */
    const clickedElement = this;
    /* make a new constant "href" and read the attribute "href" of the clicked element */
    const href = clickedElement.getAttribute('href');
    /* make a new constant "tag" and extract tag from the "href" constant */
    const tag = href.replace('#tag-', '');
    /* find all tag links with class active */
    const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]');
    /* START LOOP: for each active tag link */
    for (let activeLink of activeLinks) {
      /* remove class active */
      activeLink.classList.remove('active');
      /* END LOOP: for each active tag link */
    }
    /* find all tag links with "href" attribute equal to the "href" constant */
    const targetLinks = document.querySelectorAll('a[href="' + href + '"]');
    /* START LOOP: for each found tag link */
    for (let targetLink of targetLinks) {
      /* add class active */
      targetLink.classList.add('active');
      /* END LOOP: for each found tag link */
    }
    /* execute function "generateTitleLinks" with article selector as argument */
    generateTitleLinks('[data-tags~="' + tag + '"]');
  };

  const authorClickHandler = function authorClickHandler() {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const authorRef = href.replace('#author-', '');
    const activeLinks = document.querySelectorAll('a.active[href^="#author-"]');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    const targetLinks = document.querySelectorAll('a[href="' + href + '"]');
    for (let targetLink of targetLinks) {
      targetLink.classList.add('active');
    }
    generateTitleLinks('[data-author="' + authorRef + '"]');
  };

  const addClickListenersToTags = function addClickListenersToTags() {
    /* find all links to tags */
    const Links = document.querySelectorAll('a[href^="#tag-"]');
    /* START LOOP: for each link */
    for (let link of Links) {
      /* add tagClickHandler as event listener for that link */
      link.addEventListener('click', tagClickHandler);
    }
    /* END LOOP: for each link */
  };

  const addClickListenersToAuthors = function addClickListenersToAuthors() {
    const Links = document.querySelectorAll('a[href^="#author-"]');
    for (let link of Links) {
      link.addEventListener('click', authorClickHandler);
    }
  };

  addClickListenersToTags();

  addClickListenersToAuthors();
}


