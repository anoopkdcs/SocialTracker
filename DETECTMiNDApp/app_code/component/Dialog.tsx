import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Dialog as RNPDialog, Portal, Text } from 'react-native-paper';

const Dialog = () => {
  const [visible, setVisible] = React.useState(false);

  const hideDialog = () => setVisible(false);

  return (
    <Portal>
      <RNPDialog visible={visible} onDismiss={hideDialog}>
        <RNPDialog.Icon icon="alert" />
        <RNPDialog.Title style={styles.title}>This is a title</RNPDialog.Title>
        <RNPDialog.Content>
          <Text variant="bodyMedium">This is simple dialog</Text>
        </RNPDialog.Content>
      </RNPDialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
  },
})

export default Dialog;
