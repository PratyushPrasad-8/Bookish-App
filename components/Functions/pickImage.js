import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Alert } from 'react-native';
import { Platform } from 'react-native';

export default async function pickImage({setImage, setImagebase64}) {
    console.log("Picking image");
    try {
      //permission
      if(Platform.OS !== 'web') {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if(status !== 'granted') {
          Alert.alert('Permission Denied', "We need camera roll permissions to make this work!");
          return
        }
      }

      //picking image
      const result= await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4,3],
        quality: 1,
        base64: true
      })

      //handling result
      if(!result.canceled) {
        console.log(result.assets[0].fileSize);
        if (result.assets[0].fileSize > 60000) {
          Alert.alert("Image too large", "Please choose an image less than 4 MB.");
          setIsLoading(false);
          return;
        }

        setImage(result.assets[0].uri);

        if(result.assets[0].base64) {
          setImagebase64(result.assets[0].base64);
        }else{
          //convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {encoding: FileSystem.EncodingTypes.Base64});
          setImagebase64(base64);
        }
      }
    } catch (error) {
      console.log("Error while picking image", error);
    }
  };