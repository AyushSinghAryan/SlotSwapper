import React, { useState } from 'react';
import { Calendar, ArrowRightLeft, Bell, LogOut, Menu, X } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ currentPage, setCurrentPage }) => {
    const { logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Calendar },
        { id: 'marketplace', label: 'Marketplace', icon: ArrowRightLeft },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left Section */}
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-blue-600">SlotSwapper</span>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => setCurrentPage(item.id)}
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${currentPage === item.id
                                        ? 'border-blue-500 text-gray-900'
                                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                    }`}
                            >
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.label}
                            </button>
                        ))}
                    </div>

                    {/* Desktop Logout Button */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center">
                        <Button onClick={logout} variant="outline">
                            <LogOut className="h-5 w-5" />
                            <span>Logout</span>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex sm:hidden items-center">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu (only visible when menuOpen = true) */}
            {menuOpen && (
                <div className="sm:hidden px-2 pb-3 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setCurrentPage(item.id);
                                setMenuOpen(false);
                            }}
                            className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${currentPage === item.id
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <div className="flex items-center">
                                <item.icon className="h-5 w-5 mr-2" />
                                {item.label}
                            </div>
                        </button>
                    ))}

                    <Button
                        onClick={logout}
                        variant="outline"
                        className="w-full flex justify-center items-center mt-2"
                    >
                        <LogOut className="h-5 w-5 mr-2" />
                        <span>Logout</span>
                    </Button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
