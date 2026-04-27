import React from "react";

export default function Support() {
  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-800">Support Cricket Clips</h1>
      <p className="mb-4 text-gray-700">
        If you enjoy using Cricket Clips and want to support its development, please consider making a donation. Your support helps us cover server costs and add new features!
      </p>
      <div className="mb-6">
        <a
          href="https://www.buymeacoffee.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-500 transition"
        >
          Donate via Buy Me a Coffee
        </a>
      </div>
      <div>
        <p className="mb-2 text-gray-700">Or donate via UPI:</p>
        <div className="bg-gray-100 p-2 rounded font-mono text-blue-900 select-all">
          your-upi-id@upi
        </div>
      </div>
    </div>
  );
}