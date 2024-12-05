export interface AvatarProps {
    size?: 'small' | 'medium' | 'large' | 'xlarge';
    imageUrl?: string;
    onPress?: () => void;
    showBorder?: boolean;
  }
  
  export interface AvatarStylesProps {
    size: number;
    showBorder: boolean;
  }