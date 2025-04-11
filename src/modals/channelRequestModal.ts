import { createCheckboxBlock, createModal, createTextFieldBlock } from './utils';

export const CHANNEL_REQUEST_MODAL_ID = 'channel_request_modal';

export const CHANNEL_REQUEST_MODAL_CHANNEL_DROPDOWN = 'channel_request_modal_channel_dropdown';
export const CHANNEL_REQUEST_MODAL_REASON = 'tech_request_modal_description';

export const CHANNEL_REQUEST_MODAL = createModal({
  title: 'Channel Request',
  formId: CHANNEL_REQUEST_MODAL_ID,
  blocks: [
    createCheckboxBlock({
      id: CHANNEL_REQUEST_MODAL_CHANNEL_DROPDOWN,
      label: 'Channel(s)',
      optional: false,
      options: [
        { label: 'Ad-Comm', value: '#ad-comm' },
        { label: 'Other', value: 'Other' },
      ],
    }),
    createTextFieldBlock({
      id: CHANNEL_REQUEST_MODAL_REASON,
      label: 'Reason for joining channel',
      optional: false,
      multiline: true,
    }),
  ],
});
