import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 text-center px-4">
            <h1 className="text-6xl font-bold text-indigo-600">404</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">Page not found</p>
            <Link to="/" className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;
