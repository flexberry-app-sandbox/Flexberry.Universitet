import { ROUTES_CONFIG } from './routes.config';

export interface IMenuItem {
  title: string;
  path: string;
  icon?: string;
  children?: IMenuItem[];
}

export const MENU_CONFIG: IMenuItem[] = [
  {
    title: 'Главная',
    path: ROUTES_CONFIG.MAIN,
    icon: 'icon-point',
  },
];
