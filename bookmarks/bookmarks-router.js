const express = require('express');
const logger = require('../src/logger');
//const { bookmarks } = require('../src/bookmark-store');
//const uuid = require('uuid/v4');
const BookmarksService = require('./bookmarks-service');

const bookmarkRouter = express.Router();
const bodyParser = express.json();

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
    .post(bodyParser, (req, res) => {
        const { title, url, description, rating } = req.body;
        
        if(!title){
            logger.error('Title is required')
            return res
                    .status(400)
                    .send('Invalid data')
        }
        if(!url){
            logger.error('URL required')
            return res  
                    .status(404)
                    .send('Invalid data')
        }
        if(!description){
            logger.error('Description is required')
            return res
                    .status(400)
                    .send('Invalid data')
        }
        if(!Number.isInteger(rating) || rating < 0 || rating > 5){
            logger.error('Rating between 0 and 5 required')
            return res  
                    .status(404)
                    .send('Invalid data')
        }

        const id = uuid();
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        };

        bookmarks.push(bookmark);
        logger.info(`Bookmark with id ${id} created`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json({id});

    })

bookmarkRouter //working for GET and DELETE - returns bookmark based on id and deletes them 
    .route('/bookmarks/:id')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db');
        const { id } = req.params;
        BookmarksService.getById(knexInstance, id)
            .then(boookmark => {
                if(!boookmark){
                    logger.error(`Bookmark with id ${id} not found`) 
                    return res
                        .status(404)
                        .json({ error: { message: `Bookmark doesn't exist` } });
                }
                res.status(200).json(boookmark);
            })
            .catch(next);

        
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarks.findIndex(b => b.id === id );
        if(bookmarkIndex === -1){
            logger.error(`Bookmark with id ${id} not found`)
            return res
                    .status(404)
                    .send('Not found')
        }
        bookmarks.splice(bookmarkIndex, 1);
        logger.info(`Bookmark with id ${id} deleted`)
        return res
                .status(204)
                .end()
    });
    


module.exports = bookmarkRouter;

