import BaseModal from './Modal';
import { Text } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
  type: 'account-statement' | 'help-center' | 'language' | 'logout' | 
        'notifications' | 'security' | 'support' | 'terms' | 'two-factor' | 
        'referral' | 'delete-account';
}

export default function SettingsModal({ isVisible, onClose, type }: SettingsModalProps) {
  const { colors } = useTheme();

  const getContent = () => {
    switch (type) {
      case 'account-statement':
        return {
          title: 'Account Statement',
          content: 'Generate and download your account statements in PDF or CSV format.',
        };
      case 'help-center':
        return {
          title: 'Help Center',
          content: 'Find answers to common questions and get help with your account.',
        };
      case 'language':
        return {
          title: 'Language Settings',
          content: 'Choose your preferred language for the application.',
        };
      case 'logout':
        return {
          title: 'Log Out',
          content: 'Are you sure you want to log out of your account?',
        };
      case 'notifications':
        return {
          title: 'Notification Settings',
          content: 'Customize your notification preferences and alerts.',
        };
      case 'security':
        return {
          title: 'Security Settings',
          content: 'Update your password and security preferences.',
        };
      case 'support':
        return {
          title: 'Contact Support',
          content: 'Get in touch with our support team for assistance.',
        };
      case 'terms':
        return {
          title: 'Terms & Privacy',
          content: 'Review our terms of service and privacy policy.',
        };
      case 'two-factor':
        return {
          title: 'Two-Factor Authentication',
          content: 'Set up two-factor authentication to enhance your account security.',
        };
      case 'referral':
        return {
          title: 'Referral Program',
          content: 'Share your referral code with friends and earn rewards.',
        };
      case 'delete-account':
        return {
          title: 'Delete Account',
          content: 'Are you sure you want to permanently delete your account? This action cannot be undone.',
        };
      default:
        return { title: 'Settings', content: 'Settings content' };
    }
  };

  const { title, content } = getContent();

  return (
    <BaseModal isVisible={isVisible} onClose={onClose} title={title}>
      <Text style={{ color: colors.textSecondary, fontSize: 16, lineHeight: 24 }}>
        {content}
      </Text>
    </BaseModal>
  );
}