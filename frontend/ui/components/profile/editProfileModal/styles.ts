import { StyleSheet, Platform } from 'react-native';
import { colors } from '@styles/colors';

export const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background.black,
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    padding: 8,
  },
  cancelText: {
    color: colors.text.grey,
    fontSize: 16,
  },
  saveText: {
    color: colors.green,
    fontSize: 16,
    fontWeight: '600',
  },
  modalTitle: {
    color: colors.text.white,
    fontSize: 18,
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: colors.text.grey,
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.input.background,
    color: colors.input.text,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.input.background,
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: colors.green,
  },
  genderButtonText: {
    color: colors.text.grey,
    fontSize: 16,
  },
  genderButtonTextSelected: {
    color: colors.text.white,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
});