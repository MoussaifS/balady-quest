import React, { useState } from 'react';
import { FiCamera, FiEdit3, FiCheck, FiX,  } from 'react-icons/fi'; // Using IoQrCode as placeholder
import { IoQrCode } from "react-icons/io5";

// Basic QR Scanner Placeholder (replace with actual library like react-qr-scanner)
const QrScannerPlaceholder = ({ onScan }) => (
    <div className="w-full h-48 bg-gray-800 rounded-lg flex flex-col items-center justify-center text-gray-400 mb-3">
        <IoQrCode size={60} />
        <p className="mt-2 text-sm">QR Scanner Area</p>
        <button
            onClick={() => onScan('SIMULATED_QR_VALUE_' + Date.now())} // Simulate scan
            className="mt-3 bg-cyan-600 text-white px-3 py-1 rounded text-xs"
        >
            Simulate Scan
        </button>
    </div>
);

// Basic Camera Placeholder
const CameraPlaceholder = ({ onCapture }) => (
    <div className="w-full h-48 bg-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-500 mb-3">
        <FiCamera size={60} />
        <p className="mt-2 text-sm">Camera View Area</p>
        <button
            onClick={() => onCapture('SIMULATED_IMAGE_DATA')} // Simulate capture
            className="mt-3 bg-cyan-600 text-white px-3 py-1 rounded text-xs"
        >
            Simulate Capture
        </button>
    </div>
);


function SubmissionModal({ step, onClose, onSubmit }) {
    const [answer, setAnswer] = useState('');
    const [scannedData, setScannedData] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);

    const handleSubmit = () => {
        let submissionData = null;
        if (step.type === 'qa') {
            submissionData = answer;
        } else if (step.type === 'qr') {
            submissionData = scannedData;
        } else if (step.type === 'photo') {
            submissionData = capturedImage;
        }
        onSubmit(step.id, submissionData); // Pass step ID and the data
    };

    const renderContent = () => {
        switch (step.type) {
            case 'qa':
                return (
                    <div>
                        <p className="text-gray-700 mb-3">{step.question}</p>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-3"
                            placeholder="Your answer..."
                        />
                    </div>
                );
            case 'qr':
                return (
                    <div>
                        <p className="text-gray-700 mb-2">Scan the QR code described in the hint.</p>
                        <QrScannerPlaceholder onScan={setScannedData} />
                        {scannedData && <p className="text-green-600 text-xs break-all">Scanned: {scannedData}</p>}
                    </div>
                );
            case 'photo':
                return (
                    <div>
                        <p className="text-gray-700 mb-2">{step.photoPrompt}</p>
                        <CameraPlaceholder onCapture={setCapturedImage}/>
                        {capturedImage && <p className="text-green-600 text-xs">Image captured (simulation)</p>}
                    </div>
                );
            default:
                return <p className="text-red-500">Unknown submission type!</p>;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl p-5 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 p-1"
                    aria-label="Close"
                >
                    <FiX size={20} />
                </button>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">Submit Step {step.id}</h3>
                <p className="text-sm text-gray-500 mb-4 italic">Hint: {step.hint}</p>

                {renderContent()}

                <div className="mt-5 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 flex items-center space-x-1"
                        // Disable button until input/scan/photo is ready if needed
                        // disabled={ (step.type === 'qa' && !answer) || (step.type === 'qr' && !scannedData) || (step.type === 'photo' && !capturedImage)}
                    >
                        <FiCheck size={18} />
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubmissionModal;