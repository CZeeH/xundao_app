import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Clipboard, Dimensions } from 'react-native';
import { debounce } from 'lodash'; // 引入lodash库中的防抖函数
import { ip } from '../common'
import { router,useLocalSearchParams,useGlobalSearchParams } from 'expo-router';

const GeneratePasswordPage = () => {
    const glob = useGlobalSearchParams();
    console.log( "Global:", glob.pws);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>卡密生成</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        backgroundColor: '#ffffff',
        width: '80%',
        padding: 20,
        borderRadius: 8,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
    },
    passwordInput: {
        backgroundColor: '#f5f5f5',
    },
});

export default GeneratePasswordPage;
