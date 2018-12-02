import React, { Component } from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  Dimensions,
  Share,
} from 'react-native';
import { WebBrowser, LinearGradient } from 'expo';
import { MonoText } from '../components/StyledText';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Autolink from 'react-native-autolink';

Expo.ScreenOrientation.allowAsync(Expo.ScreenOrientation.Orientation.PORTRAIT);
const win = Dimensions.get('window');
const HEADER_MAX_HEIGHT = win.width;
const HEADER_MIN_HEIGHT = 60;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollY: new Animated.Value(0),
      barTitleText: '1/1',
      liked: false,
      likes: 201,
    };
  }

  static navigationOptions = { header: null };

  render() {
    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    const imageOpacity = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [0.7, 0.5, 0],
      extrapolate: 'clamp',
    });
    const imageTranslate = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -60],
      extrapolate: 'clamp',
    });

    fade = (color1, color2) => this.state.scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [color1, color2],
      extrapolate: 'clamp',
    });

    changeBarTitleOnScroll = () => {
      if (this.state.scrollY._value >= 260) {
        this.setState({ barTitleText: 'What\'s the best mak...' });
      } else {
        this.setState({ barTitleText: '1/1' });
      }
    };

    onShare = () => {
      Share.share({
        title: 'Make Up Tuition',
        subject: 'What\'s the best makeup products for the tropical wheather like Thailand?',
        url: 'https://www.ddlion.me',
      }, {
        dialogTitle: 'Share this article'
      })
    }

    like = () => {
      this.setState({ liked: !this.state.liked });
      if (this.state.liked) {
        this.setState({ likes: this.state.likes -= 1 });
      } else {
        this.setState({ likes: this.state.likes += 1 });
      }
    }

    return (
      <View style={styles.container}>

        <View style={this.state.scrollY._value >= 260 ? styles.navbar : null}>
          <ScrollView
             scrollEventThrottle={16}
             onScroll={Animated.event(
               [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}],
               {listener: () => {changeBarTitleOnScroll()}}
             )}
           >
            <View style={styles.scrollViewContent}>
              <Text style={{fontSize: 15, color: '#fd5c63'}}>Make Up Tuition{"\n"}</Text>
              <Text style={{fontSize: 15}}>
                What's the best makeup products for the tropical wheather like Thailand?{"\n"}
              </Text>
              <Text style={{color: 'rgba(96,100,109, 1)'}}>
                I wrote myself some 'guinea pig' notes on a recent 38°C scorcher
                in Thailand (100.4°F) and had this to say about blush: "Hahahahaha.
                My entire face is blush." Taking "less is more" as your perpetual
                adage for the makup in tropical weather, here are my best tips,
                one product at a time:
                {"\n"}{"\n"}
                Cruelty-free, totally natural & tested myself. As in the best
                toiletries for Thailand, ecery product below 100% cruelty-free
                (no animal testing). I've tried them nearly all of them personally,
                bought myself as a normal customer - no freebies - during the
                hottest wheather I've ever known on Koh Samui.
                {"\n"}{"\n"}
                1. <Autolink text="#Natural" hashtag="instagram" linkStyle={{color: '#fd5c63'}} /> Bamboo / Charcoal Blotting Sheet{"\n"}
                2. BareMinerals Waterproof <Autolink text="#Mascara" hashtag="instagram" linkStyle={{color: '#fd5c63'}} />{"\n"}
                3. <Autolink text="#SunBum" hashtag="instagram" linkStyle={{color: '#fd5c63'}} /> SPF Lip Balm{"\n"}
                4. Coola Suncare Matte Tint Face Sunscreen{"\n"}
                5. RMS Beauty Organis Makup Palette{"\n"}
                6. EcoBrow defining wax{"\n"}
                7. Drawstring Travel Makeup Organizer{"\n"}
              </Text>
            </View>
          </ScrollView>
          <Animated.View style={[styles.header, {height: headerHeight}]}>
            <LinearGradient style={{height: '100%'}}
              colors={[JSON.stringify(fade('black', 'transparent')), 'transparent']}
            >
              <Animated.Image
                source={require('../assets/images/photo-1512496015851-a90fb38ba796.jpg')}
                style={[
                  styles.backgroundImage,
                  {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},
                ]}
              />
              <View style={styles.bar}>
                <Animated.Text style={{color: fade('white', '#fd5c63')}}>
                  <Icon size={24} name='ios-close-circle-outline' />
                </Animated.Text>
                <Animated.Text style={{color: fade('white', 'black'),
                                       fontWeight: 'bold',
                                       paddingTop: 4}}
                                       >
                  {this.state.barTitleText}
                </Animated.Text>
                <Animated.Text style={{color: fade('white', '#fd5c63')}}>
                  <FeatherIcon size={21} name='external-link' onPress={onShare} />
                </Animated.Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </View>

        <View style={styles.tabBarInfoContainer}>

          <View style={{flex: 1, flexDirection: 'row'}}>
            <Avatar rounded source={require('../assets/images/128.jpg')}/>
            <View style={{marginLeft: 6, height: 32}}>
              <View style={{flex: 1, flexDirection: 'row'}}>
                <Text style={{fontSize: 12}}>Lauren Levinson</Text>
                <Text style={styles.follow}>Follow</Text>
              </View>
              <Text style={styles.postDate}>5 Mins Ago</Text>
            </View>
          </View>

          <View style={styles.likes}>
            <Icon name={this.state.liked ? 'ios-heart' : 'ios-heart-empty'}
                  size={24}
                  color='#fd5c63'
                  onPress={like}
                  />
            <Text style={{color: '#fd5c63', marginLeft: 5}}>
              {this.state.likes}
            </Text>
          </View>

        </View>

      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
    paddingLeft: 14,
    paddingRight: 16,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navbar: {
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  follow: {
    fontSize: 12,
    color: '#fd5c63',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  postDate: {
    fontSize: 12,
    color: 'rgba(96,100,109, 1)',
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: '#fbfbfb',
    overflow: 'hidden',
  },
  bar: {
    marginTop: 28,
    marginLeft: 14,
    marginRight: 14,
    height: 32,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
    marginBottom: win.width / 4,
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 14,
  },
  backgroundImage: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  likes: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});
