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
  function required(_widget, _value) {
    switch (_widget.type) {
      case 'TextBox':
      case 'DateBox':
      case 'ComboBox':
      case 'PasswordBox':
      case 'MultiInput':
        return _widget.required && isEmpty(_widget, _value) ? _('This value is required') : '';
      default:
        return '';
    }
  }

  function getFirstInvalidMessage(_widget, _value) {
    const validators = [required, ...(_widget.validators ?? [])];
    let message = '';
    validators.some((validator) => {
      const iMessage = validator(_widget, _value);
      if ((iMessage ?? '') !== '') {
        message = iMessage;
        return true;
      }
      return false;
    });
    return message;
  }

  switch (widget.type) {
    case 'TextBox':
    case 'DateBox':
    case 'ComboBox':
    case 'PasswordBox':
      widget.invalidMessage = getFirstInvalidMessage(widget, value);
      break;
    case 'MultiInput':
      widget.invalidMessage = {
        all: getFirstInvalidMessage(widget, value),
        values: value.map((row) => {
          if (Array.isArray(row)) {
            return row.map((vv, idx) => getFirstInvalidMessage(widget.subtypes[idx], vv));
          }
          return getFirstInvalidMessage(widget.subtypes[0], row);
        }),
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
