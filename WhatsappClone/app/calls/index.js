import React,{Component} from 'react'
import {View,StyleSheet,Text,ScrollView,FlatList,Image,TouchableOpacity} from 'react-native'
import {styles} from '../chat'
console.disableYellowBox = true
export default class Calls extends Component
{
    constructor()
    {
        super()
        this.state={
            data:[]
        }
    }
    componentDidMount=()=>
    {
        fetch('http://192.168.0.115:3010/Calls').then((response)=>response.json()).then((responsejson)=>
        {
            var url ='https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
            switch(responsejson.Message)
            {
                case 'ERROR_OCURED':
                    alert("There are Error Occured");
                    console.log(responsejson.Err)
                    break;
                case 'NO_CALL':
                    alert("There are no call");
                    break;
                case 'DATA_FETCH':
                    var row =[];
                    var Result =responsejson.Result
                    var l = Result.length;
                    for(let i=0;i<l;i++)
                    {
                        row.push({status:Result[i].Type,image:Result[i].URL,name:Result[i].Name,date:Result[i].Date,Id:Result[i].Id})
                    }
                    this.setState(
                        {
                            data:row
                        }
                    )
            }
        })
    }
    saveCall=(type,Id)=>
    {
        var date = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
        fetch('http://192.168.0.115:3010/createCall',
        {
            method:'POST',
            headers:
            {
                'Accept':'application/json',
                'Content-type':'application/json'
            },
            body:JSON.stringify(
                {
                    userId:Id,
                    type:type,
                    date:date
                }
            )
        }).then((response)=>response.json()).then((responsejson)=>
        {
            switch(responsejson.Message)
            {
                case 'ERROR_OCCUR':
                    alert("Error Occured");
                    console.log(responsejson.Err)
                    break;
                case 'CALL_SUCCESFULLY':
                    alert("Call successfully");
                    this.componentDidMount()
                    break;
            }
        })
    }
    save =(item)=>
    {
        var img;
        if(item.status=='Video')
            img=require('../../assest/VideoCall.png')
        else
            img=require('../../assest/VoiceCall.png')
        return(
            <TouchableOpacity style={styles.list} onPress={this.saveCall.bind(this,item.status,item.Id)}>
                <Image style={styles.listImage} source={{uri:'data:image/png;base64,'+item.image}}/>
                <View style={styles.listNameAndMessage}>
                    <Text style={styles.listName}>{item.name}</Text>
                    <Text style={styles.listMessage}>{item.date}</Text>
                </View>
                <Image source={img} style={{position:'absolute',right:'7%',height:'30%',width:'6%',alignSelf:'center'}}/>
            </TouchableOpacity>
        )
    }
    render()
    {
        return(
        <View style={styles.container}>
            <ScrollView>
                <FlatList
                    data={this.state.data}
                    renderItem={({item})=>this.save(item)}
                />
            </ScrollView>
            <TouchableOpacity style={styles.chat}>
                <Image style={styles.chatIcon} source={require('../../assest/VideoCall.png')}/>
            </TouchableOpacity>
        </View>
        )
    }
}