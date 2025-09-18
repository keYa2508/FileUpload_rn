import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import { UploadItemType } from '../types/types';
import { Styles } from '../lib/styles';
import { colors } from '../lib/colors';
import { deleteIcon, uploadIcon } from '../assets';

interface Props {
  item: UploadItemType;
  index: number;
  deleteAction: (index: number) => void;
}

const UploadItem: React.FC<Props> = ({ item, index, deleteAction }) => {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <View
      key={index}
      style={[
        Styles.pl4,
        Styles.flexRow,
        Styles.alignItemsCenter,
        Styles.justifyContentSpaceBetween,
        Styles.bw1,
        Styles.br1,
        Styles.mb4,
        { borderColor: colors.border },
      ]}
    >
      <Text style={[Styles.fs14, Styles.flex, { color: colors.text }]}>
        {item.name}
      </Text>
      {loading ? (
        <View
          style={[
            styles.iconContainer,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
          ]}
        >
          <ActivityIndicator size={24} color={colors.primary} />
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.iconContainer,
            Styles.alignItemsCenter,
            Styles.justifyContentCenter,
          ]}
          onPress={() => deleteAction(index)}
        >
          <Image source={uploadIcon} style={[styles.icon]} />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[
          styles.iconContainer,
          Styles.alignItemsCenter,
          Styles.justifyContentCenter,
        ]}
        onPress={() => deleteAction(index)}
      >
        <Image source={deleteIcon} style={[styles.icon]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    height: 44,
    width: 44,
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default UploadItem;
