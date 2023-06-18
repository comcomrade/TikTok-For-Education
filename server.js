import http from 'node:http';
import express from 'express';
import fs from 'node:fs';
import multer from 'multer';
import path from 'path'
/**
 * Initialize
 */
const app = express();
app.set('port', process.env.PORT || 4000);

// Setting multer Storage Engine
const upload = multer({
    storage: multer.diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            const now = new Date();

            const customizedDateTime = 

            now.getFullYear() + // 1900 + getYear()
            String(now.getMonth() + 1).padStart(2,'0') + // getMonth() returns 0-11
            String(now.getDate()).padStart(2,'O') + // getDay() returns day of the week (0 for Sunday,...). while getDate() returns 1-31
            '-' + 
            String(now.getHours()) + // returns 0 - 23
            String(now.getMinutes()) + // returns 0 - 59
            String(now.getSeconds()); // returns 0 - 59


            const uniqueSuffix = customizedDateTime + '-' + Math.round(Math.random() * 100)

            const extension = path.extname(file.originalname);

            cb(null, file.fieldname + '-' + uniqueSuffix + extension) // 'file-yyyymmdd-hhmmss-23.jpg'
        }
    }),
    limits: {
        fileSize: 4000 * 1000, //bytes => 4MB
        foo: 4
    }
});


// Serve static file
app.use(express.static('public'));

// Endpoints
app.get('/upload', (req,res)=> {
    res.sendFile(__dirname + '/public/index.html');
})

app.post('/upload', upload.single('file'), (req, res, next) => {
    // Store the file
    if(req.file) {
        console.log('File added to folder')
        res.send('File has been successfully uploaded');
    } else {
        next();
    }
})

// Error catching
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).send('Multer error: ' + err.message)
    } else {
        res.status(500).send('Internal server error');
    }
})

app.listen(app.get('port'), (req, res) => {
    console.log(`Server  is running on port ${app.get('port')}`);
})