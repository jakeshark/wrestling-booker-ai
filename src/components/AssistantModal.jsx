import React from 'react';

const AssistantModal = ({
  open,
  onClose,
  assistantQuery,
  setAssistantQuery,
  assistantResponse,
  isAssistantLoading,
  onSend,
  AssistantIcon,
  CloseIcon,
  LoadingIcon
}) => {
  if (!open) return null;

  const AssistantIconComponent = AssistantIcon || (() => null);
  const CloseIconComponent = CloseIcon || (() => null);
  const LoadingIconComponent = LoadingIcon || (() => null);

  const handleContainerClick = (event) => {
    event.stopPropagation();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !isAssistantLoading && assistantQuery) {
      onSend();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col"
        onClick={handleContainerClick}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <AssistantIconComponent />
            AI Booker Assistant
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <CloseIconComponent />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-4">
          {assistantResponse ? (
            <div className="p-4 bg-gray-700 rounded-lg whitespace-pre-wrap font-mono text-sm">
              {assistantResponse}
            </div>
          ) : (
            <div className="text-center text-gray-400 p-8">
              <p className="text-lg">Welcome, Booker.</p>
              <p>Ask me for creative advice, booking ideas, or who to push.</p>
              <p className="text-sm mt-4">(e.g., "Who has main event potential?" or "Give me a feud idea for Alex Valour.")</p>
            </div>
          )}

          {isAssistantLoading && (
            <div className="flex items-center justify-center p-4">
              <LoadingIconComponent />
              <span className="ml-2">Assistant is thinking...</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <div className="flex space-x-2">
            <input
              type="text"
              value={assistantQuery}
              onChange={(e) => setAssistantQuery(e.target.value)}
              placeholder="Ask for booking advice..."
              className="flex-grow bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isAssistantLoading}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={onSend}
              disabled={isAssistantLoading || !assistantQuery}
              className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 transition-all disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantModal;
