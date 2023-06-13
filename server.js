import http from 'node:http';
import express from 'express';
import fs from 'node:fs';

/**
 * Files
 */

import {getUserById} from './data/getUserById.js';
/**
 * Initialize
 */
const app = express();
app.set('port', process.env.PORT || 4000);

/**
 * Configure template engine for current application
 */
app.set('view engine', 'pug'); // Set the engine for the view template
app.set('views', './pug-views'); // Set the directory containing the view template files

/**
 * All Request must go through this middleware
 */
app.use((req, res, next) => {
    console.log(`Time: ${Date.now()}`);
    next();
})


/**
 * ALL
 */
app.all('/secret', (req, res, next) => {
    console.log('Accessing the secret path...');
    next();
})

/**
 * GET
 */
app.get('/', (req, res) => {
    res.send('hello world!'); 
})

app.get('/pug', (req, res, next) => {
    res.render('index', {title: 'Hey', message: 'Hello there!'})
})

app.get('/users/:userId/book/:bookId', (req, res) => {
    res.send(req.params);
})

/**
 * POST/
 */
app.post('/', (req, res) => {
    // Do something here on the server
    res.send('You have POST a request!');
})



// Synchronous errors will automatically be catched by Express itself
// Asynchronous errors need to be passed to next(err) function 
app.get('/file-up', (req, res, next) => {
    // Read file
    fs.readFile('/file-does-not-exist', (err, data) => {
        if(err) {
            next(err)
        } else {
            res.send(data);
        }
    })
})

app.get('/user/:id', async (req, res, next) => {
    // fetch the user by ID using getUserById function
    const user = await getUserById(req.params.id);
    res.send(user);
})

// This error handling must be at last, after other app.use() and routes calls
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error. Something broke!');
})


app.listen(app.get('port'), (req, res) => {
    console.log(`Server  is running on port ${app.get('port')}`);
})