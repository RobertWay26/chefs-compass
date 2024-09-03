'use client';

const ConfirmDelete = ({ onConfirm, onCancel }) => {
  return (
    <div className="absolute bg-white p-3 border border-gray-300 shadow-lg rounded-md mt-2 z-10">
      <p className="text-sm">Are you sure you want to delete this recipe?</p>
      <div className="flex mt-2 space-x-2">
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 transition-colors"
        >
          Yes
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-black py-1 px-3 rounded hover:bg-gray-300 transition-colors"
        >
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmDelete;