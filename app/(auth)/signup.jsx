import { View, Text, Alert, ActivityIndicator, TouchableOpacity } from 'react-native'
import styles from '../../assets/styles/login.styles'
import { useState } from 'react'
import InputField from '../../components/Utils/InputField'
import { router } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Signup = () => {
  //Defining dynamic states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //Defining functions
  const handleSignup = async () => {
    setIsLoading(true);

    //Can add logic for client side validation
    //Sending request to server
    try {
      const response = await fetch('https://bookish-bu7u.onrender.com/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password })
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
      
      Alert.alert("User registered successfully", data.message)
    } catch (error) {
      Alert.alert("Error during registration",error.message );
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/*Header*/}
        <View style={styles.header}>
          <Text style={styles.title}>Bookish📚</Text>
          <Text style={styles.subtitle}>Share your favourite books</Text>
        </View>

        {/*Form*/}
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

          {/*Username*/}
          <InputField
            label="Username" 
            leftIconName="person-outline" 
            value={username} 
            onChangeText={setUsername} 
            placeholder="Enter your username" 
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
            showPassword={showPassword} 
            rightIcon={true}
            onPress={() => setShowPassword(!showPassword)}/>

          {/*Signup Button*/}
          <TouchableOpacity style={styles.button} onPress={()=>{handleSignup()}} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color='white'/>
            ) :(
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </TouchableOpacity>

          {/*Footer*/}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => {router.back()}}>
              <Text style={styles.link}>Login</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </View>
  )
}

export default Signup