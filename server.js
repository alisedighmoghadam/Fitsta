var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
const exphbs = require('express-handlebars');
const multer = require("multer");
const bcrypt = require('bcryptjs');
const clientSessions = require("client-sessions");
const { resolve } = require("path");
var path = require("path");
var app = express();
const Sequelize = require('sequelize');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("views"));
app.use(express.static("styles"));
app.use(express.static("validations"));
app.use(express.static("imgs"));
app.use(express.urlencoded({ extended: true }));
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');
// Setup client-sessions
app.use(clientSessions({
    cookieName: "session", // this is the object name that will be added to 'req'
    secret: "assignment4and5AliSedighMoghadam", // this should be a long un-guessable string.
    duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
    activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
  }));
// set up sequelize to point to our postgres database
var sequelize = new Sequelize('de2b31feea1b4k', 'zpjsanbmzbjbql', 'b440a3ad9d5f5dff32d189d0bcfa33b9ae0c5ba56b4516dc275427b097c46661', {
    host: 'ec2-3-231-112-124.compute-1.amazonaws.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});

sequelize.authenticate().then(function() {
        console.log('DATABASE: Connection has been established successfully.');
    })
    .catch(function(err) {
        console.log('DATABASE: Unable to connect to the database:', err);
    });

var User= sequelize.define('User',{
    customer_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    role: Sequelize.INTEGER,
    password: Sequelize.STRING
},{
        createdAt: false, 
        updatedAt: false 
    
});

var Package= sequelize.define('package',{
    pack_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING,
    price: Sequelize.DOUBLE,
    description: Sequelize.STRING,
    category: Sequelize.STRING,
    foodNum: Sequelize.INTEGER,
    imgFile: Sequelize.STRING
    
},{
    createdAt: false, 
    updatedAt: false 

});






// setup a 'route' to listen on the default url path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"/home.html"));
});

app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname,"/home.html"));
});
app.get("/MealsPacks", (req, res) => {
    sequelize.sync().then(function() {
        Package.findAll({
            order: ['pack_id']
        }).then((data) =>{
            
            res.render("MealsPacks", {
                data: data,
                layout: false 
                });
        })
    }); 
});
app.get("/LoginPage", (req, res) => {
    res.render("LoginPage",{errorMsg:"",hide:true,layout:false});
});
app.get("/RegistrationPage", (req, res) => {
    res.sendFile(path.join(__dirname,"/RegistrationPage.html"));
});
app.get("/login", ensureLogin,(req,res)=>{
    sequelize.sync().then(function(){
        User.findAll({
            where:{
                email: req.session.user.email
                
            }
        }).then(function(data){
            
            
            res.render("dashboard",{fname:data[0].firstName,lname:data[0].lastName,email: data[0].email, layout:false});
        })
    })
});
app.post("/register-user", (req, res) => {
    const formData =req.body;
    let CustomerCheck=false,AdminCheck=false,passCheck=false;
    if(req.query.login){
        sequelize.sync().then(function(){
            User.findAll({
                attributes:['email','password','role']
            }).then(function(data){
                for(var i =0; i < data.length; i++){
                    passCheck=bcrypt.compare(formData.password, data[i].password);
                    if(data[i].email==formData.email&&passCheck){
                        console.log(data[i]);
                        if(data[i].role==1){
                            AdminCheck=true;

                        }else if(data[i].role==2){
                            CustomerCheck=true;
                        }
                        
                    }
                }
            }).then(function(){
                if(!AdminCheck&&!CustomerCheck){
                    res.render("LoginPage",{errorMsg:" Sorry, you entered the wrong user and/or password",hide:false,layout:false});
                }else if (CustomerCheck){
                    req.session.user={
                        email: formData.email
                    };
                    res.redirect("/login");
                }else if (AdminCheck){
                    req.session.user={
                        email: formData.email
                    };
                    res.redirect("/admin");
                }
            })
        })
    }else if(req.query.reg){
        let check;
        sequelize.sync().then(function() {
            User.findAll({
                attributes: ['email']
            }).then(function(data){
                for(var i =0; i < data.length; i++){
                    if(data[i].email==formData.email){
                        console.log(data[i].email);
                        check=true;
                    }
                }
                
            }).then(function(){
                if(!check){
        
                    sequelize.sync().then(function () {
                        bcrypt.hash(formData.password, 10).then(hash=>{
                           
                            User.create({
                                    firstName: formData.fname,
                                    lastName: formData.lname,
                                    email: formData.email,
                                    role: 2,
                                    password: hash
                                });
                        })
                        .catch(err=>{
                            console.log(err); // Show any errors that occurred during the process
                        });
                    });
                    //res.sendFile(path.join(__dirname,"/welcome.html"));
                    res.render('welcome',{
                        data: formData.fname,
                        layout: false
                    })
                }else if(check){
                    res.redirect("/LoginPage");
                }
            })
        })
        
    }
});
function ensureLogin(req, res, next) {
    if (!req.session.user) {
      res.redirect("/LoginPage");
    } else {
      next();
    }
  }
app.get("/logout", function(req,res){
    req.session.reset();
    res.redirect("/LoginPage");
});
const storage = multer.diskStorage({
    destination: "./imgs/",
    filename: function (req, file, cb) {
        // we write the filename as the current date down to the millisecond
        // in a large web service this would possibly cause a problem if two people
        // uploaded an image at the exact same time. A better way would be to use GUID's for filenames.
        // this is a simple example.
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
app.use(express.static("./imgs/"));
app.get("/admin", function(req,res){
    sequelize.sync().then(function() {
        var user;
        User.findAll({
            where:{
                email: req.session.user.email
            }
        }).then(function(data){
            user=data;
        });
        Package.findAll({
            order: ['pack_id']
        }).then((data) =>{
            
            res.render("admin", {
                data: data,
                fname:user[0].firstName,
                lname:user[0].lastName,
                email:user[0].email,
                layout: false 
                });
        });
    }); 
});
app.post("/register-pack", upload.single("photo"), (req, res) => {
    // name, username, email, password, photo
  
    Package.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.desc,
      category:req.body.category,
      foodNum: req.body.number,
      imgFile: req.file.filename
    
    }).then(() => {
      console.log("successfully created a new Package");
      res.redirect("/admin");
    });
  });
  app.post("/updatePack", upload.single("photo"), (req, res) => {
      
    Package.update({
      name: req.body.name,
      price: req.body.price,
      description: req.body.desc,
      category: req.body.category,
      foodNum: req.body.number
      
    }, {
      where: { pack_id: req.body.id }
    }).then(() => {
      console.log("successfully updated name: " + req.body.id);
      res.redirect("/admin");
    });
      
  });
  
  app.post("/deletePack", upload.single("photo"), (req, res) => {
    
    Package.destroy({
      where: { pack_id: req.body.id }
    }).then(() => {
      console.log("successsfully removed user: " + req.body.id);
      res.redirect("/admin");
    });
    
  });
  
//   sequelize.sync().then(function(){

//     bcrypt.hash("Sharmin Ahmed", 10).then(hash=>{ 
      
//       User.create({
//           firstName: "Cool",
//           lastName: "Clerk",
//           email: "clerk@fitsta.com",
//           role: 1,
//           password: hash
//       });
//   })
//   .catch(err=>{
//       console.log(err); // Show any errors that occurred during the process
//   });
// })
// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT);