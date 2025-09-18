import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Text,
  ActivityIndicator,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Styles } from '../lib/styles';
import { colors } from '../lib/colors';
import { downloadIcon } from '../assets';
import DownloadItem from './DownloadItem';
import { DownloadItemType } from '../types/types';
import { fonts } from '../lib/fonts';
import { BASE_URL } from '@env';

const FileDownLoad = () => {
  const [url, setUrl] = useState<string>('');
  const [urls, setUrls] = useState<DownloadItemType[]>([]);

  const getFiles = useCallback(async () => {
    try {
      const res = await fetch(
        `${BASE_URL}/getFiles`,
        {
          method: 'GET',
        },
      );
      const response = await res.json();
      if (response?.data) {
        setUrls(response?.data);
      }
    } catch (error) {
      console.log('Get FIles', error);
    }
  }, []);

  useEffect(() => {
    getFiles();
  }, []);

  const renderItem = useCallback(
    ({ item, index }: { item: DownloadItemType; index: number }) => {
      return <DownloadItem item={item} index={index} />;
    },
    [],
  );
  return (
    <View style={[Styles.flex]}>
      {/* <View
        style={[
          styles.inputContainer,
          Styles.bw1,
          Styles.br1,
          Styles.flexRow,
          Styles.alignItemsCenter,
          Styles.justifyContentSpaceBetween,
          Styles.mb4,
          { borderColor: colors.black },
        ]}
      >
        <TextInput
          placeholder="Past your URL"
          style={[Styles.px2, Styles.flex]}
          value={url}
          onChangeText={text => setUrl(text)}
        />
        <TouchableOpacity
          style={[
            styles.iconContainer,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
          ]}
          onPress={() => handleDownload({ url: url, name: '' })}
        >
          <Image source={downloadIcon} style={[styles.icon]} />
        </TouchableOpacity>
      </View> */}
      <Text
        style={[
          Styles.fs20,
          Styles.mb4,
          Styles.textAlignCenter,
          fonts.heavy,
          { color: colors.primary },
        ]}
      >
        Files
      </Text>
      <FlatList
        data={urls}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <ActivityIndicator size={48} color={colors.primary} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    height: 44,
  },
  iconContainer: {
    height: 44,
    width: 44,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default FileDownLoad;
