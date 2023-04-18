const express = require('express')
const app = express()
const port = 4000
var mysql = require('mysql')
const session = require ('express-session')

app.use(express.static('public')); //måste vi har för att säga att use/hämta från puplic

let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ny
app.use(
  session({
    secret: 'my-secret',
    resave: 'false',
    saveUninitialized: true,

  })
)

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port:'8889', // det här numret finns på min data I MAMP APP och sen preferences
  password:'root',
  database: 'express-demo'
})

connection.connect(function(err){
  if (err) {
    console.log(err)
}
console.log('succes')
}) ;

// connection.query('SELECT * FROM users', function (error, results, fields) {
//   if (error) throw error;
//   console.log(results);
// });
 
// connection.end();


//hämta från githab en liten del om api

app.get('/', (req, res) => {
  // res.send('welcome, ipsum lorem ipsum dolor sit amet') eller den
  res.sendFile(__dirname + '/index.html');
})

app.get('/random', function(req, res) {
  connection.query('SELECT * FROM users', function (error, results, fields) {
    if (error) throw error;
    return res.send(results)
  });
   

});
// ny
app.get('protected', (req, res) =>{
  if(req.session.authenticated){
    //if the user is authenticated
    res.send('protected...is logged in');
  }  else{
    res.redirect('/login');
  }
})

app.get('/logged-in',(req,res) =>{
  if(req.session.authenticated){
    //if the user is authenticated
    res.sendFile( __dirname + '/logged-in.html');
  }  else{
    res.redirect('/login');
  }
})
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', (req, res) => {
    // console.log(req.body)
    const email =req.body.email;
    const password =req.body.password;

    console.log(email, password)

    connection.query(`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'` , function (error,results,fields) {
      if(error) throw error;

      if(results.length > 0) {
       // res.send('Found' + results.length + 'users')
        req.session.authenticated = true; //coplat till ny uppe komment
        res.redirect('/logged-in');
      }else{
        res.send('No users found');
      }
      // console.log(results);
    });
    // res.send('Got a POST request')
 })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})