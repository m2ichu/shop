import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserMenu from './UserMenu';

interface Category {
  _id: string;
  name: string;
}

const Navbar: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const isAuthenticated = localStorage.getItem('token');

  const getCategories = async (): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3000/api/category/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <>
      <nav className="fixed w-full bg-gray-900 h-16 shadow-md px-6 flex items-center justify-between z-50">
        <div>
          <Link to="/" className="text-2xl font-bold text-white hover:text-amber-300 transition duration-200">
            Sklep
          </Link>
        </div>

        <div className="hidden md:flex space-x-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/category/${cat.name}`}
              className="text-white hover:text-amber-300 transition duration-150"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div>
          {isAuthenticated ? (
              <UserMenu />
          ) : (
            <Link to="/login" className="text-white hover:text-amber-300 transition duration-200  md:text-base text-2xl font-bold">
              Login
            </Link>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default Navbar;
