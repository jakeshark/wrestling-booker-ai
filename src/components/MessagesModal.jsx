const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const MessagesModal = ({
  isOpen,
  onClose,
  contacts,
  selectedContact,
  conversationMessages,
  onContactClick,
  onReplyHover,
  onReplyHoverLeave,
  onReplyClick,
  onReplyDraftChange,
  onSendReply,
  replyOptions,
  replyInputValue
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-gray-800 rounded-3xl shadow-2xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden"
        onClick={event => event.stopPropagation()}
      >
        <div className="w-full md:w-1/3 bg-gray-900 border-r border-gray-700">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Backstage Messages</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[70vh]">
            {contacts.length === 0 ? (
              <p className="text-gray-400 p-4">No messages yet.</p>
            ) : (
              contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => onContactClick(contact.id)}
                  className={`w-full text-left px-4 py-3 flex flex-col border-b border-gray-700 hover:bg-gray-700 transition ${
                    selectedContact && contact.id === selectedContact.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <span className="text-white font-semibold">{contact.name}</span>
                  <span className="text-xs text-gray-400 truncate">{contact.latestSnippet}</span>
                  {contact.latestTimestamp && (
                    <span className="text-[10px] text-gray-500">
                      {contact.latestTimestamp.toDate().toLocaleString()}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3 bg-gray-900 flex flex-col">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">
                {selectedContact ? selectedContact.name : 'Select a person'}
              </h3>
              <p className="text-xs text-gray-400">Backstage messages (shoot)</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {conversationMessages.length === 0 ? (
              <p className="text-gray-500 text-center mt-4">No messages with this person yet.</p>
            ) : (
              conversationMessages.map(message => {
                const isBooker = message.senderId === 'booker';
                return (
                  <div key={message.id} className={`flex ${isBooker ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                        isBooker ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-700 text-white rounded-bl-none'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">{message.body}</p>
                      <p className="text-[10px] text-gray-200 mt-1 text-right">
                        {message.timestamp ? message.timestamp.toDate().toLocaleString() : ''}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {selectedContact && (
            <div className="p-4 border-t border-gray-800 bg-gray-900">
              <div className="flex space-x-2 mb-3">
                {['Yes', 'No', 'Maybe'].map((label, index) => {
                  const hoverText = replyOptions[index] || '';
                  return (
                    <button
                      key={label}
                      className="px-3 py-1 bg-gray-700 text-white text-sm rounded-lg hover:bg-gray-600"
                      onMouseEnter={() => onReplyHover(hoverText)}
                      onMouseLeave={onReplyHoverLeave}
                      onClick={() => onReplyClick(hoverText || label)}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={replyInputValue}
                  onChange={onReplyDraftChange}
                  placeholder="Type your reply..."
                  className="flex-grow bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  onClick={onSendReply}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesModal;
