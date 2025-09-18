import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  downloadActiveLogo,
  downloadLogo,
  uploadActiveLogo,
  uploadLogo,
} from '../assets';
import { Styles } from '../lib/styles';
import { fonts } from '../lib/fonts';
import { colors } from '../lib/colors';
import React, { useState } from 'react';
import FileDownLoad from './FileDownLoad';
import FIleUpload from './FIleUpload';

const Home = () => {
  const [screen, setScreen] = useState<'upload' | 'download'>('upload');
  return (
    <View style={[Styles.flex]}>
      <View
        style={[
          Styles.p4,
          Styles.shadow,
          Styles.py6,
          { backgroundColor: colors.primary },
        ]}
      >
        <Text
          style={[
            Styles.fs18,
            fonts.heavy,
            Styles.textAlignCenter,
            { color: colors.white },
          ]}
        >
          File {screen === 'download' ? 'Download' : 'Upload'}
        </Text>
      </View>
      <ScrollView
        style={[Styles.flex, Styles.p4]}
        contentContainerStyle={[Styles.flexGrow]}
      >
        {screen === 'download' ? <FileDownLoad /> : <FIleUpload />}
      </ScrollView>
      <View
        style={[
          Styles.flexRow,
          Styles.justifyContentSpaceBetween,
          Styles.shadow,
          Styles.py4,
          { backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity
          onPress={() => setScreen('download')}
          style={[
            Styles.flex,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
            styles.bottomTabBtn,
          ]}
        >
          <Image
            source={screen === 'download' ? downloadActiveLogo : downloadLogo}
            style={[styles.bottomTabImg]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreen('upload')}
          style={[
            Styles.flex,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
            styles.bottomTabBtn,
          ]}
        >
          <Image
            source={screen === 'upload' ? uploadActiveLogo : uploadLogo}
            style={[styles.bottomTabImg]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomTabBtn: {
    height: 48,
  },
  bottomTabImg: {
    width: 40,
    height: 40,
  },
});

export default Home;
