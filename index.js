import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Dimensions,
  Modal,
  Platform,
  Image,
} from 'react-native';
import SketchView from './src/sketch';
import { ColorPicker } from './src/color_picker/src';
import ModalDropdown from './src/dropdown';

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

const headerHeight = 45

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    width,
    height: headerHeight,
    backgroundColor: 'rgb(122, 57, 150)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerButtonContainer: {
    width: headerHeight,
    height: headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeThicknessButtonContent: {
    width: headerHeight - 20,
    height: headerHeight - 20,
  },
  changeColorButtonContent: {
    width: headerHeight - 20,
    height: headerHeight - 20,
    borderRadius: 5,
  },
  headerButtonWithTextContainer: {
    height: headerHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerButtonText: {
    color: '#fff',
    fontSize: 16,
    // paddingHorizontal: 10,
  },
  dropdownItem: {
    width: 100,
    height: 50,
    paddingHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  dropdownItemText: {
  },
  dropdown_1: {
    flex: 1,
    top: 32,
    left: 8,
  },
  imageButtonIcon: {
    width: headerHeight - 20,
    height: headerHeight - 20,
    tintColor: "#fff",
  },
  closeButtonIcon: {
    width: 30,
    height: 30,
    tintColor: "#000",
  }
});

export default class SketchEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toolSelected: sketchViewConstants.toolType.pen.id,
      modalVisible: false,
      toolColor: '#000000',
      toolThickness: '5',
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
    this.setState({ toolColor: color });
    this.refs.sketchRef.changeColor(color);
  }

  setToolThickness(value) {
    this.setState({ toolThickness: value });
    this.refs.sketchRef.changeThickness('' + value);
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
            <View style={{width, height, alignItems: 'center' }}>
              <View style={{marginTop: Platform.OS === 'ios' ? 20 : 0, width, height: 50, alignItems: 'flex-start', justifyContent: 'center'}}>
                <TouchableHighlight
                  style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center'}}
                  underlayColor={"transparent"}
                  activeOpacity={0.5}
                  onPress={() => {
                    this.setModalVisible(!this.state.modalVisible)
                  }}
                >
                  <Image resizeMode="contain"
                    style={styles.closeButtonIcon}
                    source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAA21JREFUeJzt3LmOXEUYR/HvIJFYSAz22HiBESIx4A2zme0BeAIeiYgHICFGiDcgcUDEZoPZbZCKhH0nIUEmwBczdvUs3fd23ao6P+nm1f2d+B8hSZIkSZIkSZIkSZIkSZIkSZIkSdJCW8DFiHiw9ENm6nngzYjYKP2QKWwBXwHXga/DCG71HPDnjf/nUkRsln7QqIA3bvy460Zwm2eBP275f14t/aixbQDvGcFtcsd/KyLuKv2wKdwDvG8E/3mmp+MPjOBfTwO/93b8wUHgUscRdH38Qa8RXPD4N/UWwVPAbx5/u4PA5Q4i8Pg7OAR80HAET3r83bUawRPArx5/bw4BHzYUgcdfwmYjETzu8Ze3CVypOILHgF88/moOAx9VGIHHH1FtEZz3+OOrJYLzwM8efxqHgY9nHMGjHn96R2YawTngJ4+/HkeAT2YUgccv4F7g0xlEcNbjl1M6grPAjx6/rKPAZwUiOOPx52PdEZwGfvD483IU+HwNEXj8GZs6glMef/6OTRTBKeB7j1+HY8AXI0bwiMevz/GRIngY+M7j1+k4cHWFCDx+A04A15aI4CHgW4/fhv1G4PEbdB/w5R4iOOnx27VbBCeBbzx+2xZF8ILH78f93JypWfR5/MbtFIHH78SLmeP/HRGnSz9M08vNsgxfiogHCr9PE8otc/xlBH1YNMtyAnjbCNq22yzL3cA7RtCmC+xtnGEDeNcI2rLfWRYjaMiymzy5RdMURlCVVTd5cmOWKYygCmPNshhBhcbe5MntGKYwglmaapPHCCow9SxLbswyhRHMwro2eXI7himMoKh1DzIZwYyUGmTKjVmmMIK1Kj3IlBuzTGEEazGXQabcmGUKI5jU3DZ5chN2KYxgEnM7/sAI1mDug0y5HcMURjCKWgaZcjuGKYxgJbUNMuV2DFMYwVLOUOcsS27CLoUR7Evtg0xGsILajz/ITdilMIIdtbbGZQT70OoaV27CLoURbNP6Glduwi6FEUREP4NMuQm7FJ1H0MvxB7kJuxSdRtDrIFNuwi5FZxH0evxBbr0sRScR9H78QZcROMW2XW64KkWjETjFltdHBMBrHn+h3HDVK6UfNbYDwEWPv9D/I3g9Iu4s/aApHABeDo+/yBbwUkTcUfohkiRJkiRJkiRJkiRJkiRJkiSpDv8Ax+/Wa5nmksYAAAAASUVORK5CYII=' }}
                  />
                </TouchableHighlight>
              </View>
              <ColorPicker
                onColorSelected={(color) => { this.setToolColor(color)}}
                style={{width: width / 1.2, height: height / 1.2}}
                defaultColor={this.state.toolColor}
              />
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <TouchableHighlight
            underlayColor={"transparent"}
            activeOpacity={0.5}
            style={styles.headerButtonWithTextContainer}
            onPress={() => { this.refs.sketchRef.clearSketch(); }}
          >
            <Text style={styles.headerButtonText}>CLEAR</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"transparent"}
            activeOpacity={0.5}
            style={styles.headerButtonWithTextContainer}
            onPress={() => { this.refs.sketchRef.saveSketch(); }}
          >
            <Text style={styles.headerButtonText}>SAVE</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"transparent"}
            activeOpacity={0.5}
            style={[styles.headerButtonWithTextContainer, { backgroundColor: this.isEraserToolSelected() ? "#ab6bc7" : "rgba(0,0,0,0)" }]}
            onPress={this.toolChangeClick.bind(this)}
          >
            <Text style={styles.headerButtonText}>ERASER</Text>
          </TouchableHighlight>
          <ModalDropdown
            disabled={this.isEraserToolSelected()}
            options={[1,3,5,7,10,15,20]}
            onSelect={(idx, value) => { this.setToolThickness(value); }}
            dropdownStyle={{
              width: 70,
              height: 354,
            }}
            renderRow={(data) => <TouchableHighlight style={styles.dropdownItem}
                underlayColor={"transparent"}
                activeOpacity={0.5}
              >
                <View style={styles.dropdownItem}>
                  <Text style={styles.dropdownItemText}>{data}</Text> 
                  <View style={{
                    marginLeft: 10,
                    width: data,
                    height: data,
                    borderRadius: data / 2,
                    backgroundColor: '#000',
                  }}/>
                </View>
              </TouchableHighlight>
            }
          >
            <View style={[styles.headerButtonContainer,]}>
              <Image resizeMode="contain"
                style={styles.imageButtonIcon}
                source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAEQkAABEJABiazSuAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAikSURBVHic7dlBcRgxFETBv669B4yQGIFpOAhCIxATBDIL6fC6EczxVc2z9x4AoOXj9gAA4DwBAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBz1rr3+0RAMBZ78z8uj0CADjLBQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABD0zszv2yMAgLOevfftDQDAYS4AAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAh61lrft0cAAGe9M/Pn9ggA4CwXAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQJAAAIAgAQAAQQIAAIIEAAAECQAACBIAABAkAAAgSAAAQNA7M5+3RwAAZz1779sbAIDDXAAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAEPSstf7eHgEAnPXOzNftEQDAWS4AAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIEgAAECQAACAIAEAAEECAACCBAAABAkAAAgSAAAQJAAAIOidmf+3RwAAZz1779sbAIDDXAAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACBIAABAkAAAgCABAABBAgAAggQAAAQJAAAIEgAAECQAACDoBwddFn1hqUcWAAAAAElFTkSuQmCC' }}
              />
            </View>
          </ModalDropdown>
          <TouchableHighlight
            disabled={this.isEraserToolSelected()}
            underlayColor={"transparent"}
            activeOpacity={0.5}
            style={styles.headerButtonContainer}
            onPress={() => { this.setModalVisible(true); }}
          >
            <View style={styles.headerButtonWithTextContainer}>
              <View style={[styles.changeColorButtonContent, { backgroundColor: this.state.toolColor }]} />
            </View>
          </TouchableHighlight>
        </View>
        <SketchView style={{flex: 1, backgroundColor: 'white'}} ref="sketchRef" 
          selectedTool={this.state.toolSelected} 
          onSaveSketch={this.onSketchSave.bind(this)}
          localSourceImagePath={this.props.localSourceImagePath}
        />
      </View>
    );
  }
}
