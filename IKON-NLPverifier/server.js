const express = require('express')
const multer  = require('multer')
const fs = require('fs-extra')
const util = require('util')
const bodyParser = require('body-parser')
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

const validFileParam = async (file) => {
    return new Promise((resolve, reject) => {
        fs.readdir(SAVEDIR)
            .then(files => {
                console.log(files, file, files.includes(file))
                resolve(files.includes(file))
            })
    })
}

const acceptedFileTypes = (file) => {
    return file.mimetype === 'application/json'
}

const fileFilter = (req, file, cb) => {
    cb(null, acceptedFileTypes(file))  
}

const setLeftSetDifference = (set1, set2) => {
    return set1.filter(x => set2.indexOf(x) < 0 )
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
app.put('/files', upload.single('data'), (req, res) => {
    res.status((req.file)?200:422).end()
})

// gets an entry from the file :file
app.get('/files/:file', async (req, res) => {
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
})

// appends an annotation to the annotated file
app.post('/files/:file', async (req, res) => {
    if(await validFileParam(req.params.file)){
        if(! await fs.pathExists(WORKDIR + req.params.file) ) {
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
})

// resets an annotation by deleting the annotated file
app.delete('/files/:file', async (req, res) => {
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
})