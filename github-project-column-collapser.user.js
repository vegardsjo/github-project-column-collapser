// ==UserScript==
// @name         GitHub Project Column Collapser
// @namespace    LoffeSoft
// @version      0.9
// @description  Collapses Columns in GitHub project view. Based on a bookmarklet written on a napkin by Daniele Grasso.
// @author       Vegard Sjonfjell
// @include      https://github.*.io/*
// @match        https://github.com/*
// @grant        none
// ==/UserScript==

function toggleHideChild(element) {
    'use strict';
    element.style.display = element.style.display === 'none' ? '' : 'none';
}

function toggleHideUi(column, colHead, colNameLabel) {
    'use strict';
    toggleHideChild(column.querySelector('.project-column'));
    Array.from(colHead.children).filter(e => e.tagName != 'H4').forEach(e => toggleHideChild(e));
    toggleHideChild(colNameLabel.querySelector('.counter'));
}

function collapseColumn(column) {
    'use strict';
    const colHead = column.querySelector('.project-column-header');
    const colNameLabel = colHead.querySelector('h4');

    toggleHideUi(column, colHead, colNameLabel);

    const colHeadHeight = window.getComputedStyle(colHead).height;
    colNameLabel.style.writingMode = 'vertical-lr';
    colHead.style.cssText = 'border-bottom: 1px solid rgb(229, 229, 229) !important'; // HACK: override !important higher up
    colHead.style.borderRadius = '3px 3px 3px 3px';
    colHead.style.width = '3em';
    colHead.style.minHeight = `calc(100% + ${colHeadHeight})`;
    column.style.width = '3.8em';

    column.dataset.collapsed = 'collapsed';
}

function unCollapseColumn(column) {
    'use strict';
    const colHead = column.querySelector('.project-column-header');
    const colNameLabel = colHead.querySelector('h4');

    toggleHideUi(column, colHead, colNameLabel);

    colNameLabel.style.writingMode = '';
    colHead.style.cssText = '';
    column.style.width = '';

    column.dataset.collapsed = '';
}

function toggleCollapseColumn(column) {
    'use strict';
    if (column.dataset.collapsed) {
        unCollapseColumn(column);
    } else {
        collapseColumn(column);
    }
}

(function() {
    'use strict';
    Array.from(document.querySelectorAll('.js-project-column'))
        .forEach(
        column => {
            const colHead = column.querySelector('.project-column-header');
            const colNameLabel = colHead.querySelector('h4');
            colHead.addEventListener('click', function (event) {
                if (event.target === this) {
                    toggleCollapseColumn(column);
                }
            });

            colNameLabel.addEventListener('click', (event) => toggleCollapseColumn(column));
        });
})();
