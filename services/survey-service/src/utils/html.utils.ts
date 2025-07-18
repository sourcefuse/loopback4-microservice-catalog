export const convertHtmlBase64ToUtf8 = (html: string) => {
  if (html) {
    html = Buffer.from(html, 'base64').toString('utf8');
  }
  return html;
};

export const convertHtmlUtf8ToBase64 = (html?: string) => {
  if (html) {
    html = Buffer.from(html).toString('base64');
  }
  return html;
};

export function unescapeHtml(unsafe?: string) {
  if (!unsafe) {
    return unsafe;
  }
  try {
    unsafe = convertHtmlBase64ToUtf8(unsafe);
    return decodeURIComponent(unsafe);
  } catch (error) {
    // sonarignore-next-line
    console.error('Failed to unescape HTML:', error);
    return unsafe;
  }
}

export enum REGEX {
  EMAIL = "[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+",
  NO_WHITE_SPACE = '^(?=\\s*\\S).+$',
  TWO_DECIMAL_PLACE = '^-?\\d*(\\.\\d{0,2})?$',
}

export function escapeHtml(unsafe?: string) {
  if (!unsafe) {
    return unsafe;
  }
  try {
    return Buffer.from(encodeURIComponent(unsafe)).toString('base64');
  } catch (error) {
    // sonarignore-next-line
    console.error('Item validation failed:', error);
    return unsafe;
  }
}
