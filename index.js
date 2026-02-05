const express = require("express")
const cors = require("cors")
let { default: person } = require("./person")
const app = express()

const morgan = require("morgan")

const cusm = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
})

const port = process.env.PORT || 3001

app.use(express.json())
app.use(cusm)
app.use(cors())
const generateId = ()=>{
    return String(Math.floor(Math.random()*1000))
}
app.get('/',(req,res)=>{
    return res.status(200).send({'msg':"welcome to phone book"})
})

app.get('/api/persons',(req,res)=>{
    return res.status(200).send(person)
})

app.post('/api/persons',(req,res)=>{

    const body = req.body
     if(!body)
        return res.status(400).send({"msg":"no data"})

     else if (!body.name)
        return res.status(400).send({"msg":"no name"})

     else if (!body.number)
        return res.status(400).send({"msg":"no phone"})

     else if (person.filter(p=>p.name===body.name).length>0)
        return res.status(400).send({"msg":"name must be unique"})

    const newPerson = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

   

    person = [...person,newPerson]
    return res.status(201).send(newPerson)
})

app.get('/api/persons/:id',(req,res)=>{
    console.log(req.params.id);
    
    const person1 = person.filter((p)=>p.id===req.params.id)
    console.log(person1);
    
    if(person1.length===0){
       return res.status(404).send({"msg":"person not found"})}
   return res.status(200).send(person1)
})

app.delete('/api/persons/:id',(req,res)=>{
    console.log(req.params.id);
    
    const updatedPeson = person.filter((p)=>p.id!==req.params.id)

    person = updatedPeson;
    
   return res.status(204).send({"msg":"deleted"})
})

app.get('/api/info',(req,res)=>{
    const data = `Phone book has info of ${person.length} people\n${now}`;
   return res.status(200).send(data)
})


app.use((req, res, next) => {
  res.status(404).json({
    message: 'Ohh you are lost, read the API documentation to find your way back home :)'
  });
});

app.listen(port,()=>{
    console.log(`started server on ${port}`)
})