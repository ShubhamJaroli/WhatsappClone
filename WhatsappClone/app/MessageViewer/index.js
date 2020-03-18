import React,{Component} from 'react'
import {View,StyleSheet,Text,TextInput,FlatList,ScrollView,TouchableOpacity,Image} from 'react-native'
import {Chat} from '../chat'

export default  class MessageViewer extends Component
{
    constructor()
    {
        super()
        this.state=
        {
            data:[],
            Message:''
        }
    }
    componentDidMount =()=>
    {
        var ID = this.props.navigation.state.params.UserID;
        fetch('http://192.168.0.115:3010/getUserMessage',
        {
            method:'POST',
            headers:
            {
                'Accept':'application/json',
                'Content-type':'application/json'
            },
            body:JSON.stringify(
                {
                    UId:ID
                }
            )
        }).then((response)=>response.json()).then((responsejson)=>
        {
            switch(responsejson.Message)
            {
                case 'ERROR_OCCURED':
                    alert('Error Occured')
                    console.log(responsejson.Err)
                    break;
                case 'NOT_FOUND':
                    alert("There are No Message")
                    break;
                case 'DATA_FETCH':
                    var l = (responsejson.Result).length;
                    var row=[];
                    for(let i=0;i<l;i++)
                    {
                        row.push((responsejson.Result)[i].MText)
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

    save=(item)=>
    {
        return(
            <View style={styles.MessageBox}>
                <Text style={styles.message}>{item}</Text>
            </View>
        )
    }
    sendMessage=()=>
    {
        if(this.state.Message)
        {
            var Id = this.props.navigation.state.params.UserID;
            var message = this.state.Message;
            var date = new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate();
            console.log(date)
            fetch('http://192.168.0.115:3010/createMessage',
            {
                method:'POST',
                headers:
                {
                    'Accept':'application/json',
                    'Content-type':'application/json'
                },
                body:JSON.stringify(
                    {
                        UserId:Id,
                        Message:message,
                        date:date
                    }
                )
            }).then((response)=>response.json()).then((responsejson)=>
            {
                switch(responsejson.Message)
                {
                    case 'ERROR_OCCURED':
                        alert("Some Error Occured")
                        console.log(responsejson.Err)
                        break;
                    case 'MESSAGE_SEND_SUCCESSFULLY':
                        this.componentDidMount();
                        break;
                }
            })
        }
        this.props.navigation.goBack()
    }
    call =(type)=>
    {
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
                    type:type,
                    userId:this.props.navigation.state.params.UserID,
                    date:new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+new Date().getDate()
                }
            )
        }).then((response)=>response.json()).then((responsejson)=>
        {
            switch(responsejson.Message)
            {
                case 'ERROR_OCCUR':
                    alert("Error occured")
                    console.log(responsejson.Err);
                    break;
                case 'CALL_SUCCESFULLY':
                    alert("Call Successfully");
                    break;
            }
        })
    }
    render()
    {
        return(
            <View style={styles.container}>
                <View style={styles.header}>
                     <Text style={styles.HeaderText}>{this.props.navigation.state.params.Name}</Text>
                     <TouchableOpacity style={styles.icon1}  onPress={this.call.bind(this,"Video")}>
                        <Image source={require('../../assest/VideoCall.png')} style={styles.icon1}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon2} onPress={this.call.bind(this,"Voice")}>
                        <Image source={require('../../assest/VoiceCall.png')} style={styles.icon2} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={styles.scroll} >
                    <FlatList
                        data={this.state.data}
                        renderItem={({item})=>this.save(item)}
                    />
                </ScrollView>
                <View style={styles.messageSend}>
                    <TextInput style={styles.input} placeholder="Enter Text"
                        defaultValue={this.state.Message} onChangeText={(m)=>this.setState({Message:m})}
                    />
                    <TouchableOpacity style={styles.button} onPress={this.sendMessage.bind(this)}>
                        <Image source={require('../../assest/Send.png')} style={styles.image}/>
                    </TouchableOpacity>
                </View>   
            </View>
        )
    }
}
const styles = StyleSheet.create(
    {
        header:
        {
            height:'8%',
            justifyContent:'flex-start',
            backgroundColor:'#16a085',
            marginBottom:'0.5%',
            flexDirection:'row'
        },
        HeaderText:
        {
            marginTop:6,
            marginStart:2,
            fontSize:27,
            fontWeight:'100',
            color:'white'
        },
        icon1:
        {
            position:'absolute',
            end:'20%',
            alignSelf:'center',
            height:23,
            width:23
        },
        icon2:
        {
            position:'absolute',
            end:'5%',
            alignSelf:'center',
            height:23,
            width:23
        },
        scroll:
        {
            height:'80%'
        },
        message:
        {
            backgroundColor:'white',
            color:'black',
            fontSize:20
        },
        MessageBox:
        {
            height:35,
            width:'70%',
            marginStart:'5%',
            backgroundColor:'white',
            borderColor:'black',
            borderWidth:0.1,
            margin:'2%',
            borderRadius:10,
            paddingStart:'1%'
        },
        container:
        {
            flex:1,
            justifyContent:'center',
            backgroundColor:'snow'
        },
        messageSend:
        {
            width:'100%',
            height:'10%',
            flexDirection:'row',
            justifyContent:'center',
            paddingStart:'5%',
            paddingEnd:'5%',
        },
        input:
        {
            flex:15,
            height:'80%',
            borderWidth:0.5,
            borderColor:'black',
            color:'black',
            fontSize:18,
            borderRadius:20,
            backgroundColor:'white'
        },
        button:
        {
            flex:1,
            height:'80%',
            marginLeft:'5%',
            alignItems:'center',
            justifyContent:'center'
        },
        image:
        {
            height:40,
            width:40,
            borderRadius:28,
            backgroundColor:'white'
        }
    }
)
