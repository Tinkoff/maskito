import {TuiDocPages} from '@taiga-ui/addon-doc';
import {DemoPath} from '../app/app.routes';

export const DEMO_PAGES: TuiDocPages = [
    {
        section: 'Documentation',
        title: 'Browser support',
        route: DemoPath.BrowserSupport,
        keywords: `chrome, safari, ie, edge, firefox`,
    },
    {
        section: 'Kit',
        title: 'Number',
        route: DemoPath.Number,
        keywords: `digit, number, money, mask, kit, generator`,
    },
    {
        section: 'Kit',
        title: 'Time',
        route: DemoPath.Time,
        keywords: `time, hour, minute, second, mask, kit, generator`,
    },
];
