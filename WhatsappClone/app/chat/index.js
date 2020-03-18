import React,{Component} from 'react'
import {View,StyleSheet,Text,FlatList,ScrollView,Image,Dimensions,TouchableOpacity} from 'react-native'
const  x= Dimensions.get('window').width;
import MessageViewer from  '../MessageViewer'
import CreateUser from '../createUser'
import {createSwitchNavigator,createAppContainer} from 'react-navigation'

class Demo extends Component
{
    constructor()
    {
        super()
        this.state=
        {
            data:[]
        }
    }
    save=(item)=>
    {
        return(
            <TouchableOpacity style={styles.list} onPress={()=>this.props.navigation.navigate('MessageViewer',{UserID:item.Id,Name:item.Name})} >
                <Image source={{uri:"data:image/png;base64,"+item.image}} style={styles.listImage}/>
                <View style={styles.listNameAndMessage}>
                    <Text style={styles.listName}>{item.Name}</Text>
                    <Text style={styles.listMessage}>{item.MSG}</Text>
                </View>
                <Text style={styles.listDate}>{item.date}</Text>
            </TouchableOpacity>
        )
    }
    componentDidMount=()=>
    {
        fetch('http://192.168.0.115:3010/User').then((response)=>response.json()).then((responsejson)=>
        {
            var url ='https://images.pexels.com/photos/257360/pexels-photo-257360.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';
            switch(responsejson.Message)
            {
                case 'ERROR_OCURED':
                    console.log(responsejson.Err)
                    alert("There are Error Occured")
                    break;
                case 'NO_USER':
                    alert("There are no User");
                    break;
                case 'DATA_FETCH':
                    var row =[];
                    var l= (responsejson.Result).length;
                    for(let i=0;i<l;i++)
                    {
                        row.push({image:responsejson.Result[i].url,Name:responsejson.Result[i].Name,MSG:responsejson.Result[i].MSG,date:(responsejson.Result[i].Date).substring(0,10),Id:responsejson.Result[i].ID})
                    }
                    this.setState(
                        {
                           data:row
                        }
                    )
            }
        })
    }
    render()
    {
        return(
            <View style={styles.container}>
            <ScrollView style={{flex:1}}>
                <FlatList
                    data={this.state.data}
                    renderItem={({item})=>this.save(item)}
                />
            </ScrollView>
            <TouchableOpacity style={styles.chat} >
                <Image style={styles.chatIcon} source={require('../../assest/Chat.png')}/>
            </TouchableOpacity>
        </View>
        )
    }
}
const styles =StyleSheet.create(
    {
        container:
        {
            flex:1,
            justifyContent:'center',
            alignItems:'center',
        },
        list:
        {
            flexDirection:'row',
            height:80,
            width:x,
            paddingLeft:'1%',
            paddingRight:'1%',
            backgroundColor:'snow',
            marginBottom:'0.1%'
        },
        listImage:
        {
            height:65,
            width:65,
            marginTop:5,
            borderRadius:40
        },
        listNameAndMessage:
        {
            alignSelf:'center',
            marginStart:'5%',
        },
        listName:
        {
            fontSize:20,
            fontWeight:'bold',
            color:'black'
        },
        listMessage:
        {
            fontSize:17,
            color:'#636e72'
        },
        listDate:
        {
            color:'black',
            fontSize:13,
            position:'absolute',
            right:'1%',
            top:'20%'
        },
        chat:
        {
            position:'absolute',
            bottom:'5%',
            right:'6%',
            justifyContent:'center',
            alignItems:'center',
            alignContent:"center",
            backgroundColor:'#16a085',
            height:'11%',
            width:'16.5%',
            borderRadius:40
        },
        chatIcon:
        {
            alignSelf:'center',
            height:'40%',
            width:'50%',
            position:'absolute',
        },
        recentlyUploaded: 
        {
            marginTop: '1%',
            marginLeft: '4%',
            color: '#636e72',
            fontSize: 17,
            fontWeight: 'bold'
        }
    }
)
const MainNavigator = createSwitchNavigator(
    {
        home:
        {
            screen:Demo
        },
        MessageViewer:
        {
            screen:MessageViewer
        },
        CreateUser:
        {
            screen:CreateUser
        }
    }
)
const Chat = createAppContainer(MainNavigator)
export {Chat,styles}