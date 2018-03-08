const express = require('express')
const multer  = require('multer')
const fs = require('fs-extra')
const util = require('util')
const bodyParser = require('body-parser')
// wraps try catch around the async routes
const asyncHandler = require('express-async-handler')
const app = express()

// set up frontend files
const frontend = fs.readFileSync('./frontend/build/index.html')
app.use(express.static(__dirname + "/frontend/build"));

// parse body per middleware
app.use(bodyParser.json())

// define important constants
const PORT = process.env.PORT || 8080
const SAVEDIR = process.env.SAVEDIR || './files/projects/'
const WORKDIR = process.env.WORKDIR || './files/annotated_projects/'

const storage = multer.diskStorage({
  destination: SAVEDIR,
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now())
  }
})

// just allow filenames which are present in the entry and don't exploit the filepath
const validFileParam = async (file) => {
    return new Promise((resolve, reject) => {
        fs.readdir(SAVEDIR)
            .then(files => {
                resolve(files.includes(file) && !file.includes('/'))
            })
    })
}

const acceptedFileTypes = (file) => {
    return ['application/json', 'text/plain'].includes(file.mimetype)
}

const fileFilter = (req, file, cb) => {
    cb(null, acceptedFileTypes(file))  
}

const setLeftSetDifference = (set1, set2) => {
    return set1.filter(x => set2.indexOf(x) < 0 )
}

const legitEntry = (x) => {
    return setLeftSetDifference(['id', 'title', 'href', 'content', 'entities'], Object.keys(x)).length === 0
}

const upload = multer({
    fileFilter: fileFilter,
    storage: storage
})

// get frontend
app.get('/', (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(frontend)
})

// get all files with name and id
app.get('/files', (req, res) => {
    fs.readdir(SAVEDIR)
    .then(files => res.json(files.map(file => {return {name: file.substring(0, file.length-14), fileID: file}}))
                        .status(200)
                        .end())

})

//saves a file in order to annotate it later
app.put('/files', upload.single('data'), asyncHandler(async (req, res) => {
    if(!req.file) {
        res.status(422).send('Wrong file type!').end()
        return
    }

    let filedata = await fs.readJson(req.file.path)
    if(Array.isArray(filedata) && filedata.every(legitEntry)) {
        res.status(200).end()
    }
    else {
        fs.unlink(req.file.path)
        res.status(422).send('Wrong file structure!').end()
    }
}))

// gets an entry from the file :file
app.get('/files/:file', asyncHandler(async (req, res) => {
    if(await validFileParam(req.params.file)){
        let setProjects = await fs.readJson(SAVEDIR + req.params.file)
        let setAnnotatedProjects = await fs.readJson(WORKDIR + req.params.file)
        let NotAnnotatedProjects = setLeftSetDifference(setProjects, setAnnotatedProjects)
        res.json(NotAnnotatedProjects.pop())
        .status(200)
        .end()
    }
    else{
        res.status(404).end()
    }
}))

// appends an annotation to the annotated file
app.post('/files/:file', asyncHandler(async (req, res) => {
    if(await validFileParam(req.params.file)){
        if(!await fs.pathExists(WORKDIR + req.params.file) ) {
            await fs.outputFile(WORKDIR + req.params.file, '[]')
        }
        let annotated = await fs.readJson(WORKDIR + req.params.file)
        annotated.push(req.body)
        await fs.writeJson(WORKDIR + req.params.file, annotated)
        res.status(200).end()
    }
    else{
        res.status(404).end()
    }
}))

// resets an annotation by deleting the annotated file
app.delete('/files/:file', asyncHandler(async (req, res) => {
    if (await validFileParam(req.params.file)) {
        fs.unlink(WORKDIR + req.params.file, (err) => {
            res.send((err)?err:'File deleted!').status((err)?500:200).end()
        })
    }
    else{
        res.status(404).end()
    }
})

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}!`)
}))