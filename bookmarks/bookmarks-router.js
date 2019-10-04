const express = require('express');
const xss = require('xss');
const logger = require('../src/logger');
//const uuid = require('uuid/v4');
const BookmarksService = require('./bookmarks-service');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: bookmark.url,
    description: xss(bookmark.description),
    rating: Number(bookmark.rating)
  });

bookmarkRouter //working for GET and POST - returns all bookmarks and posts with a unique id 
    .route('/bookmarks')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        BookmarksService.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks)
            })
            .catch(next)
        
    })
    .post(bodyParser, (req, res, next) => {
        const { title, url, description, rating } = req.body;
        const newBookmark = { title, url, description, rating };

        for (const [key, value] of Object.entries(newBookmark)){
            if (value == null){
                return res.status(400).json({
                    error: { message: `Missing '${key}' in request body`}
                });
            }
        }
        if(!Number.isInteger(rating) || rating < 0 || rating > 5){
            logger.error('Rating between 0 and 5 required')
            return res  
                    .status(404)
                    .send('Invalid data')
        }

        BookmarksService.insertBookmark(
            req.app.get('db'),
            newBookmark
        )
            .then(bookmark => {
                res
                    .status(201)
                    .location(`/bookmarks/${bookmark.id}`)
                    .json(serializeBookmark(bookmark))
            })
            .catch(next);
    });

bookmarkRouter //working for GET and DELETE - returns bookmark based on id and deletes them 
    .route('/bookmarks/:id')
    .all((req, res, next) => {
        BookmarksService.getById(
            req.app.get('db'),
            req.params.id
        )
        .then(bookmark => {
            if(!bookmark){
                //logger.error(`Bookmark with id ${id} not found`) 
                return res
                        .status(404)
                        .json({ error: { message: `Bookmark doesn't exist` } });
                }
                res.bookmark = bookmark;
                next();
            })
            .catch(next);
    })
    .get((req, res) => {
        res.json(serializeBookmark(res.bookmark));
    })
    .delete((req, res, next) => {
        const { id } = req.params;
        BookmarksService.deleteBookmark(
            req.app.get('db'),
            id
        )
            .then(() => {
                logger.error(`Bookmark with id ${id} not found`)
                return res
                        .status(204)
                        .send('Not found')
            })
            .catch(next)
    });
    
    // const bookmarkIndex = bookmarks.findIndex(b => b.id === id );
    // if(bookmarkIndex === -1){
    // bookmarks.splice(bookmarkIndex, 1);
    // logger.info(`Bookmark with id ${id} deleted`)
    // return res
    //         .status(204)
    //         .end()

module.exports = bookmarkRouter;

