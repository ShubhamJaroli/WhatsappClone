import React,{Component} from 'react'
import {View,Text,FlatList,StyleSheet,ScrollView,Image,TouchableOpacity} from 'react-native'
import {styles} from '../chat'
import ImagePicker from 'react-native-image-picker'
export default class Status extends Component
{
    constructor()
    {
        super()
        this.state=
        {
            data:[],
            URL:require('../../assest/user.png')
        }
    }
    componentDidMount=()=>
    {
        fetch('http://192.168.0.115:3010/getStatus').then((response)=>response.json())
        .then((responsejson)=>
        {
            switch(responsejson.Message)
            {
                case 'ERROR_OCCURED':
                    alert("Error occured");
                    console.log(responsejson.Err)
                    break;
                case 'NO_STATUS':
                    alert("There are no status");
                    break;
                case 'DATA_FETCH':
                    var row =[];
                    var l = (responsejson.Result).length;
                    for(let i=0;i<l;i++)
                    {
                        row.push({name:(responsejson.Result)[i].Name,date:(responsejson.Result)[i].Date,URL:(responsejson.Result)[i].url})
                    }
                    this.setState(
                        {
                            data:row
                        }
                    )
                    break;
            }
        })
    }
    save =(item)=>
    {
        return(
            <View style={styles.list} >
                <TouchableOpacity onPress={()=> item.status='#ffffff'}>
                    <Image source={{uri:'data:image/png;base64,'+item.URL}} style={[styles.listImage,{borderWidth:1},{borderColor:item.status}]} />
                </TouchableOpacity>
                <View style={styles.listNameAndMessage}>
                    <Text style={styles.listName} >{item.name}</Text>
                    <Text style={styles.listMessage}>{item.date}</Text>
                </View>
            </View>
        )
    }
    setStatus=()=>
    {
        var url;
        ImagePicker.showImagePicker((response)=>
        {
            if(response.didCancel)
                console.log('Cancel');
            else if(response.error)
                alert(response.error)
            else if(response.customButton)
                console.log("Used Tapped Custom Buttom : "+response.customButton)
            else
            {
                var urlImage=response.data;
                console.log(urlImage.length)
                this.setState(
                    {
                        URL:{uri:'data:image/png;base64,'+urlImage}
                    }
                )
                var date = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
                fetch('http://192.168.0.115:3010/createStatus',
                {
                    method:'POST',
                    headers:
                    {
                        'Accept':'application/json',
                        'Content-type':'application/json'
                    },
                    body:JSON.stringify(
                        {
                            date:date,
                            UId:1,
                            URL:urlImage
                        }
                    )
                }).then((response)=>response.json()).then((responsejson)=>
                {
                    switch(responsejson.Message)
                    {
                        case 'ERROR_OCCURED':
                            alert("Error Occured");
                            console.log(responsejson.Err)
                            break;
                        case 'INSERTION_SUCCESSFULLY':
                            alert("Insert Successfully");
                            this.componentDidMount()
                            break;
                    }
                }).catch((err)=>{
                    console.log("ERROR",err)
                })
            }    
        })
       
    }
    render()
    {
        return(
        <View style={styles.container}>
            <ScrollView>
            <View style={styles.list}>
                <TouchableOpacity onPress={this.setStatus.bind(this)}>
                    <Image source={this.state.URL} style={styles.listImage}/>
                </TouchableOpacity>
                <View style={styles.listNameAndMessage}>
                    <Text style={styles.listName}>My Status</Text>
                    <Text style={styles.listMessage}>Tap to add new status update</Text>
                </View>
                <Text style={[styles.listDate,{fontSize:25,right:'3%'}]}>...</Text>
            </View>
            <View style={{height:'3%',width:'100%'}}>
                <Text style={styles.recentlyUploaded}>Recently Uploaded</Text>
            </View>
                <FlatList
                    data={this.state.data}
                    renderItem={({item})=>this.save(item)}
                />
            </ScrollView>
        </View>
        )
    }
}