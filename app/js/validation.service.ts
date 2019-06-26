export class ValidationService {
  constructor() { }

  required(value) {
    return value.length > 0 ? null : { error: 'Поле обязательно к заполнению' }
  };

  minSize(min) {
    return function (value) {
      if (value.length) {
        return value.length > min ? null : {
          error: `в строке должно быть больше ${min} символов`
        };
      }
    }
  }

  phone(phone) {
    const reg = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/gi;
    const isValid = reg.test(phone) && phone.length === 18;

    return isValid ? null : {
      error: 'Введите номер телефона в формате +7 (XXX) XXX-XX-XX'
    };
  }

  test(elem, validators) {
    var field = elem.querySelector('input') || elem.querySelector('textarea');

    field.addEventListener('input', function () {
      if (!elem.classList.contains('not-focus')) {

        this.onValidation(elem, validators);

        if (!elem.classList.contains('error')) {
          elem.classList.add('focus');
        } else {
          elem.classList.remove('focus');
        }
      }
    });
  }

  injectErrorMsg(elem, errorTxt) {
    var errorBlock = elem.querySelector('.Form__work-profile__block__wrapper__validation');

    errorBlock.innerHTML = '';

    if (errorTxt.length) {
      errorBlock.innerHTML = `<div class="Form__work-profile__block__wrapper__validation__text">${errorTxt}</div>`;
    }
  }

  clearErrorMsg(elem) {
    var errorBlock = elem.querySelector('.Form__work-profile__block__wrapper__validation');

    errorBlock.innerHTML = '';
  }

  validate(field, validators): boolean {
    return field.value.length ? true : false;

    // for (var i = 0; i < validators.length; i++) {
    //   var isError = validators[i](value);

    //   if (isError && isError.hasOwnProperty('error')) {
    //     elem.classList.add('error');

    //     this.injectErrorMsg(elem, isError.error);

    //     return false;
    //   }
    // }

    // elem.classList.remove('error');

    // this.clearErrorMsg(elem);

    // return true;
  }
}