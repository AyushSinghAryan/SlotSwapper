import React from 'react';
import { Loader2 } from 'lucide-react';


const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
    </div>
);


export default LoadingSpinner;