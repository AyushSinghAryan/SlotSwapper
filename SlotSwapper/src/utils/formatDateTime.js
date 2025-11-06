export const formatDateTime = (isoString) => {
    try {
        return new Date(isoString).toLocaleString(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    } catch (e) {
        return 'Invalid Date';
    }
};