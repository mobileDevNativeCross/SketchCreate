
# sketch-editor
A React Native component for touch based drawing supporting iOS and Android.

## Getting Started

1. `$ npm install https://gregory.galushka@gitlab.intecracy.com/LabArchives/sketch-editor.git --save`
2. `$ react-native link sketch-editor`
3. For iOS, open Application Project in Xcode and find `RNSketchView` project under `Libraries` Folder.
	* Drag `SketchViewContainer.xib` into your application project, adding a folder reference instead of copying.

## Usage
```javascript

import SketchEditor from 'react-native-sketch-view';

export default class SketchEditorTest extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Sketch Editor
        </Text>
        <SketchEditor onSave={(data) => {console.warn(data)}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({

});
```
## APIs and Props

### APIs
1. `onSave(data)` - Callback when saving is complete.
    * `data` Is an object having the following properties -
        * `localFilePath` - Local file path of the saved image.
        * `imageWidth` - Width of the saved image.
        * `imageHeight` - Height of the saved image.

    
