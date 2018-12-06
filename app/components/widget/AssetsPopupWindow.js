/**
 * PopupWindow modal
 * @author hjn
 */
import React from 'react'
import {ART, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native'

const {width, height} = Dimensions.get('window');
let mwidth = 70;
let mheight = 120;
const bgColor = '#2d2d2d';//背景色,没有设置外部传入
const top = 60;
let dataArray;//列表数据源
let navigation;
export default class MenuModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isVisible: this.props.show,
        };
        //数据传递
        mwidth = this.props.width || 70;
        mheight = this.props.height || 200;
        dataArray = this.props.dataArray;
        navigation = this.props.navigation;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({isVisible: nextProps.show});
    }

    //处理状态
    closeModal() {
        this.setState({
            isVisible: false
        });
        this.props.closeModal(false);
    }

    render() {
        //绘制路径
        const path = ART.Path();
        path.moveTo(width - 34 - mwidth / 3 + 3, top);
        path.lineTo(width - 34 - mwidth / 3 + 9, top - 7);
        path.lineTo(width - 34 - mwidth / 3 + 15, top);
        path.close();
        return (
            <View style={styles.container}>
                <Modal
                    transparent={true}
                    visible={this.state.isVisible}
                    //动画效果类型
                    animationType={'fade'}
                    onRequestClose={() => this.closeModal()}>
                    <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => this.closeModal()}>
                        <ART.Surface width={width} height={100}>
                            <ART.Shape d={path} fill={bgColor}/>
                        </ART.Surface>
                        <FlatList style={styles.modal} data={dataArray} renderItem={({item, index}) =>
                            <TouchableOpacity activeOpacity={1} onPress={() => this.dealWithClick(item, index)}
                                              style={styles.itemView}>
                                <Text style={styles.textStyle}>{item}</Text>
                            </TouchableOpacity>
                        }/>
                    </TouchableOpacity>
                </Modal>
            </View>
        )
    }

    dealWithClick(item, index) {
        this.closeModal();
        switch (index) {
            case 0:

                break;
            case 1:
                navigation.push('Transfer');
                break;
            case 2:
                navigation.push('Receive');
                break;
            case 3:
                navigation.push('TradeRecords');
                break
        }
    }
}
//样式链
const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
    },
    modal: {
        backgroundColor: bgColor,
        // opacity:0.8,
        width: mwidth,
        height: mheight,
        position: 'absolute',
        left: width - mwidth - 40,
        top: top,
        padding: 5,
        borderRadius: 3,
    },
    itemView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flex: 1,
        height: 28
    },
    textStyle: {
        color: '#fff',
        fontSize: 14,
        marginLeft: 2,
    },
    imgStyle: {
        width: 12,
        height: 12,
    }
});