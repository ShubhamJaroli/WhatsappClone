import React,{Component} from 'react'
import {View,StyleSheet,Text,TextInput,TouchableOpacity} from 'react-native'

export default class CreateUser extends Component
{
    constructor()
    {
        super()
        this.state={
            Name:'',
            Contact:''
        }
    }
    render()
    {
        return(
            <View style={styles.container}>
                <Text style={styles.header}>Create User</Text>
                <TextInput placeholder="Enter Name" defaultValue={this.state.Name} 
                    onChangeText={(N)=>this.setState({Name:N}) } style={styles.input}
                />
                <TextInput placeholder="Enter Contact No." defaultValue={this.state.Contact} 
                    onChangeText={(C)=>this.setState({Contact:C})} keyboardType='numeric' maxLength={10}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.btn} >
                    <Text style={styles.btntxt}>Save</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create(
    {
        container:
        {
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'white'
        },
        header:
        {
            fontSize:30,
            fontWeight:'bold',
            fontStyle:'italic',
            marginBottom:'5%'
        },
        input:
        {
            width:'80%',
            height:'8%',
            borderColor:'black',
            borderRadius:10,
            borderWidth:0.1,
            backgroundColor:'snow',
            marginTop:'10%'
        },
        btn:
        {
            height:'7%',
            width:'40%',
            backgroundColor:'#2d3436',
            marginTop:'10%'
        },
        btntxt:
        {
            fontSize:30,
            alignSelf:'center',
            color:'snow'
        }
    }
)