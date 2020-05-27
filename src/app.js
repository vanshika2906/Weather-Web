const path = require('path') 
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = process.env.PORT || 3000

//Define paths for express config.
const publicDirectoryPath = path.join(__dirname,'../public')
const viewspath = path.join(__dirname,'../templates/views')
const partialspath = path.join(__dirname,'../templates/partials')

//Setup handlebars engine and views location
app.set('view engine','hbs')
app.set('views',viewspath)
hbs.registerPartials(partialspath)

//Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('',(req,res) =>{
    res.render('index',{
        title:'Weather',
        name:'Robot'
    })
})

app.get('/about',(req,res) =>{
    res.render('about',{
        title:'About',
        name:'Robot'
    })
})

app.get('/help',(req,res) =>{
    res.render('help',{
        helptext:'This is helpful text.',
        title:'Help',
        name:'Robot'
    })
})


app.get('/weather',(req,res) => {
    if(!req.query.address){
        return res.send({
            error:'Address must be provided'
        })
    }
    
    geocode(req.query.address,(error,{location,latitude,longitude} = {} )=>{
        if(error){
            return  res.send({error})
        }
        forecast(latitude,longitude, (error,forecastdata) => {
            if(error){
            return res.send({error})
            }
            
            res.send({
                forecast:forecastdata,
                location,
                address:req.query.address
            })
        })
   } )
})

app.get('/products',(req,res) =>{
    if(!req.query.search){
        return res.send({
            error:'You must provide a search term!'
        })
    }
    console.log(req.query.search)
    res.send({
        products:[]
    })
})

app.get('/help/*',(req,res) =>{
    res.render('404page',{
        title:'404',
        errormsg:'Help article not found!',
        name:'Robot'
    })
})

app.get('*',(req,res)=>{
   res.render('404page',{
       title:'404',
       errormsg:'Page not found!',
       name:'Robot'
   })
})


app.listen(port,() => {
    console.log('Server is up on port '+port)
})