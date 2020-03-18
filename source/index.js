const express = require('express')
const bodyParser = require('body-parser')
const util = require('util');
const mysql = require('mysql')
const app = express()
app.use(bodyParser.json({limit:'50mb',extended:true}))
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
var db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: 'WhatsappClone'
    }
)
const query = util.promisify(db.query).bind(db);
app.get('/',(req,res)=>
{
    res.send("Welcome User")
})

getUserMessage=async(UId)=>
{
    return new Promise(async(resolve,reject)=>
    {
        try
        {
            db.query('SELECT * FROM `Message` WHERE UId ='+UId,(err,result)=>
            {
                if(err||result.length==0)
                    resolve({MText:"",Date:""});
                else 
                    resolve({MText:result[result.length-1].MText,Date:result[result.length-1].MDate});
            })
        }
        catch(err)
        {
            reject(err)
        }
    });
}
app.get('/User',(req,res)=>
{   var row=[];
    db.query('SELECT * FROM `User` WHERE 1',async(err,result)=>
    {
        if(err)
            res.send({Message:'ERROR_OCURED',Err:err.message})
        else if(result.length==0)
            res.send({Message:'NO_USER'})
        else
        {  
            var l = result.length
            for(var i=0;i<l;i++)
            {   var Name =result[i].Name;
                var Message= await(getUserMessage(result[i].UId))
                row.push({ID:result[i].UId,Name:Name,MSG:Message.MText,Date:Message.Date,url:result[i].ImageURL})
            }
            res.send({Message:'DATA_FETCH',Result:row})
        }
    })
})

app.post('/getUserMessage',(req,res)=>
{
    var userId = req.body.UId;
    db.query('SELECT * FROM `Message` WHERE UId = '+userId,(err,result)=>
    {
        if(err)
            res.send({Message:'ERROR_OCCURED',Err:err})
        else if(result.length==0)
            res.send({Message:"NOT_FOUND"})
        else
            res.send({Message:"DATA_FETCH",Result:result})

    })
})
app.post('/createMessage',(req,res)=>
{
    var msg = req.body.Message;
    var UId = req.body.UserId;
    var date = req.body.date;
    db.query("INSERT INTO `Message`(`Uid`, `MText`,`MDate`) VALUES ( "+UId+",'"+msg+"','"+date+"')",(err,result)=>
    {
        if(err)
            res.send({Message:'ERROR_OCCURED',Err:err})
        else
            res.send({Message:'MESSAGE_SEND_SUCCESSFULLY',Result:result})
    })
})

getUser=async(UId)=>
{
    return new Promise(async(resolve,reject)=>
    {
        try
        {
            db.query('SELECT * FROM `User` WHERE UId = '+UId,(err,result)=>
            {
                if(err)
                    resolve('Unknown');
                else
                    resolve({Name:result[0].Name,URL:result[0].ImageURL})
            })
        }
        catch(err)
        {
            reject(err);
        }
    })
}
app.get('/Calls',(req,res)=>
{
    db.query('SELECT * FROM `Calls` ORDER BY CDate DESC',async(err,result)=>
    {
        if(err)
            res.send({Message:'ERROR_OCURED',Err:err.message})
        else if(result.length==0)
            res.send({Message:'NO_CALL'})
        else
        {   
            var row = []
            var l =result.length;
            for(let i=0;i<l;i++)
            {
                var Info = await(getUser(result[i].UId))
                var Name = Info.Name;
                var URL = Info.URL;
                var Type = result[i].type;
                var CDate = result[i].CDate;
                var date = CDate.getDate()+"/"+(CDate.getMonth()+1)+"/"+CDate.getFullYear();
                row.push({Name:Name,Type:Type,Date:date,Id:result[i].UId,URL:URL})
            }
            res.send({Message:'DATA_FETCH',Result:row})
        }
    })
})

app.post('/createCall',(req,res)=>
{
    var UId = req.body.userId;
    var date = req.body.date;
    var type = req.body.type;
    db.query("INSERT INTO `Calls`( `type`, `CDate`, `UId`) VALUES ('"+type+"','"+date+"',"+UId+")",(err,result)=>
    {
            if(err)
                res.send({Message:'ERROR_OCCUR',Err:err})
            else
                res.send({Message:"CALL_SUCCESFULLY",Result:result})
    })
})

app.post('/createStatus',(req,res)=>
{
    var date = req.body.date;
    var Id = req.body.UId;
    var URL = req.body.URL;
    db.query("INSERT INTO `Staus`( `SDate`, `UId`,`ImageURL`) VALUES ('"+date+"',"+Id+",'"+URL+"')",(err,result)=>
    {
        if(err)
            res.send({Message:"ERROR_OCCURED",Err:err})
        else
            res.send({Message:'INSERTION_SUCCESSFULLY',Result:result})
    })
})

getName=async(UId)=>
{
    return new Promise(async(Resolve,Reject)=>
    {
        try
        {
            db.query("SELECT  `Name` FROM `User` WHERE UId = "+UId,(err,result)=>
            {
                if(err)
                    Resolve("UNKNOWN");
                else
                    Resolve(result[0].Name)
            })
        }
        catch(err)
        {
            Reject(err.message())
        }
    })
}
app.get('/getStatus',(req,res)=>
{
    db.query("SELECT * FROM `Staus`",async(err,result)=>
    {
        if(err)
            res.send({Message:"ERROR_OCCURED",Err:err})
        else if(result.length==0)
            res.send({Message:'NO_STATUS'})
        else 
        {
            var row =[];
            var l = result.length;
            for(let i=0;i<l;i++)
            {
                var date1 =(result[i].SDate);
                var date = date1.getDate()+'/'+(date1.getMonth()+1)+'/'+date1.getFullYear()
                var name = await(getName(result[i].UId))
                var URL = (result[i].ImageURL)
                row.push({Date:date,Name:name,url:URL})
            }
            res.send({Message:'DATA_FETCH',Result:row})
        }
    })
})

app.get('/*',(req,res)=>
{
    res.send("Not Found")
})
app.listen(3010)