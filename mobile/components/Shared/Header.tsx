import { StyleSheet, Text, View } from "react-native";

export default function Header(){

    return(
        <View style = {styles.header}>
            <View>
                <Text style = {styles.headerText}>PostFlow</Text>
            </View>

        </View>
    )
}

  const styles = StyleSheet.create({
        header:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        backgroundColor: 'transparent',
        paddingHorizontal: 10,
        borderColor: 'none',
    },
    headerText: {
            fontWeight: 'bold',
            fontSize: 20,
            color: '#333',
            letterSpacing: 1
    }

})