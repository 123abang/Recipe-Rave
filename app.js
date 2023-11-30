import express  from 'express'
import ejs from'ejs'
import { fileURLToPath } from 'url';
import body from "body-parser"
import { dirname } from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose'
import md5 from 'md5'
import fetch from 'node-fetch'
import news from 'newsapi'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app=express()

mongoose.connect('mongodb://127.0.0.1:27017/ReciepeDB',{useNewUrlParser:true})


 const userSchema=  mongoose.Schema({
  email:String,
  password:String
})

const Users=new mongoose.model('users',userSchema)



app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('public'))


app.get('/search',(req,res)=>{
    res.render('home.ejs')
})
app.get('/',(req,res)=>{
  res.render('details.ejs')
})
app.get('/signup',(req,res)=>{
  res.render('login.ejs')
})


app.get('/login',(req,res)=>{
  res.render('signup.ejs')
})
app.get('/welcome',(req,res)=>{
  res.render('route.ejs')
})

app.get('/footer',(req,res)=>{
  res.render('partials/footer.ejs')
})


app.get('/categories',async (req,res)=>{
  try{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/categories.php')
    const data = await response.json()
    // console.log(data)
    res.render('categories.ejs',{recipes:data.categories})
  } catch(err){
    console.log(err);
  }
})

app.get('/random',async (req,res)=>{
  try{
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php')
    const data = await response.json()
    // console.log(data)
    res.render('random.ejs',{recipes:data.meals})
  } catch(err){
    console.log(err);
  }
})







app.post('/', async (req, res) => {
    const searchTerm = req.body.go;
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.render('index.ejs', { recipes: data.meals, searchTerm });
    } catch (error) {
    //   console.log('Error fetching data:', error);
        console.log(error);
      res.send('error fetching data');
    }
  });


  app.get('/country',async(req,res)=>{
    const response = await fetch ('https://www.themealdb.com/api/json/v1/1/filter.php?a=')
    const data = await response.json()
    console.log(data)
    res.render('country.ejs')
  })

  app.post('/country',async(req,res)=>{
    const country = req.body.country
    const url =  `https://www.themealdb.com/api/json/v1/1/filter.php?a=${country}`
    try{
      const response = await fetch(url)
      const data =await response.json()
      res.render('area.ejs',{recipe:data.meals,country})
    }catch(error){
      console.log(error);
      res.send('error fetching data')
    }
  })






app.post('/login',(req,res)=>{
  const login=new Users({
    user:req.body.email,
    password:md5(req.body.password)
  })
  login.save()
  .then(()=>{
    res.redirect('/search')
  }).catch((err)=>{
    res.send(err)
  })
})

app.post('/register',(req,res)=>{
  const username=req.body.email
  const password=md5(req.body.password)
  Users.findOne({email:username})

  .then((founduser)=>{
   if(founduser.password===password){
     res.redirect('/search')
   }
  }).catch((err)=>{
   console.log(err)
   res.send('user not found register first')
  })
})

app.post('/games', async (req, res) => {
  const search=req.body.get
  try {
    const response =  await fetch(`https://api.rawg.io/api/games?key=7f845d75534343909609f93a1032dc06&search=${search}`);
    
    // const response = await fetch(apiUrl);
    const data = await response.json();
    
    // Pass the game data to the EJS template
    res.render('games.ejs', { games: data.results,search });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching game data');
  }
});

app.get('/gaming',(req,res)=>{
  res.render('search.ejs')
})



app.listen(2001,()=>{
    console.log('running at 2001');
})
