import { View, Image , TextInput, Text, ScrollView, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native'
import { useState } from 'react'
import styles from '../../assets/styles/create.styles'
import COLORS from '../../constants/colors'
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderRating from '../../components/Utils/RenderRating';
import pickImage from '../../components/Functions/pickImage';

export default function Create() {
  //Defining dynamic states
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [rating, setRating] = useState(3);
  const [image, setImage] = useState(null);
  const [imagebase64, setImagebase64] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //Defining functions
  const handleSubmit = async () => {
    setIsLoading(true);

    //Can add logic for client side validation

    try {
      //Deriving Token
      const token = await AsyncStorage.getItem('token');

      //get file extension from URI or default to jpg
      const uriParts = image.split('.');
      const fileType= uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : 'image/jpg';

      //base64 format=> data:image/jpeg;base64address,
      const imageDataUrl = `data:${imageType};base64,${imagebase64}`;

      const response = await fetch('https://bookish-bu7u.onrender.com/api/books', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, caption, rating, image: imageDataUrl })
      })
      
      const data = await response.json();  
      console.log(data)

      if (!response.ok) {
        throw new Error(data.message);
      }
      Alert.alert("Success", "Book created successfully");

      setTitle('');
      setCaption('');
      setRating(3);
      setImage(null);
      setImagebase64(null);
    } catch (error) {  
      if(error.message) {
        if(error.message.toString() === "JSON Parse error: Unexpected character: <") {
          Alert.alert("Sorry :(", "We are currently not able to process this image, please try again with a different image (black and white based).");
        }else{
          Alert.alert("Error", error.message);
        }
      }
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
      <View style={styles.card}>
        {/*Header*/}
        <View style={styles.header}>
          <Text style={styles.title}>Add a Book</Text>
          <Text style={styles.subtitle}>Share details of your book</Text>
        </View>
        
        {/*Form*/}
        {/* Book Title */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Book Title</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="book-outline" size={20} color={COLORS.primary} style={styles.inputIcon}/>
            <TextInput 
              style={styles.input} 
              placeholder="Enter book title"
              placeholderTextColor={COLORS.placeholder}
              value={title}
              onChangeText={setTitle}
              autoCapitalize="none"
              editable={!isLoading}/>
          </View>
        </View>

        {/*Rating*/}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Rating</Text>
          <RenderRating rating={rating} setRating={setRating} isLoading={isLoading}/>
        </View>

        {/*Image*/}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Image</Text>
          <TouchableOpacity onPress={()=>{pickImage({setImage, setImagebase64})}} style={styles.imagePicker} disabled={isLoading}>
            {image ? (
              <Image source={{ uri: image }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <Ionicons name="image-outline" size={80} color={COLORS.textSecondary}/>
                <Text style={styles.placeholderText}>Tap to select Image</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/*Caption*/}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Caption </Text>
          <View>
            <TextInput 
              style={styles.textArea} 
              placeholder="Enter caption"
              placeholderTextColor={COLORS.placeholder}
              value={caption}
              onChangeText={setCaption}
              autoCapitalize="none"
              multiline
              editable={!isLoading}/>
          </View>
        </View>

        {/*Submit Button*/}
        <TouchableOpacity style={styles.button} onPress={()=>{handleSubmit()}} disabled={isLoading}>
        {isLoading ? 
          <ActivityIndicator color={COLORS.white}/> : 
          (<>
            <Ionicons name='book-outline' size={24} color={COLORS.white}/>
            <Text style={styles.buttonText}>   Share  </Text>
          </>)}
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}