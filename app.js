
const express = require('express');
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const app = express();
const PORT = 4000;
// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;


app.set('view engine', 'hbs');

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//serving public file
app.use(express.static(__dirname));
// cookie parser middleware
app.use(cookieParser());

app.use(express.static('./public'))



app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

let myusername
let mypassword 

// a variable to save a session
var session;
app.get('/',(req,res) => {
  session=req.session;
  if(session.userid){
      res.render("home", {myusername});
  }else{
    const message = "";
    res.render('index', {message})
  }
});

app.post('/register', (req,res)=>{

  try {
    myusername = req.body.username
    mypassword = req.body.password

    res.render('index')
      
  } catch (e) {

   res.redirect('/register')
    
  }
  console.log(myusername, mypassword);
    
})

app.get('/register', (req, res) => {
  res.render('register') 
})
app.post('/',(req,res) => {
  if(req.body.username != myusername){
    const message = "Enter valid email"
    res.render('index', {message})
  }else if(req.body.password != mypassword){
    const message = "Enter valid password"
    res.render('index', {message})
  }
  else{
      session = req.session;
      session.userid = req.body.username;
      console.log(req.session);
      res.render('home', {myusername});
  }
})
app.get('/logout',(req,res) => {
  req.session.destroy();
  res.redirect('/');
});
app.listen(PORT, () => console.log(`Server Running at port ${PORT}`));