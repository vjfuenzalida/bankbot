export interface LoginCredentials {
  username: string;
  password: string;
}

export interface BaseDialog {
  start: () => void;
  stop: () => void;
}