import { Block, DividerBlock, InputBlock, InputBlockElement, ModalView } from '@slack/types';
import { COMMS_REQUEST_CALLBACK_ID } from './commsRequestModal';

type BlockInput = {
  id: string;
  label: string;
  optional: boolean;
};

export function createInputSection(params: BlockInput, element: InputBlockElement): InputBlock {
  return {
    type: 'input',
    block_id: params.id,
    label: {
      type: 'plain_text',
      text: params.label,
    },
    optional: params.optional,
    element: element,
  };
}

type CreateDropdownBlockParams = BlockInput & {
  options: { label: string; value: string }[];
};

export function createDropdownBlock({ options, ...params }: CreateDropdownBlockParams) {
  return createInputSection(params, {
    type: 'static_select',
    options: options.map((option) => ({
      text: {
        type: 'plain_text',
        emoji: true,
        text: option.label,
      },

      value: option.value,
    })),
    action_id: params.id,
  });
}

type CreateCheckboxBlockParams = BlockInput & {
  options: { label: string; value: string }[];
};

export function createCheckboxBlock({ options, ...params }: CreateCheckboxBlockParams) {
  return createInputSection(params, {
    type: 'checkboxes',
    options: options.map((option) => ({
      text: {
        type: 'plain_text',
        emoji: true,
        text: option.label,
      },
      value: option.value,
    })),
    action_id: params.id,
  });
}

type CreateDatePickerBlockParams = BlockInput & {};

export function createDatePickerBlockParams(params: CreateDatePickerBlockParams) {
  return createInputSection(params, {
    type: 'datepicker',
    action_id: params.id,
  });
}

type CreateTextFieldBlockParams = BlockInput & {
  multiline: boolean;
};

export function createTextFieldBlock({ multiline, ...params }: CreateTextFieldBlockParams) {
  return createInputSection(params, {
    type: 'plain_text_input',
    multiline: multiline,
    action_id: params.id,
  });
}

export function divider(): DividerBlock {
  return {
    type: 'divider',
  };
}

type CreateModalParams = {
  title: string;
  formId?: string;
  blocks: Block[];
};

export function createModal({ title, formId, blocks }: CreateModalParams): ModalView {
  return {
    title: {
      type: 'plain_text',
      text: title,
      emoji: true,
    },
    submit: formId
      ? {
          type: 'plain_text',
          text: 'Submit',
          emoji: true,
        }
      : undefined,
    type: 'modal',
    close: {
      type: 'plain_text',
      text: 'Cancel',
      emoji: true,
    },
    callback_id: formId,
    blocks: blocks,
  };
}
