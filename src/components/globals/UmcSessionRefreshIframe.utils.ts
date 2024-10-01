export interface UmcSessionRefreshResponse {
  status: number;
}

export function getResultFromIframe(element: HTMLIFrameElement): UmcSessionRefreshResponse | undefined {
  const textarea = element.contentDocument?.getElementsByTagName('textarea').item(0);
  if (!textarea) {
    return undefined;
  }
  try {
    const response = JSON.parse(textarea.value);
    return validateResponse(response);
  } catch (e) {
    console.error('Parsing the UMC session refresh result did fail', e);
  }
  return undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateResponse(response: any) : UmcSessionRefreshResponse | undefined {
  if (typeof response?.status === 'number') {
    return {
      status: response.status,
    };
  }
  return undefined;
}
