const selectors = {
  searchBox: [
    'div[aria-placeholder="Search or start a new chat"][contenteditable="true"]',
    'div[data-tab="3"][contenteditable="true"]',
    'div[role="textbox"][contenteditable="true"]'
  ],

  messageBox: [
    'div[aria-placeholder="Type a message"][contenteditable="true"]',
    'div[placeholder="Type a message"][contenteditable="true"]',
    'div[contenteditable="true"][role="textbox"]'
  ]
};

module.exports = { selectors };
