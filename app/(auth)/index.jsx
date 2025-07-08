import { View, ActivityIndicator, Alert, Text, TouchableOpacity } from 'react-native'
import styles from '../../assets/styles/login.styles'
import { useState } from 'react';
import { Image } from 'expo-image';
import InputField from '../../components/Utils/InputField'
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  //Defining dynamic states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  //Defining functions
  const handleLogin = async() => {
    setIsLoading(true);

    try{
      //Can add logic for client side validation
      //Sending request to server
      const response = await fetch('https://bookish-bu7u.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      //Handling response
      const data = await response.json();

      //Checking response
      if (!response.ok) {
        throw new Error(data.message);
      }

      //Storing token in async storage
      await AsyncStorage.setItem('token', data.token);

      //Navigating to home screen
      router.replace("(tabs)");

      Alert.alert("Success",data.message);
    }
    catch(error){
      Alert.alert("Error during login",error.message );
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/*Image*/}
      <View style={styles.topIllustration}>
        <Image source={require('../../assets/images/login.png')} style={styles.illustrationImage} contentFit='contain'/>
      </View>
      
      {/*Form*/}
      <View style={styles.card}>
        <View style={styles.formContainer}>
          {/*Email*/}
          <InputField 
            label="Email" 
            leftIconName="mail-outline" 
            value={email} 
            onChangeText={setEmail} 
            placeholder="Enter your email" 
            keyboardType={"email-address"} 
            showDetails={true} 
            rightIcon={false}/>
          
          {/*Password*/}
          <InputField 
            label="Password" 
            leftIconName="lock-closed-outline" 
            value={password} 
            onChangeText={setPassword} 
            placeholder="Enter your password" 
            secureTextEntry={!showPassword} 
            showDetails={showPassword} 
            rightIcon={true}
            showPassword={showPassword} 
            onPress={() => setShowPassword(!showPassword)}/>

        {/*Button*/}
        <TouchableOpacity style={styles.button} onPress={()=>{handleLogin()}} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color='white'/>
          ) :(
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>

        {/*Footer*/}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text> 
          <TouchableOpacity onPress={() => router.push("(auth)/signup")}>
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </View>
  )
}

export default Index