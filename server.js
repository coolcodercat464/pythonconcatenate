const express = require("express")
const path = require("path");
const app = express();

const db = require('./databases/postgres.js')             // database stuff

app.set('views', path.join(__dirname, 'public'));         // tell express where the views are
app.use(express.static(path.join(__dirname, 'public')))   // set static files
app.set('view engine', 'ejs');     
                     // as ejs
const bodyparser = require('body-parser');                // bodyparser for forms
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

// deployment thing
app.use('/.well-known', express.static(path.join(__dirname, 'public', '.well-known')));

//const { spawn } = require('child_process');

var myPythonScript = "main.py";
// Provide the path of the python executable, if python is available as 
// environment variable then you can use only "python"
var pythonExecutable = "python";

// Function to convert an Uint8Array to a string
var uint8arrayToString = function(data){
    return String.fromCharCode.apply(null, data);
};

//app.use(express.static(path.join(__dirname + 'public')))

const options = {
    root: path.join(__dirname, '/public')
};

app.post('/python', async (req, res) => {
    const receivedData = req.body;
    console.log(receivedData)

    const spawn = require('child_process').spawn;
    const scriptExecution = spawn(pythonExecutable, [myPythonScript, receivedData.word1, receivedData.word2]);

    // Handle normal output
    scriptExecution.stdout.on('data', async (data) => {
        try {
            const result = JSON.parse(data.toString());
            const mq = 'INSERT INTO concats (word1, word2, final) VALUES ($1, $2, $3)'
            const insert = await db.query(mq, [result.initial[0], result.initial[1], result.final])
            console.log(result)
            res.send(result)
        } catch (err) {
            console.error("Error parsing JSON:", err);
        }
    });

    // Handle error output
    scriptExecution.stderr.on('data', (data) => {
        res.send({'status': 'error'})
    });
})

app.get("/", (req, res) => {
    res.render('index')
})

app.listen(3000, ()=> {
    console.log("Server started on port 3000");
})