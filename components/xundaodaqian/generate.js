import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, Clipboard, Dimensions } from 'react-native';
import { debounce } from 'lodash'; // 引入lodash库中的防抖函数
import { ip } from '../../common'
import { router, useLocalSearchParams, useGlobalSearchParams } from 'expo-router';

const GeneratePasswordPage = () => {
    const [number, setNumber] = useState('');
    const [newpassword, setPassword] = useState('');
    const debouncedGeneratePassword = debounce(() => { generate() }, 1000, { immediate: true });

    const copyToClipboard = () => {
        Clipboard.setString(newpassword);
        Alert.alert('Success', 'Password copied to clipboard!');
    };

    // const postData = async () => {
    //     const url = ip
    //     const data = { time: number };
    //     fetch(url, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify(data)
    //     })
    //         .then(response => response.text())
    //         .then(result => {
    //             console.log(result);
    //         })
    //         .catch(error => {
    //             console.error('Error: ', error);
    //         });
    //     // setPassword(newPassword);
    // };

    const generate = async () => {
        const params = {
            type: 'generate',
            time: number
        };

        const url = `${ip}?` + Object.keys(params)
            .map(key => `${key}=${encodeURIComponent(params[key])}`)
            .join('&');

        await fetch(url)
            .then(response => response.text())
            .then(result => {
                const { msg, code, password } = JSON.parse(result) || {}
                if (code === 'success') {
                    console.log(code, msg, password)
                    setPassword(password);
                    return
                }
                Alert.alert(
                    `生成失败`,
                    `${msg}`,
                )
            })
            .catch(error => {
                Alert.alert(
                    '网络异常',
                    `${error}`,
                )
            })
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>卡密生成</Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>输入时间</Text>
                <TextInput
                    keyboardType="numeric"
                    onChangeText={setNumber}
                    value={number}
                    style={styles.input}
                />
                <Button title="生成卡密" onPress={debouncedGeneratePassword} />
                {newpassword ? (
                    <>
                        <Text style={styles.label}>❤️新卡密:</Text>
                        <TextInput
                            editable={false}
                            value={newpassword}
                            style={[styles.input, styles.passwordInput]}
                        />
                        <Button title="复制卡密" onPress={copyToClipboard} />
                    </>
                ) : null}
            </View>
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
