import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/colors';
import { typography } from '@/constants/typography';

interface ErrorDialogProps {
  visible: boolean;
  title?: string;
  message: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryButtonPress: () => void;
  onSecondaryButtonPress?: () => void;
  onBackdropPress?: () => void;
}

/**
 * A reusable error dialog component.
 * Shows one button by default, with option to add a second button.
 */
export default function ErrorDialog({
  visible,
  title = 'Error',
  message,
  primaryButtonText = 'OK',
  secondaryButtonText,
  onPrimaryButtonPress,
  onSecondaryButtonPress,
  onBackdropPress,
}: ErrorDialogProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onPrimaryButtonPress}
    >
      <TouchableWithoutFeedback onPress={onBackdropPress || onPrimaryButtonPress}>
        <View style={styles.modalBackdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.dialogContainer}>
              {/* Error Icon */}
              <View style={styles.iconContainer}>
                <Ionicons name="alert-circle" size={40} color={colors.accent[100]} />
              </View>

              {/* Title */}
              <Text style={styles.title}>{title}</Text>

              {/* Message */}
              <Text style={styles.message}>{message}</Text>

              {/* Buttons */}
              <View style={styles.buttonContainer}>
                {/* Secondary button (optional) */}
                {secondaryButtonText && onSecondaryButtonPress && (
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={onSecondaryButtonPress}
                  >
                    <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
                  </TouchableOpacity>
                )}
                
                {/* Primary button (always shown) */}
                <TouchableOpacity 
                  style={styles.primaryButton}
                  onPress={onPrimaryButtonPress}
                >
                  <Text style={styles.primaryButtonText}>{primaryButtonText}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    width: '85%',
    backgroundColor: colors.white[100],
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    ...typography.heading3({ color: colors.black[100] }),
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMedium({ color: colors.black[200] }),
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.accent[100],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  primaryButtonText: {
    ...typography.buttonMedium({ color: colors.white[100] }),
  },
  secondaryButton: {
    backgroundColor: colors.white[200],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  secondaryButtonText: {
    ...typography.buttonMedium({ color: colors.black[100] }),
  },
}); 