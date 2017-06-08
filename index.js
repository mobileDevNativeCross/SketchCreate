import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
  Modal,
} from 'react-native';
import SketchView from './src/sketch';
import { ColorPicker } from './color_picker/src';


const { width, height } = Dimensions.get('window');

const sketchViewConstants = SketchView.constants;

const tools = {};

tools[sketchViewConstants.toolType.pen.id] = {
  id: sketchViewConstants.toolType.pen.id,
  name: sketchViewConstants.toolType.pen.name,
  nextId: sketchViewConstants.toolType.eraser.id
};
tools[sketchViewConstants.toolType.eraser.id] = {
  id: sketchViewConstants.toolType.eraser.id,
  name: sketchViewConstants.toolType.eraser.name,
  nextId: sketchViewConstants.toolType.pen.id
};

export default class SketchEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toolSelected: sketchViewConstants.toolType.pen.id,
            modalVisible: false,
            toolColor: '#000000',
        };
    }

    isEraserToolSelected() {
        return this.state.toolSelected === sketchViewConstants.toolType.eraser.id;
    }

    toolChangeClick() {
        this.setState({toolSelected: tools[this.state.toolSelected].nextId});
    }

    getToolName() {
        return tools[this.state.toolSelected].name;
    }

    onSketchSave(saveEvent) {
        this.props.onSave && this.props.onSave(saveEvent);
    }

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }

    setToolColor(color) {
      this.setState({toolColor: color});
      this.refs.sketchRef.changeColor(color);
    }

    render() {
        return (
            <View style={styles.container}>
              <Modal
                animationType={"slide"}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {}}
              >
                <View style={{width, height}}>
                  <View style={{width, height, alignItems: 'center', justifyContent: 'center'}}>
                    <TouchableHighlight onPress={() => {
                      this.setModalVisible(!this.state.modalVisible)
                    }}>
                      <Text>Close</Text>
                    </TouchableHighlight>
                    <ColorPicker
                      onColorSelected={(color) => { this.setToolColor(color)}}
                      style={{width: width / 1.2, height: height / 1.2}}
                    />
                  </View>
                </View>
              </Modal>
              <View style={styles.header}>
                <TouchableHighlight underlayColor={"#CCC"} style={{ flex: 1, justifyContent:'center', alignItems: 'center', backgroundColor:this.isEraserToolSelected() ? "#CCC" : "rgba(0,0,0,0)" }} onPress={() => { this.setModalVisible(true); }}>
                  <View style={{backgroundColor: this.state.toolColor, width: 50, height: 50 }} />
                </TouchableHighlight>
              </View>
              {
                <SketchView style={{flex: 1, backgroundColor: 'white'}} ref="sketchRef" 
                  selectedTool={this.state.toolSelected} 
                  onSaveSketch={this.onSketchSave.bind(this)}
                  localSourceImagePath={this.props.localSourceImagePath}
                />
              }
              
              {
                <View style={{ flexDirection: 'row', backgroundColor: '#EEE'}}>
                  <TouchableHighlight underlayColor={"#CCC"} style={{ flex: 1, alignItems: 'center', paddingVertical:20 }} onPress={() => { this.refs.sketchRef.clearSketch() }}>
                    <Text style={{color:'#888',fontWeight:'600'}}>CLEAR</Text>
                  </TouchableHighlight>
                  <TouchableHighlight underlayColor={"#CCC"} style={{ flex: 1, alignItems: 'center', paddingVertical:20, borderLeftWidth:1, borderRightWidth:1, borderColor:'#DDD' }} onPress={() => { this.refs.sketchRef.saveSketch() }}>
                    <Text style={{color:'#888',fontWeight:'600'}}>SAVE</Text>
                  </TouchableHighlight>
                  <TouchableHighlight
                    underlayColor={"#CCC"}
                    style={{ flex: 1, justifyContent:'center', alignItems: 'center', backgroundColor:this.isEraserToolSelected() ? "#CCC" : "rgba(0,0,0,0)" }}
                    onPress={this.toolChangeClick.bind(this)}
                  >
                    <Text style={{color:'#888',fontWeight:'600'}}>ERASER</Text>
                  </TouchableHighlight>
                </View>
              }
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    width,
    height: 70,
    backgroundColor: 'rgb(122, 57, 150)',
    flexDirection: 'row',
  },
});

