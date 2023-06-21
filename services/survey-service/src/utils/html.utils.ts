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
    return unsafe;
  }
}

export function escapeHtml(unsafe?: string) {
  if (!unsafe) {
    return unsafe;
  }
  try {
    return Buffer.from(encodeURIComponent(unsafe)).toString('base64');
  } catch (error) {
    return unsafe;
  }
}
