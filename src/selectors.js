const selectors = {
  searchBox: [
    'div[aria-label="Search input textbox"]',
    'div[aria-placeholder="Ask Meta AI or Search"]',
    'p.selectable-text.copyable-text.x15bjb6t.x1n2onr6',
    'div[contenteditable="true"][role="textbox"][data-tab="3"]'
  ],
  newChatSearchBox: [
    'div[aria-label="Search name or number"][contenteditable="true"]',
    'div[aria-placeholder="Search name or number"][contenteditable="true"]',
    'div[data-tab="3"][contenteditable="true"][role="textbox"]'
  ],
  messageBox: [
    'div[aria-placeholder="Type a message"][contenteditable="true"]',
    'div[placeholder="Type a message"][contenteditable="true"]',
    'div[contenteditable="true"][role="textbox"]'
  ]
};

module.exports = { selectors };