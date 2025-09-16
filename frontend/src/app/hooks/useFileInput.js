import { useState, useEffect } from 'react';

/**
 * A reusable hook to manage file inputs with image previews.
 * Returns an array for consistency with other form hooks.
 * @param {Object} initialInputs - The initial state for the form inputs.
 * @returns {Array} An array containing [inputs, handleFileChange, setInputs, filesToUpload].
 */
export const useFileInput = (initialInputs = {}) => {
    const [inputs, setInputs] = useState(initialInputs);
    const [filesToUpload, setFilesToUpload] = useState({});

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        if (files && files[0]) {
        const file = files[0];

        setFilesToUpload(prevFiles => ({
            ...prevFiles,
            [name]: file,
        }));

        setInputs(prevInputs => ({
            ...prevInputs,
            [name]: URL.createObjectURL(file),
        }));
        }
    };

    useEffect(() => {
        const objectUrls = Object.values(inputs).filter(
        value => typeof value === 'string' && value.startsWith('blob:')
        );

        return () => {
        objectUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [inputs]);

    // Return an array instead of an object
    // 1. inputs: State for UI (e.g., preview URLs)
    // 2. handleFileChange: The onChange handler
    // 3. setInputs: Setter for initial data
    // 4. filesToUpload: State for actual File objects for submission
    return [inputs, handleFileChange, setInputs, filesToUpload];
};