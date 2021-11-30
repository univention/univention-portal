// TODO move functionality into individual widgets (?)

// TODO translation syntax for the debian handling
import _ from '@/jsHelper/translate';

export function isEmpty(widget, value): boolean {
  switch (widget.type) {
    case 'TextBox':
    case 'DateBox':
    case 'ComboBox':
    case 'PasswordBox':
      return value === '';
    case 'MultiInput':
      return value.every((row) => {
        if (Array.isArray(row)) {
          return row.every((rowValue, idx) => isEmpty(widget.subtypes[idx], rowValue));
        }
        return isEmpty(widget.subtypes[0], row);
      });
    default:
      return false;
  }
}

export function isValid(widget): boolean {
  if (widget.invalidMessage === undefined) {
    return true;
  }
  switch (widget.type) {
    case 'TextBox':
    case 'DateBox':
    case 'ComboBox':
    case 'PasswordBox':
      return widget.invalidMessage === '';
    case 'MultiInput':
      return widget.invalidMessage.all === '' &&
        widget.invalidMessage.values.every((message) => {
          if (Array.isArray(message)) {
            return message.every((_message, idx) => isValid({
              type: widget.subtypes[idx].type,
              invalidMessage: _message,
            }));
          }
          return isValid({
            type: widget.subtypes[0].type,
            invalidMessage: message,
          });
        });
    default:
      return true;
  }
}

export function allValid(widgets): boolean {
  return widgets.every((widget) => isValid(widget));
}

export function validate(widget, value): void {
  switch (widget.type) {
    case 'TextBox':
    case 'DateBox':
    case 'ComboBox':
    case 'PasswordBox':
      widget.invalidMessage = widget.required && isEmpty(widget, value) ? _('This value is required') : '';
      break;
    case 'MultiInput':
      widget.invalidMessage = {
        all: widget.required && isEmpty(widget, value) ? _('This value is required') : '',
        values: [], // TODO handling of required for subtypes.
      };
      break;
    default:
      break;
  }
}

export function validateAll(widgets, values): void {
  widgets.forEach((widget) => {
    validate(widget, values[widget.name]);
  });
}

export function initialValue(widget, value): any {
  switch (widget.type) {
    case 'TextBox':
    case 'DateBox':
    case 'ComboBox':
    case 'PasswordBox':
      return typeof value === 'string' ? value : '';
    case 'MultiInput':
      if (!Array.isArray(value)) {
        const row = widget.subtypes.map((subtype) => initialValue(subtype, null));
        if (row.length === 1) {
          return row;
        }
        return [row];
      }
      return value.map((v) => {
        if (Array.isArray(v)) {
          return v.map((vv, idx) => initialValue(widget.subtypes[idx], vv));
        }
        return initialValue(widget.subtypes[0], v);
      });
    default:
      return value;
  }
}

export function invalidMessage(widget): string {
  if (widget.invalidMessage === undefined) {
    return '';
  }
  switch (widget.type) {
    case 'TextBox':
    case 'DateBox':
    case 'ComboBox':
    case 'PasswordBox':
      return widget.invalidMessage;
    case 'MultiInput':
      return widget.invalidMessage.all;
    default:
      return '';
  }
}
