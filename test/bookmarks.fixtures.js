'use strict';
function makeBookmarksArray(){
    //const uuid = require('uuid/v4');
    return [
        {
            id: 1,
            title: 'News44 site',
            url: 'www.bbc.com',
            description: 'news bookmark',
            rating: 4
        },

        {
            id: 2,
            title: 'Sports site',
            url: 'www.espn.com',
            description: 'sports bookmark',
            rating: 5
        },

        {
            id: 3,
            title: 'Gaming site',
            url: 'www.miniclip.com',
            description: 'gaming bookmark',
            rating: 1
        }
    ];
}
module.exports = { makeBookmarksArray };