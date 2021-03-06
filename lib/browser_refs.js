// A list of variables found on the window object 
// when loading an empty page in the Zombie headless browser.
// Used to find out when global variables a script adds.

module.exports = [
	'ScriptProbe', // This is used for a few internal things in the test page.
	'addEventListener',
	'removeEventListener',
	'dispatchEvent',
	'raise',
	'setTimeout',
	'setInterval',
	'clearInterval',
	'clearTimeout',
	'__stopAllTimers',
	'run',
	'getGlobal',
	'dispose',
	'top',
	'parent',
	'self',
	'frames',
	'window',
	'location',
	'closed',
	'StorageEvent',
	'alert',
	'confirm',
	'prompt',
	'XMLHttpRequest',
	'atob',
	'btoa',
	'EventSource',
	'WebSocket',
	'Image',
	'console',
	'resizeTo',
	'resizeBy',
	'postMessage',
	'_listeners',
	'_evaluate',
	'onerror',
	'open',
	'close',
	'document',
	'_length',
	'length',
	'getComputedStyle',
	'navigator',
	'name',
	'innerWidth',
	'innerHeight',
	'outerWidth',
	'outerHeight',
	'pageXOffset',
	'pageYOffset',
	'screenX',
	'screenY',
	'screenLeft',
	'screenTop',
	'scrollX',
	'scrollY',
	'scrollTop',
	'scrollLeft',
	'blur',
	'createPopup',
	'focus',
	'moveBy',
	'moveTo',
	'print',
	'scroll',
	'scrollBy',
	'scrollTo',
	'screen',
	'languageProcessors',
	'resourceLoader',
	'HTMLCollection',
	'HTMLOptionsCollection',
	'HTMLDocument',
	'HTMLElement',
	'HTMLFormElement',
	'HTMLLinkElement',
	'HTMLMetaElement',
	'HTMLHtmlElement',
	'HTMLHeadElement',
	'HTMLTitleElement',
	'HTMLBaseElement',
	'HTMLIsIndexElement',
	'HTMLStyleElement',
	'HTMLBodyElement',
	'HTMLSelectElement',
	'HTMLOptGroupElement',
	'HTMLOptionElement',
	'HTMLInputElement',
	'HTMLTextAreaElement',
	'HTMLButtonElement',
	'HTMLLabelElement',
	'HTMLFieldSetElement',
	'HTMLLegendElement',
	'HTMLUListElement',
	'HTMLOListElement',
	'HTMLDListElement',
	'HTMLDirectoryElement',
	'HTMLMenuElement',
	'HTMLLIElement',
	'HTMLDivElement',
	'HTMLParagraphElement',
	'HTMLHeadingElement',
	'HTMLQuoteElement',
	'HTMLPreElement',
	'HTMLBRElement',
	'HTMLBaseFontElement',
	'HTMLFontElement',
	'HTMLHRElement',
	'HTMLModElement',
	'HTMLAnchorElement',
	'HTMLImageElement',
	'HTMLObjectElement',
	'HTMLParamElement',
	'HTMLAppletElement',
	'HTMLMapElement',
	'HTMLAreaElement',
	'HTMLScriptElement',
	'HTMLTableElement',
	'HTMLTableCaptionElement',
	'HTMLTableColElement',
	'HTMLTableSectionElement',
	'HTMLTableRowElement',
	'HTMLTableCellElement',
	'HTMLFrameSetElement',
	'HTMLFrameElement',
	'HTMLIFrameElement',
	'SECURITY_ERR',
	'NETWORK_ERR',
	'ABORT_ERR',
	'_augmented',
	'INVALID_STATE_ERR',
	'SYNTAX_ERR',
	'INVALID_MODIFICATION_ERR',
	'NAMESPACE_ERR',
	'INVALID_ACCESS_ERR',
	'StyleSheet',
	'MediaList',
	'CSSStyleSheet',
	'CSSRule',
	'CSSStyleRule',
	'CSSMediaRule',
	'CSSImportRule',
	'CSSStyleDeclaration',
	'StyleSheetList',
	'mapper',
	'mapDOMNodes',
	'visitTree',
	'markTreeReadonly',
	'INDEX_SIZE_ERR',
	'DOMSTRING_SIZE_ERR',
	'HIERARCHY_REQUEST_ERR',
	'WRONG_DOCUMENT_ERR',
	'INVALID_CHARACTER_ERR',
	'NO_DATA_ALLOWED_ERR',
	'NO_MODIFICATION_ALLOWED_ERR',
	'NOT_FOUND_ERR',
	'NOT_SUPPORTED_ERR',
	'INUSE_ATTRIBUTE_ERR',
	'exceptionMessages',
	'DOMException',
	'NodeList',
	'DOMImplementation',
	'Node',
	'NamedNodeMap',
	'AttrNodeMap',
	'NotationNodeMap',
	'EntityNodeMap',
	'Element',
	'DocumentFragment',
	'ProcessingInstruction',
	'Document',
	'CharacterData',
	'Attr',
	'Text',
	'Comment',
	'CDATASection',
	'DocumentType',
	'Notation',
	'Entity',
	'EntityReference'
];