export interface TourButton {
  action: () => void;
  classes?: string;
  text: string;
  key?: string;
  secondary?: boolean;
}
