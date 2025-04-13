import React from 'react';
import { Button, View, Image, StyleSheet } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import { getVertexAI, getImagenModel } from '@react-native-firebase/vertexai';

export default function App() {
  const [imageUri, setImageUri] = React.useState(null);

  const generateImage = async () => {
    const app = getApp();
    const vertexai = getVertexAI(app);
    const model = getImagenModel(vertexai, { model: 'imagen-3.0' });

    const result = await model.generateImages('A serene landscape with mountains and a lake');

    // Assuming the response contains base64-encoded image data
    const base64Image = result.images[0].base64Data;
    setImageUri(`data:image/png;base64,${base64Image}`);
  };

  return (
    <View style={styles.container}>
      <Button title="Generate Image" onPress={generateImage} />
      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    marginTop: 20,
    width: 300,
    height: 300
  }
});
