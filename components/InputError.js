import React from "react";
import { StyleSheet, View, Text } from "react-native";

export default function InputError(props){
    let errors = [];
    errors = props.errors.map(e => {
        if(e !== undefined)
            return <Text key={e} style={styles.errorText}>{e}</Text>
    })
    
    return (
        <View style={styles.errorBox}>
            {errors}
        </View>
    )
}

const styles = StyleSheet.create({
    errorBox: {
        backgroundColor: '#E68587',
        borderWidth: 1,
        borderColor: '#f5c6cb',
        color: '#721c24',
        padding: 10,
        marginVertical: 5,
        minWidth: '90%',
        maxWidth: '90%'
    },
    errorText: {
        fontSize: 16,
        marginVertical: 3,
        color: 'white'
    }
})