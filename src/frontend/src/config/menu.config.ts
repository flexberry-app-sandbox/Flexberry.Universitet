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
  {
    title: 'Airtransfers',
    path: '',
    children: [
      {
        title: 'Airport',
        path: ROUTES_CONFIG.AIRPORT_L,
        icon: 'icon-point',
      },
      {
        title: 'Flight',
        path: ROUTES_CONFIG.FLIGHT_L,
        icon: 'icon-point',
      },
      {
        title: 'Passenger',
        path: ROUTES_CONFIG.PASSENGER_L,
        icon: 'icon-point',
      },
      {
        title: 'Aircraft',
        path: ROUTES_CONFIG.AIRCRAFT_L,
        icon: 'icon-point',
      },
      {
        title: 'Airplane',
        path: ROUTES_CONFIG.AIRPLANE_L,
        icon: 'icon-point',
      },
      {
        title: 'Helicopter',
        path: ROUTES_CONFIG.HELICOPTER_L,
        icon: 'icon-point',
      },
    ],
  },
];
