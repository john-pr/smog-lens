import { useTranslation } from 'react-i18next';
import { Lock, Info } from 'lucide-react';

const LocationBlockedModal = ({ onClose }) => {
    const { t } = useTranslation();
    
    const handleClose = () => {
        if (typeof onClose === 'function') {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center backdrop-blur-sm bg-white/30">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-4">
                <h2 className="text-xl font-semibold mb-4 text-orange-600">{t('location_blocked_title')}</h2>
                <p className="text-gray-700 mb-4">
                    {t('location_blocked_message')}
                </p>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-2">
                    <li>
                        {t('location_blocked_step1_prefix')} 
                        <Lock className="inline mx-1.5" size={15} aria-label="lock icon" />
                        {t('location_blocked_or')}
                        <Info className="inline mx-1.5" size={15} aria-label="info icon" />
                        {t('location_blocked_step1_suffix')}
                    </li>
                    <li>{t('location_blocked_step2')}</li>
                    <li>{t('location_blocked_step3')}</li>
                    <li>{t('location_blocked_step4')}</li>
                </ol>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors cursor-pointer"
                    >
                        {t('location_blocked_ok')}
                    </button>
                </div>
            </div>
        </div>
    );
};
export default LocationBlockedModal;
