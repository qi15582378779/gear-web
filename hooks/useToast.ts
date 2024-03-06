import { useContext } from 'react';
import { ToastsContext } from 'contexts/toast';

const useToast = () => {
    const toastContext = useContext(ToastsContext);

    console.log('toastContext', toastContext);
    if (toastContext === undefined) {
        throw new Error('Toasts context undefined');
    }

    return toastContext;
};

export default useToast;
