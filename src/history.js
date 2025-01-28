import { createBrowserHistory } from 'history';

const env = process.env.NODE_ENV;
const basename = env === 'development' ? '' : '/react-2021-10-08';

const history = createBrowserHistory({ basename });

export default history;
