
import React, { PropTypes, Component } from 'react';
import { 
  requireNativeComponent, 
  View,
  UIManager,
  findNodeHandle,
  DeviceEventEmitter,
  StyleSheet,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

class SketchView extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.subscriptions = [];
  }

  onChange(event) {
    console.log('save event: ',event.nativeEvent);
    if (event.nativeEvent.type === "onSaveSketch") {

      if (!this.props.onSaveSketch) {
        return;
      }

      this.props.onSaveSketch({
        localFilePath: event.nativeEvent.event.localFilePath,
        imageWidth: event.nativeEvent.event.imageWidth,
        imageHeight: event.nativeEvent.event.imageHeight
      });
    }
  }

  componentDidMount() {
    if (this.props.onSaveSketch) {
      let sub = DeviceEventEmitter.addListener(
        'onSaveSketch',
        this.props.onSaveSketch
      );
      this.subscriptions.push(sub);
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(sub => sub.remove());
    this.subscriptions = [];
  }

  render() {
    return (
      <RNSketchView {... this.props} onChange={this.onChange}/>
    );
  }

  clearSketch() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNSketchView.Commands.clearSketch,
      [],
    );
  }

  saveSketch() {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNSketchView.Commands.saveSketch,
      [],
    );
  }

  changeTool(toolId) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNSketchView.Commands.changeTool,
      [toolId],
    );
  }

  checkValidColorString(color) {
    // if (typeof color !== 'string') return false;
    // const colorArray = color.split(',');

    // if (colorArray.length != 3) return false;

    // function isNumeric(n) {
    //   return !isNaN(parseFloat(n)) && isFinite(n);
    // }

    // for (let i = 0; i < colorArray.length; i++) {
    //   let val = colorArray[i];
    //   const num = parseInt(val, 10);
    //   if (!isNumeric(num)) {
    //     return false;
    //   }
    //   if (num > 255) {
    //     return false;
    //   }
    //   if (num < 0) {
    //     return false;
    //   }
    // }
    return true;
  }

  changeColor(color) {
    if (!this.checkValidColorString(color)) return;

    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNSketchView.Commands.changeColor,
      [color],
    );
  }

  changeThickness(thickness) {
    UIManager.dispatchViewManagerCommand(
      findNodeHandle(this),
      UIManager.RNSketchView.Commands.changeThickness,
      [thickness],
    );
  }
}

SketchView.constants = {
  toolType: {
    pen: {
      id: 0,
      name: 'Pen',
    },
    eraser: {
      id: 1,
      name: 'Eraser'
    }
  }
};

SketchView.propTypes = {
  ...View.propTypes, // include the default view properties
  selectedTool: PropTypes.number,
  localSourceImagePath: PropTypes.string
};

let RNSketchView = requireNativeComponent('RNSketchView', SketchView, {
  nativeOnly: { onChange: true }
});

export default SketchView;